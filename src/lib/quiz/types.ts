import type { CategoryId, Mode } from './config';
import type { QuizConfig } from './schema';
export interface QuizQuestion {
    id: string;
    category: CategoryId;
    prompt: string;
    subject: string;
    correctAnswer: string;
    options: string[];
    region: string;
    explanation: string;
    hint: string;
    image?: string;
    imageKind?: 'flag' | 'photo';
    countryCode?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
export interface QuizRound {
    questions: QuizQuestion[];
    config: QuizConfig;
    date?: string;
    available: number;
}
export interface Answer {
    question: QuizQuestion;
    selected: string | null;
    correct: boolean;
    hinted: boolean;
}
export interface RoundSummary {
    id: string;
    date: string;
    category: CategoryId;
    mode: Mode;
    correct: number;
    total: number;
    bestStreak: number;
    elapsed: number;
    dailyDate?: string;
}
