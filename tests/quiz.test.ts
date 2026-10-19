import assert from 'node:assert/strict';
import { test } from 'node:test';
import { access } from 'node:fs/promises';
import { categoryIds, regions } from '../src/lib/quiz/config';
import { generateRound, contentCounts } from '../src/lib/quiz/questions';
import { parseQuizQuery, quizQuerySchema, scoreInputSchema } from '../src/lib/quiz/schema';
import { gameReducer, initialGame } from '../src/lib/quiz/reducer';
import { seededRandom, shuffle } from '../src/lib/quiz/random';
import { PROGRESS_KEY, readProgress, saveProgress, type ProgressStorage } from '../src/lib/quiz/progress';
import { countryByCode, worldCountries } from '../src/lib/data/world';
import { landmarksData } from '../src/lib/data/landmarks';
import { famousPeopleData } from '../src/lib/data/famous_people';
import { RateLimiter } from '../src/lib/rate-limit';
import type { RoundSummary } from '../src/lib/quiz/types';
const config = quizQuerySchema.parse({ category: 'capitals', count: 5 });
const round = generateRound(config);
const start = () => gameReducer(initialGame, { type: 'start', round, now: 1000 });
test('query validation rejects malformed counts and unknown filters', () => {
    for (const count of ['0', '-1', '1.2', 'abc', 'Infinity', '51', '999999', ''])
        assert.equal(parseQuizQuery('http://localhost/api/quiz?count=' + count).success, false, count);
    for (const query of ['region=Atlantis', 'category=nope', 'mode=ranked', 'difficulty=impossible'])
        assert.equal(parseQuizQuery('http://localhost/api/quiz?' + query).success, false, query);
    assert.equal(parseQuizQuery('http://localhost/api/quiz').success, true);
    assert.equal(parseQuizQuery('http://localhost/api/quiz?count=50').success, true);
});
test('shuffle is repeatable with a seed, preserves items, and does not mutate input', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const first = shuffle(input, seededRandom('same'));
    assert.deepEqual(first, shuffle(input, seededRandom('same')));
    assert.deepEqual([...first].sort(), input);
    assert.deepEqual(input, [1, 2, 3, 4, 5, 6]);
    const seen = new Set(Array.from({ length: 100 }, (_, i) => shuffle(input, seededRandom(String(i)))[0]));
    assert.equal(seen.size, input.length);
});
test('snapshot covers 195 distinct countries and valid centers', () => {
    assert.equal(worldCountries.length, 195);
    assert.equal(new Set(worldCountries.map(c => c.code)).size, 195);
    assert.equal(new Set(worldCountries.map(c => c.cca3)).size, 195);
    assert.deepEqual([...new Set(worldCountries.map(c => c.region))].sort(), regions.filter(r => r !== 'World').sort());
    for (const c of worldCountries) {
        assert.ok(Number.isFinite(c.centerLat) && Math.abs(c.centerLat) <= 90, c.name);
        assert.ok(Number.isFinite(c.centerLng) && Math.abs(c.centerLng) <= 180, c.name);
        assert.ok(c.languages.length, c.name);
        assert.ok(c.currencies.length, c.name);
    }
    assert.equal(worldCountries.find(c => c.code === 'LK')?.capitals[0], 'Sri Jayawardenepura Kotte');
    assert.equal(worldCountries.find(c => c.code === 'ZW')?.currencies[0].code, 'ZWG');
});
test('all local landmark and portrait paths exist', async () => {
    for (const image of [...landmarksData.map(l => l.imagePath), ...famousPeopleData.flatMap(p => p.imageUrl ? [p.imageUrl] : [])])
        await access('public' + image);
});
test('all categories and regions produce unique questions with one valid answer', () => {
    for (const category of categoryIds)
        for (const region of regions)
            for (const difficulty of ['easy', 'standard', 'hard'] as const) {
                const generated = generateRound({ ...config, category, region, difficulty, count: 50 });
                assert.ok(generated.questions.length <= 50);
                assert.equal(new Set(generated.questions.map(q => q.id)).size, generated.questions.length);
                for (const q of generated.questions) {
                    assert.equal(new Set(q.options).size, q.options.length, q.id);
                    assert.ok(q.options.length >= 3 && q.options.length <= 6, q.id);
                    assert.equal(q.options.filter(o => o === q.correctAnswer).length, 1, q.id);
                    if (region !== 'World')
                        assert.equal(q.region, region, q.id);
                    const country = worldCountries.find(c => c.code === q.id.split(':')[1]);
                    const accepted = q.category === 'languages' ? country?.languages : q.category === 'currencies' ? country?.currencies.map(c => c.name) : q.category === 'capitals' ? country?.capitals : q.category === 'borders' ? country?.borders.map(code => countryByCode.get(code)?.name).filter(Boolean) : undefined;
                    if (accepted)
                        assert.equal(q.options.filter(option => accepted.includes(option)).length, 1, q.id + ' must not contain another valid answer');
                    if (q.category === 'borders')
                        assert.ok(!q.options.includes(q.subject));
                }
            }
    assert.equal(contentCounts.flags, 195);
    assert.equal(contentCounts.regions, 195);
    assert.ok(contentCounts.mixed > 1000);
});
test('daily round ignores customization and stays fixed until UTC rollover', () => {
    const today = new Date('2026-10-19T00:00:01Z');
    const later = new Date('2026-10-19T23:59:59Z');
    const a = generateRound({ ...config, mode: 'daily' }, today);
    const b = generateRound({ ...config, mode: 'daily', region: 'Africa', difficulty: 'hard', count: 50 }, later);
    assert.deepEqual(a, b);
    assert.equal(a.questions.length, 10);
    assert.equal(a.date, '2026-10-19');
    assert.ok(new Set(a.questions.map(q => q.category)).size >= 7);
    assert.notDeepEqual(a.questions, generateRound({ ...config, mode: 'daily' }, new Date('2026-10-20T00:00:00Z')).questions);
});
test('answer and next guards prevent duplicate clicks from changing the score or skipping questions', () => {
    let state = start();
    state = gameReducer(state, { type: 'answer', answer: round.questions[0].correctAnswer, now: 2000 });
    const answered = state;
    assert.equal(state.answers.length, 1);
    assert.equal(state.streak, 1);
    assert.equal(gameReducer(state, { type: 'answer', answer: null, now: 2100 }), answered);
    state = gameReducer(state, { type: 'next', now: 2200 });
    const next = state;
    state = gameReducer(state, { type: 'next', now: 2200 });
    assert.equal(state, next);
    assert.equal(state.index, 1);
    assert.equal(state.answered, false);
    assert.equal(gameReducer(state, { type: 'answer', answer: 'tampered answer', now: 2300 }), state);
});
test('replays reset selected answer, hints, streak, lives, history and timer', () => {
    let state = start();
    state = gameReducer(state, { type: 'answer', answer: null, now: 5000 });
    state = gameReducer(state, { type: 'start', round, now: 6000 });
    assert.equal(state.answers.length, 0);
    assert.equal(state.answered, false);
    assert.equal(state.selected, null);
    assert.equal(state.lives, 3);
    assert.equal(state.elapsed, 0);
    assert.equal(state.streak, 0);
    assert.equal(state.startedAt, 6000);
});
test('practice hints leave the answer visible and reject hidden options', () => {
    const practice = { ...round, config: { ...round.config, mode: 'practice' as const } };
    let state = gameReducer(initialGame, { type: 'start', round: practice, now: 1000 });
    state = gameReducer(state, { type: 'hint' });
    assert.equal(state.hidden.length, round.questions[0].options.length - 2);
    assert.ok(!state.hidden.includes(round.questions[0].correctAnswer));
    assert.equal(gameReducer(state, { type: 'answer', answer: state.hidden[0], now: 2000 }), state);
    state = gameReducer(state, { type: 'answer', answer: round.questions[0].correctAnswer, now: 2000 });
    assert.equal(state.answers[0].hinted, true);
    assert.equal(gameReducer(start(), { type: 'hint' }).hinted, false);
});
test('survival ends after exactly three mistakes', () => {
    const survival = { ...round, config: { ...round.config, mode: 'survival' as const } };
    let state = gameReducer(initialGame, { type: 'start', round: survival, now: 1000 });
    for (let i = 0; i < 3; i++) {
        state = gameReducer(state, { type: 'answer', answer: null, now: 2000 + i });
        state = gameReducer(state, { type: 'next', now: 3000 + i });
    }
    assert.equal(state.lives, 0);
    assert.equal(state.phase, 'results');
    assert.equal(state.answers.length, 3);
});
test('sprint uses elapsed wall time and rejects answers after its deadline', () => {
    const sprint = { ...round, config: { ...round.config, mode: 'sprint' as const } };
    let state = gameReducer(initialGame, { type: 'start', round: sprint, now: 1000 });
    state = gameReducer(state, { type: 'tick', now: 60000 });
    assert.equal(state.remaining, 1);
    state = gameReducer(state, { type: 'answer', answer: round.questions[0].correctAnswer, now: 61000 });
    assert.equal(state.phase, 'results');
    assert.equal(state.answers.length, 0);
    assert.equal(state.remaining, 0);
    state = gameReducer(initialGame, { type: 'start', round: sprint, now: 1000 });
    state = gameReducer(state, { type: 'tick', now: 70000 });
    assert.equal(state.phase, 'results');
    assert.equal(state.remaining, 0);
});
test('final correct answer is counted when finishing the round', () => {
    let state = start();
    for (const q of round.questions) {
        state = gameReducer(state, { type: 'answer', answer: q.correctAnswer, now: 2000 });
        state = gameReducer(state, { type: 'next', now: 3000 });
    }
    assert.equal(state.phase, 'results');
    assert.equal(state.answers.filter(a => a.correct).length, round.questions.length);
    assert.equal(state.bestStreak, round.questions.length);
});
function memoryStorage(): ProgressStorage { const items = new Map<string, string>(); return { getItem: key => items.get(key) ?? null, setItem: (key, value) => { items.set(key, value); } }; }
const summary: RoundSummary = { id: '1', date: '2026-10-19T00:00:00.000Z', category: 'capitals', mode: 'classic', correct: 3, total: 5, bestStreak: 2, elapsed: 15 };
test('progress recovers from corrupt/blocked storage and is bounded and deduplicated', () => {
    const storage = memoryStorage();
    storage.setItem(PROGRESS_KEY, 'broken');
    assert.deepEqual(readProgress(storage), []);
    assert.equal(saveProgress(storage, summary), true);
    assert.equal(saveProgress(storage, summary), true);
    assert.equal(readProgress(storage).length, 1);
    for (let i = 0; i < 40; i++)
        saveProgress(storage, { ...summary, id: String(i) });
    assert.equal(readProgress(storage).length, 30);
    const blocked = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('full'); } };
    assert.deepEqual(readProgress(blocked), []);
    assert.equal(saveProgress(blocked, summary), false);
    assert.equal(saveProgress(storage, { ...summary, correct: 99 }), false);
});
test('score validation rejects invalid percentages, arbitrary categories, infinities and raw score abuse', () => {
    const input = { score: 5, totalQuestions: 10, categorySlug: 'world-capitals', timeInSeconds: 60, isRawValue: false };
    assert.equal(scoreInputSchema.safeParse(input).success, true);
    for (const bad of [{ score: -1 }, { score: Infinity }, { score: NaN }, { totalQuestions: 0 }, { score: 11 }, { timeInSeconds: -1 }, { categorySlug: 'arbitrary' }, { isRawValue: true }])
        assert.equal(scoreInputSchema.safeParse({ ...input, ...bad }).success, false);
    assert.equal(scoreInputSchema.safeParse({ ...input, score: 9500, totalQuestions: 10000, categorySlug: 'map-locations' }).success, true);
});
test('rate limiter enforces windows and bounds memory', () => {
    const limiter = new RateLimiter(3);
    assert.equal(limiter.check('a', 2, 1000, 0).allowed, true);
    assert.equal(limiter.check('a', 2, 1000, 100).allowed, true);
    assert.equal(limiter.check('a', 2, 1000, 200).allowed, false);
    assert.equal(limiter.check('a', 2, 1000, 1200).allowed, true);
    for (let i = 0; i < 100; i++)
        limiter.check(String(i), 2, 1000, 1201);
    assert.ok(limiter.size <= 3);
});
