'use client';
import { categoryIds, categoryLabels, difficulties, modeDetails, modes, regions, type CategoryId, type Mode } from '@/src/lib/quiz/config';
import type { QuizConfig } from '@/src/lib/quiz/schema';
import type { RoundSummary } from '@/src/lib/quiz/types';
import { Globe2, Timer, Heart, CalendarDays, BookOpen, ArrowRight } from 'lucide-react';
const icons = { classic: Globe2, practice: BookOpen, sprint: Timer, survival: Heart, daily: CalendarDays };
interface Props {
    config: QuizConfig;
    setConfig: (config: QuizConfig) => void;
    start: () => void;
    loading: boolean;
    error: string;
    fixedCategory?: CategoryId;
    history: RoundSummary[];
}
export function QuizSetup({ config, setConfig, start, loading, error, fixedCategory, history }: Props) {
    const today = new Date().toISOString().slice(0, 10);
    const daily = history.find(r => r.dailyDate === today);
    const dailyMode = config.mode === 'daily';
    return <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <p className="text-brand font-semibold mb-3 uppercase tracking-widest text-sm">Your next expedition</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">{fixedCategory ? categoryLabels[fixedCategory] : 'One world. So much to discover.'}</h1>
        <p className="text-text-secondary text-lg mb-9">Choose your challenge. Learn something new with every answer.</p>
        <fieldset className="mb-8">
            <legend className="font-bold mb-3">Game mode</legend>
            <div className="grid sm:grid-cols-2 gap-3">
                {modes.map(mode => {
                    const Icon = icons[mode];
                    return <label key={mode} className={'mode-choice ' + (config.mode === mode ? 'mode-selected' : '')}>
                        <input type="radio" name="mode" value={mode} checked={config.mode === mode} onChange={() => setConfig({ ...config, mode: mode as Mode })} className="sr-only" />
                        <Icon aria-hidden="true" className="w-6 h-6 shrink-0 text-brand" />
                        <span>
                            <span className="font-bold block">{modeDetails[mode].name}{mode === 'daily' && daily ? ' · Completed today' : ''}</span>
                            <span className="text-sm text-text-secondary">{modeDetails[mode].description}</span>
                        </span>
                    </label>;
                })}
            </div>
        </fieldset>
        {dailyMode ? <div className="glass-panel rounded-2xl p-5 mb-7">
            <h2 className="font-bold mb-2">Today’s world tour · {today} UTC</h2>
            <p className="text-text-secondary">10 mixed questions, standard difficulty, all regions. Everyone gets the same questions and choices today.</p>{daily && <p className="mt-3 text-brand">Your first result: {daily.correct}/{daily.total}. You can play again to learn.</p>}</div> : <div className="grid grid-cols-2 gap-4 mb-7">
            {!fixedCategory && <label className="field-label"><span id="quiz-category-label">Category</span><select aria-labelledby="quiz-category-label" value={config.category} onChange={e => setConfig({ ...config, category: e.target.value as CategoryId })}>{categoryIds.map(id => <option key={id} value={id}>{categoryLabels[id]}</option>)}</select>
            </label>}
            <label className="field-label"><span id="quiz-region-label">Region</span><select aria-labelledby="quiz-region-label" value={config.region} onChange={e => setConfig({ ...config, region: e.target.value as QuizConfig['region'] })}>{regions.map(region => <option key={region}>{region}</option>)}</select>
            </label>
            <label className="field-label"><span id="quiz-difficulty-label">Difficulty</span><select aria-labelledby="quiz-difficulty-label" value={config.difficulty} onChange={e => setConfig({ ...config, difficulty: e.target.value as QuizConfig['difficulty'] })}>{difficulties.map(d => <option key={d} value={d}>{d === 'easy' ? 'Easy · 3 choices' : d === 'standard' ? 'Standard · 4 choices' : 'Hard · up to 6 choices'}</option>)}</select>
            </label>
            {config.mode !== 'sprint' && <label className="field-label"><span id="quiz-length-label">Round length</span><select aria-labelledby="quiz-length-label" value={config.count} onChange={e => setConfig({ ...config, count: Number(e.target.value) })}>{[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} questions</option>)}</select>
            </label>}
        </div>}
        {config.difficulty === 'hard' && !dailyMode && <p className="text-sm text-text-secondary mb-5">Hard mode favors choices from the same region. Smaller answer pools may offer fewer choices.</p>}
        {config.mode === 'sprint' && <p className="text-sm text-text-secondary mb-5">60 seconds, up to 50 questions. The clock keeps running between answers and while this tab is in the background.</p>}
        {error && <p role="alert" className="error-message mb-5">{error}</p>}
        <button onClick={start} disabled={loading} className="primary-button w-full sm:w-auto">{loading ? 'Preparing your round…' : 'Start challenge'}<ArrowRight aria-hidden="true" className="w-5 h-5" />
        </button>
        <p className="text-sm text-text-secondary mt-4">Play as a guest. Progress saves on this browser. Available questions may limit round length.</p>
    </main>;
}
