import type { QuizRound, QuizQuestion, Answer } from './types';
export interface GameState {
    phase: 'setup' | 'playing' | 'results';
    round: QuizRound | null;
    index: number;
    answers: Answer[];
    selected: string | null;
    answered: boolean;
    hinted: boolean;
    hidden: string[];
    lives: number;
    streak: number;
    bestStreak: number;
    startedAt: number;
    elapsed: number;
    remaining: number;
}
export const initialGame: GameState = { phase: 'setup', round: null, index: 0, answers: [], selected: null, answered: false, hinted: false, hidden: [], lives: 3, streak: 0, bestStreak: 0, startedAt: 0, elapsed: 0, remaining: 60 };
export type GameAction = {
    type: 'start';
    round: QuizRound;
    now: number;
} | {
    type: 'answer';
    answer: string | null;
    now: number;
} | {
    type: 'next';
    now: number;
} | {
    type: 'tick';
    now: number;
} | {
    type: 'hint';
} | {
    type: 'setup';
};
export function gameReducer(state: GameState, action: GameAction): GameState {
    if (action.type === 'setup')
        return { ...initialGame };
    if (action.type === 'start')
        return { ...initialGame, phase: 'playing', round: action.round, startedAt: action.now };
    if (state.phase !== 'playing' || !state.round)
        return state;
    const { round } = state;
    const elapsedAt = (now: number) => Math.max(0, Math.floor((now - state.startedAt) / 1000));
    if (action.type === 'tick') {
        const elapsed = elapsedAt(action.now);
        const remaining = Math.max(0, 60 - elapsed);
        return { ...state, elapsed, remaining, phase: round.config.mode === 'sprint' && remaining === 0 ? 'results' : state.phase };
    }
    if (action.type === 'hint') {
        if (state.answered || state.hinted || round.config.mode !== 'practice')
            return state;
        const q = round.questions[state.index];
        return { ...state, hinted: true, hidden: q.options.filter(o => o !== q.correctAnswer).slice(0, Math.max(1, q.options.length - 2)) };
    }
    if (action.type === 'answer') {
        if (state.answered)
            return state;
        if (round.config.mode === 'sprint' && elapsedAt(action.now) >= 60)
            return { ...state, phase: 'results', remaining: 0, elapsed: elapsedAt(action.now) };
        const question: QuizQuestion = round.questions[state.index];
        if (action.answer !== null && (!question.options.includes(action.answer) || state.hidden.includes(action.answer)))
            return state;
        const correct = action.answer === question.correctAnswer;
        const streak = correct ? state.streak + 1 : 0;
        return { ...state, selected: action.answer, answered: true, streak, bestStreak: Math.max(state.bestStreak, streak), lives: state.lives - (correct ? 0 : 1), answers: [...state.answers, { question, selected: action.answer, correct, hinted: state.hinted }], elapsed: elapsedAt(action.now) };
    }
    if (action.type === 'next') {
        if (!state.answered)
            return state;
        const finished = state.index + 1 >= round.questions.length || (round.config.mode === 'survival' && state.lives <= 0) || (round.config.mode === 'sprint' && elapsedAt(action.now) >= 60);
        return { ...state, phase: finished ? 'results' : 'playing', index: finished ? state.index : state.index + 1, selected: null, answered: false, hinted: false, hidden: [], elapsed: elapsedAt(action.now) };
    }
    return state;
}
