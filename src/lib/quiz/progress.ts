import { z } from 'zod';
import { categoryIds, modes } from './config';
import type { RoundSummary } from './types';
const historySchema = z.array(z.object({ id: z.string().max(100), date: z.iso.datetime(), category: z.enum(categoryIds), mode: z.enum(modes), correct: z.number().int().min(0).max(50), total: z.number().int().min(0).max(50), bestStreak: z.number().int().min(0).max(50), elapsed: z.number().int().min(0).max(86400), dailyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).refine(r => r.correct <= r.total)).max(30);
export const PROGRESS_KEY = 'geobrains.progress.v1';
export interface ProgressStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export function readProgress(storage: Pick<ProgressStorage, 'getItem'>): RoundSummary[] {
    try {
        const parsed = historySchema.safeParse(JSON.parse(storage.getItem(PROGRESS_KEY) ?? '[]'));
        return parsed.success ? parsed.data : [];
    }
    catch {
        return [];
    }
}
export function saveProgress(storage: ProgressStorage, summary: RoundSummary): boolean {
    try {
        const history = readProgress(storage);
        if (history.some(r => r.id === summary.id))
            return true;
        const parsed = historySchema.safeParse([summary, ...history].slice(0, 30));
        if (!parsed.success)
            return false;
        storage.setItem(PROGRESS_KEY, JSON.stringify(parsed.data));
        return true;
    }
    catch {
        return false;
    }
}
