'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { categoryLabels, modeDetails } from '@/src/lib/quiz/config';
import type { Answer, QuizRound } from '@/src/lib/quiz/types';
interface Props {
    round: QuizRound;
    answers: Answer[];
    bestStreak: number;
    elapsed: number;
    saveStatus: string;
    replay: () => void;
    setup: () => void;
    retry: (answers: Answer[]) => void;
    loading: boolean;
}
export function QuizResults({ round, answers, bestStreak, elapsed, saveStatus, replay, setup, retry, loading }: Props) {
    const correct = answers.filter(a => a.correct).length;
    const missed = answers.filter(a => !a.correct);
    const accuracy = answers.length ? Math.round(correct / answers.length * 100) : 0;
    return <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 mb-7">
            <Trophy aria-hidden="true" className="w-12 h-12 text-amber-300 mb-5" />
            <p className="text-brand font-bold text-sm mb-2">{modeDetails[round.config.mode].name} · {categoryLabels[round.config.category]}</p>
            <h1 tabIndex={-1} className="text-4xl font-black mb-3">Challenge complete</h1>
            <p className="text-text-secondary mb-7">{correct === answers.length && answers.length > 0 ? 'A perfect expedition. Ready for a new challenge?' : 'Every answer adds a little more of the world to your memory.'}</p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
                {[['Correct', correct + '/' + answers.length], ['Accuracy', accuracy + '%'], ['Best streak', bestStreak], ['Time', elapsed + 's']].map(([label, value]) => <div key={label} className="bg-white/5 rounded-xl p-4">
                    <dt className="text-text-secondary text-sm mb-2">{label}</dt>
                    <dd className="text-2xl font-black">{value}</dd>
                </div>)}
            </dl>
            {round.config.mode === 'survival' && <p className="text-text-secondary mb-4">{missed.length >= 3 ? 'Your three lives are used up.' : 'You reached the end of this round.'}</p>}
            <p role="status" className="text-sm text-text-secondary mb-6">{saveStatus}</p>
            <div className="flex flex-wrap gap-3">
                <button onClick={replay} disabled={loading} className="primary-button">
                    <RotateCcw aria-hidden="true" className="w-4 h-4" />{loading ? 'Preparing…' : 'Play again'}</button>
                {missed.length > 0 && <button className="secondary-button" onClick={() => retry(missed)}>Practice {missed.length} missed<ArrowRight aria-hidden="true" className="w-4 h-4" />
                </button>}
                <button className="secondary-button" onClick={setup}>Change challenge</button>
            </div>
        </div>
        <section aria-labelledby="review-title">
            <h2 id="review-title" className="text-2xl font-bold mb-4">Your expedition, reviewed</h2>
            {answers.length === 0 && <p className="text-text-secondary mb-5">No answers before the clock expired. Try Classic for an untimed round.</p>}
            <ol className="space-y-3">{answers.map((a, i) => <li key={a.question.id} className="glass-panel rounded-2xl p-5">
                <div className="flex gap-3">{a.correct ? <CheckCircle2 aria-hidden="true" className="w-5 h-5 shrink-0 text-emerald-400 mt-1" /> : <XCircle aria-hidden="true" className="w-5 h-5 shrink-0 text-rose-400 mt-1" />}<div className="min-w-0">
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{i + 1} · {categoryLabels[a.question.category]} · {a.correct ? 'Correct' : 'Review'}{a.hinted ? ' · Hint used' : ''}</p>
                    <h3 className="font-bold mb-2">{a.question.prompt}{a.question.category === 'landmarks' ? ' (' + a.question.correctAnswer + ')' : ''}</h3>
                    <p className="text-sm text-text-secondary">Your answer: {a.selected ?? 'Skipped'}{!a.correct && <>
                        <br />Correct answer: <span className="text-emerald-300">{a.question.correctAnswer}</span>
                    </>}</p>
                    <p className="text-sm text-text-secondary mt-2">{a.question.explanation}</p>
                </div>
                </div>
            </li>)}</ol>
        </section>
        <Link href="/" className="secondary-button mt-6 inline-flex">Back to all challenges</Link>
    </main>;
}
