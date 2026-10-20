export class RateLimiter {
    private buckets = new Map<string, {
        timestamps: number[];
        expiresAt: number;
    }>();
    constructor(private maxKeys = 1000) { }
    get size() { return this.buckets.size; }
    check(key: string, limit: number, windowMs: number, now = Date.now()) {
        if (!this.buckets.has(key) && this.buckets.size >= this.maxKeys) {
            for (const [storedKey, bucket] of this.buckets)
                if (bucket.expiresAt <= now)
                    this.buckets.delete(storedKey);
            if (this.buckets.size >= this.maxKeys) {
                const oldest = this.buckets.keys().next().value;
                if (oldest !== undefined)
                    this.buckets.delete(oldest);
            }
        }
        const timestamps = (this.buckets.get(key)?.timestamps ?? []).filter(t => t > now - windowMs);
        const allowed = timestamps.length < limit;
        if (allowed)
            timestamps.push(now);
        this.buckets.set(key, { timestamps, expiresAt: now + windowMs });
        return { allowed, remaining: Math.max(0, limit - timestamps.length), retryAfter: Math.max(1, Math.ceil(((timestamps[0] ?? now) + windowMs - now) / 1000)) };
    }
}
