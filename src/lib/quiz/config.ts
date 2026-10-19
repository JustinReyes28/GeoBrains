export const categoryIds = ['capitals', 'flags', 'borders', 'landmarks', 'people', 'currencies', 'languages', 'regions', 'mixed'] as const;
export type CategoryId = typeof categoryIds[number];
export const regions = ['World', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const;
export const modes = ['classic', 'practice', 'sprint', 'survival', 'daily'] as const;
export type Mode = typeof modes[number];
export const difficulties = ['easy', 'standard', 'hard'] as const;
export type Difficulty = typeof difficulties[number];
export const categoryLabels: Record<CategoryId, string> = { capitals: 'Capitals', flags: 'Flags', borders: 'Borders', landmarks: 'Landmarks', people: 'Famous people', currencies: 'Currencies', languages: 'Languages', regions: 'World regions', mixed: 'World tour' };
export const categorySlugs: Record<CategoryId, string> = { capitals: 'world-capitals', flags: 'world-flags', borders: 'world-borders', landmarks: 'world-landmarks', people: 'famous-people', currencies: 'world-currencies', languages: 'world-languages', regions: 'world-regions', mixed: 'world-tour' };
export const modeDetails: Record<Mode, {
    name: string;
    description: string;
}> = {
    classic: { name: 'Classic', description: 'A complete round at your own pace.' },
    practice: { name: 'Practice', description: 'Learn with 50/50 hints and no pressure.' },
    sprint: { name: 'Sprint', description: 'How many can you get in 60 seconds?' },
    survival: { name: 'Survival', description: 'Three lives. Make every answer count.' },
    daily: { name: 'Daily challenge', description: 'The same 10 questions for everyone, refreshed at midnight UTC.' },
};
