import { z } from 'zod';
import { categoryIds, difficulties, modes, regions } from './config';
export const quizQuerySchema = z.object({
    category: z.enum(categoryIds).default('mixed'), mode: z.enum(modes).default('classic'),
    region: z.enum(regions).default('World'), difficulty: z.enum(difficulties).default('standard'),
    count: z.coerce.number().int().min(1).max(50).default(10),
});
export type QuizConfig = z.infer<typeof quizQuerySchema>;
export function parseQuizQuery(url: string, category?: string) {
    const params = Object.fromEntries(new URL(url).searchParams);
    return quizQuerySchema.safeParse({ ...params, ...(category ? { category } : {}) });
}
export const scoreInputSchema = z.object({
    score: z.number().int().min(0).max(50000), totalQuestions: z.number().int().min(1).max(50000),
    categorySlug: z.enum(['world-capitals', 'world-flags', 'world-borders', 'world-landmarks', 'famous-people', 'world-currencies', 'world-languages', 'world-regions', 'world-tour', 'map-locations', 'stats-war']),
    timeInSeconds: z.number().int().min(0).max(86400), isRawValue: z.boolean(),
}).refine(v => v.score <= v.totalQuestions && (!v.isRawValue || (v.categorySlug === 'stats-war' && v.score <= 50)));
