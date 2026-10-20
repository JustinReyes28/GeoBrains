export type Random = () => number;
export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
// Stable 32-bit seed: deterministic daily ordering, never used for security.
export function seededRandom(seed: string): Random {
    let state = 2166136261;
    for (const char of seed)
        state = Math.imul(state ^ char.charCodeAt(0), 16777619);
    return () => { state += 0x6D2B79F5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
