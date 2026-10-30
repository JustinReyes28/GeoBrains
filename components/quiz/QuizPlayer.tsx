'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Flame, Globe2, Heart, Home, Lightbulb, SkipForward, Timer, XCircle } from 'lucide-react';
import { categoryLabels, categorySlugs, modeDetails, type CategoryId, type Mode } from '@/src/lib/quiz/config';
import { gameReducer, initialGame } from '@/src/lib/quiz/reducer';
import { saveProgress } from '@/src/lib/quiz/progress';
import type { QuizConfig } from '@/src/lib/quiz/schema';
import type { Answer, QuizRound, RoundSummary } from '@/src/lib/quiz/types';
import { recordQuizScore } from '@/src/lib/user-actions';
import { useProgress } from '@/src/lib/quiz/use-progress';
import { QuizSetup } from './QuizSetup';
import { QuizResults } from './QuizResults';
interface Props {
    category?: CategoryId;
    initialMode?: Mode;
}
export function QuizPlayer({ category, initialMode = 'classic' }: Props) {
    const [config, setConfig] = useState<QuizConfig>({ category: category ?? 'mixed', mode: initialMode, region: 'World', difficulty: 'standard', count: 10 });
    const [state, dispatch] = useReducer(gameReducer, initialGame);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useProgress();
    const [saveStatus, setSaveStatus] = useState('Saving your progress…');
    const [imageFailed, setImageFailed] = useState(false);
    const [prevQuestionKey, setPrevQuestionKey] = useState<string | null>(null);
    const request = useRef<AbortController | null>(null);
    const saved = useRef(new Set<string>());
    const promptRef = useRef<HTMLHeadingElement>(null);

    const currentQuestionKey = state.round ? `${state.startedAt}:${state.index}` : null;
    if (currentQuestionKey !== prevQuestionKey) {
        setPrevQuestionKey(currentQuestionKey);
        setImageFailed(false);
    }
    useEffect(() => () => request.current?.abort(), []);
    const start = async () => {
        request.current?.abort();
        const controller = new AbortController();
        request.current = controller;
        setLoading(true);
        setError('');
        try {
            const query = new URLSearchParams({ ...config, count: String(config.mode === 'sprint' ? 50 : config.count) });
            const response = await fetch('/api/quiz?' + query, { signal: controller.signal, cache: 'no-store' });
            if (!response.ok)
                throw new Error(response.status === 429 ? 'Too many requests. Wait a moment, then try again.' : 'Could not load this challenge. Please try again.');
            const round: QuizRound = await response.json();
            if (!round.questions.length)
                throw new Error('No questions in this category and region yet. Try World or another category.');
            dispatch({ type: 'start', round, now: Date.now() });
        }
        catch (e) {
            if (!controller.signal.aborted)
                setError(e instanceof Error ? e.message : 'Could not load this challenge. Try again.');
        }
        finally {
            if (!controller.signal.aborted)
                setLoading(false);
        }
    };
    const answer = useCallback((value: string | null) => dispatch({ type: 'answer', answer: value, now: Date.now() }), []);
    const next = useCallback(() => dispatch({ type: 'next', now: Date.now() }), []);
    useEffect(() => {
        if (state.phase !== 'playing' || state.round?.config.mode !== 'sprint')
            return;
        const tick = () => dispatch({ type: 'tick', now: Date.now() });
        const timer = setInterval(tick, 250);
        document.addEventListener('visibilitychange', tick);
        return () => { clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
    }, [state.phase, state.round]);
    useEffect(() => {
        if (state.phase === 'playing')
            promptRef.current?.focus();
    }, [state.index, state.phase]);
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (state.phase !== 'playing' || !state.round || event.repeat || event.ctrlKey || event.metaKey || event.altKey)
                return;
            const target = event.target as HTMLElement;
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable)
                return;
            const q = state.round.questions[state.index];
            if (!state.answered && /^[1-6]$/.test(event.key)) {
                const option = q.options[Number(event.key) - 1];
                if (option) {
                    event.preventDefault();
                    answer(option);
                }
            }
            if (state.answered && event.key === 'Enter' && target.tagName !== 'BUTTON') {
                event.preventDefault();
                next();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [state, answer, next]);
    useEffect(() => {
        if (state.phase !== 'results' || !state.round)
            return;
        const round = state.round;
        const id = round.config.mode === 'daily' ? 'daily:' + round.date : String(state.startedAt);
        if (saved.current.has(id))
            return;
        saved.current.add(id);
        const correct = state.answers.filter(a => a.correct).length;
        const summary: RoundSummary = { id, date: new Date().toISOString(), category: round.config.category, mode: round.config.mode, correct, total: state.answers.length, bestStreak: state.bestStreak, elapsed: Math.min(state.elapsed, 86400), ...(round.date ? { dailyDate: round.date } : {}) };
        let localSaved = false;
        try {
            localSaved = saveProgress(localStorage, summary);
            window.dispatchEvent(new Event('geobrains-progress'));
        }
        catch { /* The round still finishes when storage is unavailable. */ }
        const localMessage = localSaved ? 'Progress saved on this browser.' : 'Browser storage is unavailable; this result will not persist.';
        setSaveStatus(localMessage);
        if (round.config.mode === 'classic' && round.config.category !== 'mixed' && state.answers.length === round.questions.length) {
            setSaveStatus(localMessage + ' Saving account score…');
            void recordQuizScore(correct, round.questions.length, categorySlugs[round.config.category], Math.min(state.elapsed, 86400)).then(result => setSaveStatus(localMessage + (result.success ? ' Account score saved.' : result.error === 'Unauthorized' ? ' Sign in to save Classic category scores to your account.' : ' Account score could not be saved.'))).catch(() => setSaveStatus(localMessage + ' Account score could not be saved.'));
        }
    }, [state]);
    const retry = (missed: Answer[]) => {
        if (!state.round)
            return;
        const round: QuizRound = { ...state.round, date: undefined, config: { ...state.round.config, mode: 'practice', count: missed.length }, questions: missed.map(a => a.question), available: missed.length };
        dispatch({ type: 'start', round, now: Date.now() });
    };
    const header = <header className="border-b border-white/10">
        <nav aria-label="Quiz navigation" className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center gap-3">
            <Link href="/" className="flex gap-2 items-center font-bold">
                <Globe2 aria-hidden="true" className="text-brand w-6 h-6" />GeoBrains</Link>
            <Link href="/" className="secondary-button text-sm">
                <Home aria-hidden="true" className="w-4 h-4" />All challenges</Link>
        </nav>
    </header>;
    if (state.phase === 'setup')
        return <div className="min-h-screen">{header}<QuizSetup config={config} setConfig={setConfig} start={start} loading={loading} error={error} fixedCategory={category} history={history} />
        </div>;
    if (!state.round)
        return null;
    const round = state.round;
    if (state.phase === 'results')
        return <div className="min-h-screen">{header}{error && <p role="alert" className="error-message max-w-3xl mx-auto mt-4">{error}</p>}<QuizResults round={round} answers={state.answers} bestStreak={state.bestStreak} elapsed={state.elapsed} saveStatus={saveStatus} replay={start} setup={() => dispatch({ type: 'setup' })} retry={retry} loading={loading} />
        </div>;
    const q = round.questions[state.index];
    const correct = state.answers.filter(a => a.correct).length;
    const last = state.index + 1 === round.questions.length || (round.config.mode === 'survival' && state.lives <= 0);
    return <div className="min-h-screen">{header}<main className="max-w-3xl mx-auto px-4 py-7 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm">
            <p className="text-text-secondary">{modeDetails[round.config.mode].name} · {categoryLabels[q.category]}</p>
            <div className="flex items-center gap-4 font-bold">
                <span>{correct} correct</span>{state.streak > 1 && <span className="flex items-center gap-1 text-amber-300">
                    <Flame aria-hidden="true" className="w-4 h-4" />{state.streak}</span>}{round.config.mode === 'sprint' && <span role="timer" aria-label={state.remaining + ' seconds remaining'} className={'flex items-center gap-1 ' + (state.remaining <= 10 ? 'text-rose-300' : 'text-brand')}>
                        <Timer aria-hidden="true" className="w-4 h-4" />{state.remaining}s</span>}{round.config.mode === 'survival' && <span className="flex items-center gap-1 text-rose-300">
                            <Heart aria-hidden="true" className="w-4 h-4" />{state.lives} lives</span>}</div>
        </div>
        <div role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={round.questions.length} aria-valuenow={state.index + (state.answered ? 1 : 0)} className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-7">
            <div className="bg-brand h-full transition-all" style={{ width: ((state.index + (state.answered ? 1 : 0)) / round.questions.length * 100) + '%' }} />
        </div>
        <section className="glass-panel rounded-3xl p-5 sm:p-8" aria-labelledby="question-title">
            <p className="text-sm text-text-secondary mb-3">Question {state.index + 1} of {round.questions.length}</p>
            <h1 ref={promptRef} tabIndex={-1} id="question-title" className="text-2xl sm:text-3xl font-black mb-6 leading-tight focus:outline-none">{q.prompt}</h1>
            {q.image && !imageFailed && <div className={'quiz-image ' + (q.imageKind === 'flag' ? 'flag-image' : '')}>{q.imageKind === 'photo' ? <Image key={q.id} src={q.image} alt={q.category === 'people' ? q.subject : 'Landmark to identify'} width={480} height={300} sizes="(max-width: 640px) 90vw, 600px" quality={60} onError={() => setImageFailed(true)} /> : <img key={q.id} src={q.image} alt={q.imageKind === 'flag' ? 'Flag to identify' : q.category === 'people' ? q.subject : 'Landmark to identify'} width={480} height={300} onError={() => setImageFailed(true)} decoding="async" referrerPolicy="no-referrer" />}</div>}
            {imageFailed && <p className="error-message mb-5">The image could not load. You can skip this question or use the available clues.</p>}
            {q.category === 'people' && <p className="text-text-secondary mb-5">{q.hint}</p>}
            <div className="grid sm:grid-cols-2 gap-3">{q.options.map((option, i) => {
                const showCorrect = state.answered && option === q.correctAnswer;
                const wrong = state.answered && state.selected === option && !showCorrect;
                return <button key={option} onClick={() => answer(option)} disabled={state.answered || state.hidden.includes(option)} className={'answer-button ' + (showCorrect ? 'answer-correct ' : wrong ? 'answer-wrong ' : '') + (state.hidden.includes(option) ? 'invisible' : '')} aria-label={(i + 1) + '. ' + option + (showCorrect ? ' — correct answer' : wrong ? ' — your incorrect answer' : '')}>
                    <span className="answer-number" aria-hidden="true">{i + 1}</span>
                    <span className="flex-1">{option}</span>{showCorrect && <CheckCircle2 aria-hidden="true" className="w-5 h-5 shrink-0" />}{wrong && <XCircle aria-hidden="true" className="w-5 h-5 shrink-0" />}
                </button>;
            })}</div>
            <div className="flex flex-wrap justify-between gap-3 mt-5">{!state.answered && <>{round.config.mode === 'practice' && <button onClick={() => dispatch({ type: 'hint' })} disabled={state.hinted} className="secondary-button text-sm">
                <Lightbulb aria-hidden="true" className="w-4 h-4" />{state.hinted ? 'Hint used' : '50/50 hint'}</button>}<button onClick={() => answer(null)} className="secondary-button text-sm ml-auto">
                    <SkipForward aria-hidden="true" className="w-4 h-4" />Skip</button>
            </>}</div>
            {state.hinted && !state.answered && <p className="text-sm text-brand mt-4">{q.hint}</p>}
        </section>
        {state.answered && <section aria-live="polite" aria-atomic="true" className="glass-panel rounded-2xl p-5 sm:p-6 mt-5">
            <h2 className={'text-xl font-bold mb-2 ' + (state.selected === q.correctAnswer ? 'text-emerald-300' : 'text-amber-300')}>{state.selected === q.correctAnswer ? 'Correct!' : state.selected === null ? 'Question skipped' : 'Keep exploring'}{state.selected !== q.correctAnswer && ' · ' + q.correctAnswer}</h2>
            <p className="text-text-secondary leading-relaxed mb-5">{q.explanation}</p>
            <button onClick={next} className="primary-button w-full sm:w-auto">{last ? 'See results' : 'Next question'}<ArrowRight aria-hidden="true" className="w-4 h-4" />
            </button>
        </section>}
        <p className="text-xs text-text-secondary mt-6">Keyboard: 1–{q.options.length} to answer · Enter to continue. Skips count as incorrect.</p>
    </main>
    </div>;
}
