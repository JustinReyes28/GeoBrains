import { worldCountries, countryByCode, CONTENT_VERSION } from '../data/world';
import { landmarksData } from '../data/landmarks';
import { famousPeopleData } from '../data/famous_people';
import { categoryIds, type CategoryId } from './config';
import { seededRandom, shuffle, type Random } from './random';
import type { QuizConfig } from './schema';
import type { QuizQuestion, QuizRound } from './types';
type Draft = Omit<QuizQuestion, 'options'> & {
    accepted: string[];
};
const base = (category: CategoryId, id: string, subject: string, region: string, prompt: string, accepted: string[], explanation: string, hint: string): Draft => ({ id: category + ':' + id, category, subject, region, prompt, accepted, correctAnswer: accepted[0], explanation, hint });
function createBank(): Draft[] {
    const bank: Draft[] = [];
    for (const c of worldCountries) {
        const regionHint = 'Think of ' + c.region + '.';
        const capitals = c.capitals;
        if (capitals.length && !['NR', 'PS'].includes(c.code))
            bank.push(base('capitals', c.code, c.name, c.region, c.code === 'LK' ? 'What is the legislative capital of Sri Lanka?' : capitals.length > 1 ? 'Which city is one of the capitals of ' + c.name + '?' : 'What is the capital of ' + c.name + '?', capitals, capitals.join(', ') + ' — ' + c.name + '.', regionHint));
        bank.push({ ...base('flags', c.code, 'Mystery flag', c.region, 'Which country does this flag belong to?', [c.name], 'This is the flag of ' + c.name + ' in ' + c.region + '.', regionHint), image: 'https://flagcdn.com/w160/' + c.code.toLowerCase() + '.png', imageKind: 'flag', countryCode: c.code });
        if (c.languages.length)
            bank.push(base('languages', c.code, c.name, c.region, 'Which language is listed for ' + c.name + '?', c.languages, 'Languages listed for ' + c.name + ': ' + c.languages.join(', ') + '.', regionHint));
        if (c.currencies.length)
            bank.push(base('currencies', c.code, c.name, c.region, 'Which currency is used in ' + c.name + '?', c.currencies.map(v => v.name), 'Currencies in this snapshot for ' + c.name + ': ' + c.currencies.map(v => v.name + ' (' + v.code + ')').join(', ') + '.', regionHint));
        bank.push(base('regions', c.code, c.name, c.region, 'In this atlas, which world region contains ' + c.name + '?', [c.region], c.name + ' is grouped in ' + c.region + ' in this atlas.', 'The atlas groups countries into five broad regions.'));
        const neighbors = c.borders.map(code => countryByCode.get(code)).filter(c => c !== undefined);
        if (neighbors.length)
            bank.push(base('borders', c.code, c.name, c.region, 'Which country shares a land border with ' + c.name + '?', neighbors.map(n => n.name), 'Recorded neighbors of ' + c.name + ': ' + neighbors.map(n => n.name).join(', ') + '.', regionHint));
    }
    for (const l of landmarksData)
        bank.push({ ...base('landmarks', l.id, 'Mystery landmark', l.region, 'Can you name this landmark?', [l.name], l.name + ' is in ' + l.city + ', ' + l.country + '.', 'Look in ' + l.country + '.'), image: l.imagePath, imageKind: 'photo', coordinates: l.coordinates });
    for (const p of famousPeopleData)
        bank.push({ ...base('people', p.person, p.person, p.region, 'Which country is ' + p.person + ' associated with?', [p.country], p.person + ' is associated with ' + p.country + '. ' + p.description + '.', p.description), image: p.imageUrl, imageKind: 'photo' });
    return bank;
}
const bank = createBank();
export const contentCounts = Object.fromEntries(categoryIds.map(id => [id, id === 'mixed' ? bank.length : bank.filter(q => q.category === id).length])) as Record<CategoryId, number>;
export function generateRound(input: QuizConfig, now = new Date()): QuizRound {
    const date = now.toISOString().slice(0, 10);
    const config: QuizConfig = input.mode === 'daily' ? { category: 'mixed', mode: 'daily', count: 10, region: 'World', difficulty: 'standard' } : { ...input };
    const random: Random = config.mode === 'daily' ? seededRandom(CONTENT_VERSION + ':' + date) : Math.random;
    const pool = bank.filter(q => (config.category === 'mixed' || q.category === config.category) && (config.region === 'World' || q.region === config.region));
    let selected: Draft[];
    if (config.category === 'mixed') {
        const groups = shuffle(categoryIds.filter(id => id !== 'mixed'), random).map(id => shuffle(pool.filter(q => q.category === id), random));
        selected = [];
        while (selected.length < config.count && groups.some(g => g.length))
            for (const group of groups) {
                const next = group.pop();
                if (next && selected.length < config.count)
                    selected.push(next);
            }
    }
    else
        selected = shuffle(pool, random).slice(0, config.count);
    const questions = selected.map(q => {
        const candidates = bank.filter(candidate => candidate.category === q.category && candidate.id !== q.id);
        const allAnswers = [...new Set(candidates.flatMap(candidate => candidate.accepted))].filter(answer => !q.accepted.includes(answer) && !(q.category === 'borders' && answer === q.subject));
        const regional = [...new Set(candidates.filter(c => c.region === q.region).flatMap(c => c.accepted))].filter(answer => allAnswers.includes(answer));
        const choices = config.difficulty === 'easy' ? 3 : config.difficulty === 'hard' ? 6 : 4;
        const ordered = config.difficulty === 'hard' ? [...shuffle(regional, random), ...shuffle(allAnswers.filter(a => !regional.includes(a)), random)] : shuffle(allAnswers, random);
        const correctAnswer = q.accepted[Math.floor(random() * q.accepted.length)];
        const { accepted: _accepted, ...question } = q;
        void _accepted;
        return { ...question, correctAnswer, options: shuffle([correctAnswer, ...ordered.slice(0, choices - 1)], random) };
    });
    return { config, questions, available: pool.length, ...(config.mode === 'daily' ? { date } : {}) };
}
