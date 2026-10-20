'use client';
import { Flame, Footprints } from 'lucide-react';
import { useProgress } from '@/src/lib/quiz/use-progress';
import { categoryLabels, modeDetails } from '@/src/lib/quiz/config';
export function ProgressSummary() {
    const history = useProgress();
    if (!history.length)
        return null;
    const best = Math.max(...history.map(r => r.bestStreak));
    return <section aria-labelledby="progress-title" className="glass-panel rounded-2xl p-5 sm:p-7 mt-10">
        <div className="flex flex-wrap justify-between gap-4 mb-4">
            <h2 id="progress-title" className="text-xl font-bold flex items-center gap-2">
                <Footprints aria-hidden="true" className="w-5 h-5 text-brand" />Your recent expeditions</h2>
            <p className="text-sm text-text-secondary flex items-center gap-1">
                <Flame aria-hidden="true" className="w-4 h-4 text-amber-300" />Personal best streak: <strong className="text-white">{best}</strong>
            </p>
        </div>
        <ul className="space-y-3">{history.slice(0, 3).map(r => <li key={r.id} className="flex flex-wrap justify-between gap-2 text-sm border-t border-white/10 pt-3">
            <span>{categoryLabels[r.category]} <span className="text-text-secondary">· {modeDetails[r.mode].name}</span>
            </span>
            <span>{r.correct}/{r.total} correct <span className="text-text-secondary">· {r.date.slice(0, 10)}</span>
            </span>
        </li>)}</ul>
        <p className="text-xs text-text-secondary mt-4">Saved on this browser · most recent 30 rounds</p>
    </section>;
}
