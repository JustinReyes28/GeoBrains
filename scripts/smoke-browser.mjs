// Optional local browser smoke test. Uses an existing Playwright installation;
// never installs packages or downloads a browser.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
const [modulePath, executablePath, baseURL = 'http://127.0.0.1:3100'] = process.argv.slice(2);
if (!modulePath || !executablePath)
    throw new Error('Usage: node scripts/smoke-browser.mjs <playwright/index.mjs> <browser-executable> [base-url]');
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
const external = [];
await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(baseURL).origin)
        return route.continue();
    external.push(url.hostname);
    return route.abort();
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
const cooldown=async(response)=>{
    const seconds=Math.max(1,Number(response.headers()['retry-after']??10));
    console.log('Rate limit reached; honoring Retry-After ('+seconds+'s).');
    let remaining=seconds*1000+100;
    while(remaining>0){const delay=Math.min(remaining,59000);await new Promise(resolve=>setTimeout(resolve,delay));remaining-=delay;}
};
const go=async(route)=>{
    for(let attempt=0;attempt<3;attempt++){
        const response=await page.goto(baseURL+route);
        if(response.status()===429){await cooldown(response);continue;}
        assert.equal(response.status(),200,'Navigation '+route+' returned '+response.status());
        await page.waitForLoadState('networkidle');return;
    }
    throw new Error('Navigation still rate limited');
};
const start=async()=>{
    for(let attempt=0;attempt<3;attempt++){
        const pending=page.waitForResponse(r=>r.url().includes('/api/quiz?'));
        await page.getByRole('button',{name:'Start challenge',exact:true}).click();
        const response=await pending;
        if(response.status()===429){await cooldown(response);continue;}
        assert.equal(response.status(),200,'Challenge returned '+response.status());
        const round=await response.json();
        await page.getByText('Question 1 of '+round.questions.length,{exact:true}).waitFor();
        return round;
    }
    throw new Error('Challenge still rate limited');
};
const choose = async (q, answer) => { await page.getByRole('button', { name: (q.options.indexOf(answer) + 1) + '. ' + answer, exact: true }).click(); };
try {
    await mkdir('private/qa', { recursive: true });
    await go('/');
    assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
    assert.equal(external.length, 0, 'Home must not request maps, images, or fonts from third parties');
    await page.screenshot({ path: 'private/qa/home-desktop.png', fullPage: true });
    console.log('PASS lightweight desktop home');
    await go('/guess-the-capital');
    await page.getByText('Practice',{exact:true}).click();
    await page.getByLabel('Round length').selectOption('5');
    await page.getByLabel('Region', { exact: true }).selectOption('Oceania');
    const round = await start();
    assert.equal(round.questions.length, 5);
    for (let i = 0; i < 5; i++) {
        const q = round.questions[i];
        if (i === 0) {
            await page.getByRole('heading', { level: 1 }).press(String(q.options.indexOf(q.correctAnswer) + 1));
            await page.getByRole('heading', { name: 'Correct!', exact: true }).waitFor();
        }
        else if (i === 1) {
            await page.getByRole('button', { name: '50/50 hint', exact: true }).click();
            const wrong = await page.locator('button.answer-button:visible:not([disabled])').all();
            let selected = false;
            for (const button of wrong) {
                if (!(await button.innerText()).includes(q.correctAnswer)) {
                    await button.click();
                    selected = true;
                    break;
                }
            }
            assert.ok(selected);
        }
        else
            await choose(q, q.correctAnswer);
        await page.getByRole('button', { name: i === 4 ? 'See results' : 'Next question', exact: true }).click();
    }
    await page.getByRole('heading', { name: 'Challenge complete', exact: true }).waitFor();
    assert.equal(await page.locator('ol > li').count(), 5);
    assert.ok((await page.locator('dl').innerText()).includes('4/5'));
    await page.getByText(/Progress saved on this browser/).waitFor();
    await page.getByRole('button', { name: 'Practice 1 missed', exact: true }).click();
    await page.getByText('Question 1 of 1', { exact: true }).waitFor();
    const retry = round.questions[1];
    await choose(retry, retry.correctAnswer);
    await page.getByRole('button', { name: 'See results', exact: true }).click();
    await page.getByRole('heading', { name: 'Challenge complete', exact: true }).waitFor();
    await go('/');
    await page.getByRole('heading', { name: 'Your recent expeditions', exact: true }).waitFor();
    console.log('PASS practice, keyboard answer, hint, review, retry mistakes, and persisted history');
    await go('/play?mode=survival');
    await page.getByLabel('Category', { exact: true }).selectOption('capitals');
    const survival = await start();
    for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: 'Skip', exact: true }).click();
        await page.getByRole('button', { name: i === 2 ? 'See results' : 'Next question', exact: true }).click();
    }
    await page.getByRole('heading', { name: 'Challenge complete', exact: true }).waitFor();
    assert.equal(await page.locator('ol > li').count(), 3);
    await page.getByRole('button', { name: 'Play again', exact: true }).click();
    await page.getByText('Question 1 of 10', { exact: true }).waitFor();
    await page.getByText('3 lives', { exact: true }).waitFor();
    assert.equal(await page.locator('button.answer-button[disabled]').count(), 0);
    assert.ok(survival.questions.length > 3);
    console.log('PASS survival and clean replay');
    await page.clock.install();
    await go('/play?mode=sprint');
    await page.getByLabel('Category', { exact: true }).selectOption('capitals');
    await start();
    await page.clock.fastForward(61000);
    await page.getByRole('heading', { name: 'Challenge complete', exact: true }).waitFor();
    assert.ok((await page.locator('dl').innerText()).includes('0/0'));
    await page.clock.resume();
    console.log('PASS sprint deadline in browser');
    await go('/play?mode=daily');
    const daily = await start();
    assert.equal(daily.questions.length, 10);
    assert.equal(daily.config.category, 'mixed');
    await page.screenshot({ path: 'private/qa/daily-desktop.png', fullPage: true });
    const firstDaily = await page.getByRole('heading', { level: 1 }).innerText();
    await go('/play?mode=daily');
    await start();
    assert.equal(await page.getByRole('heading', { level: 1 }).innerText(), firstDaily);
    console.log('PASS daily round consistency');
    await go('/guess-the-capital');
    let failOnce = true;
    await page.route('**/api/quiz?**', route => {
        if (failOnce) {
            failOnce = false;
            return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
        } return route.continue();
    });
    await page.getByRole('button', { name: 'Start challenge', exact: true }).click();
    await page.getByRole('alert').filter({hasText:'Could not load this challenge'}).waitFor();
    await start();
    await page.getByText('Question 1 of 10', { exact: true }).waitFor();
    console.log('PASS request failure recovery');
    await page.setViewportSize({ width: 390, height: 844 });
    await go('/');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await page.screenshot({ path: 'private/qa/home-mobile.png', fullPage: true });
    await go('/currencies-quiz');
    await page.getByLabel('Round length').selectOption('5');
    const mobile = await start();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await choose(mobile.questions[0], mobile.questions[0].correctAnswer);
    await page.getByRole('button', { name: 'Next question', exact: true }).waitFor();
    await page.screenshot({ path: 'private/qa/quiz-mobile.png', fullPage: true });
    console.log('PASS mobile home and quiz with no horizontal overflow');
    await go('/landmarks-quiz');
    await start();
    await page.locator('.quiz-image img').waitFor();
    await page.waitForFunction(()=>{const img=document.querySelector('.quiz-image img');return img&&img.complete&&img.naturalWidth>0;});
    console.log('PASS optimized local landmark image');
    await page.setViewportSize({width:375,height:812});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
    await page.setViewportSize({width:844,height:390});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
    console.log('PASS small phone and landscape layout');
    assert.deepEqual(errors, [], 'No uncaught browser errors');
    console.log('PASS no uncaught browser errors; all external requests blocked to preserve data');
}
catch(error){await page.screenshot({path:'private/qa/failure.png',fullPage:true});console.error((await page.locator('body').innerText()).slice(0,4000));throw error;}
finally {
    await context.close();
    await browser.close();
}
