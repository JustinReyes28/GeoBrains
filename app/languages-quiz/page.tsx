'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw, Home, Languages, Globe2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { recordQuizScore } from '@/src/lib/user-actions';

interface Question {
    id: string;
    country: string;
    correctAnswer: string;
    options: string[];
    region: string;
}

export default function LanguagesQuizPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/languages/random?count=10');
            if (!res.ok) throw new Error('Failed to fetch questions');
            const data = await res.json();
            setQuestions(data);
            setCurrentIndex(0);
            setScore(0);
            setShowResult(false);
            setLoading(false);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === questions[currentIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            try {
                await recordQuizScore(score, questions.length, 'languages-quiz');
            } catch (error) {
                console.error("Failed to record quiz score:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <Languages className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Loading Language Data...</h2>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <p>No questions available. Please try again later.</p>
                <button onClick={fetchQuestions} className="ml-4 text-brand underline">Retry</button>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
                <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center border-brand/20 shadow-2xl shadow-brand/10">
                    <div className="w-20 h-20 bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                    <p className="text-text-secondary mb-8">You mastered the world's languages.</p>

                    <div className="text-5xl font-black text-blue-400 mb-2">{score} / {questions.length}</div>
                    <p className="text-sm text-text-secondary mb-8">Final Score</p>

                    <div className="space-y-3">
                        <button
                            onClick={fetchQuestions}
                            className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Play Again
                        </button>
                        <Link href="/" className="w-full py-4 rounded-xl glass-card text-text-secondary hover:text-text-primary font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            <Home className="w-5 h-5" /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary p-4 md:p-8">
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <Link href="/" className="p-2 rounded-lg glass-card text-text-secondary hover:text-text-primary transition-colors">
                    <Home className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                        Question {currentIndex + 1} / {questions.length}
                    </div>
                    <div className="bg-blue-400/10 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-400/20">
                        Score: {score}
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-2xl border-blue-400/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Languages className="w-32 h-32" />
                        </div>
                        <h2 className="text-sm uppercase tracking-wider text-text-secondary mb-2 font-semibold">What is the official language of?</h2>
                        <h1 className="text-4xl font-black text-white mb-6 leading-tight">
                            {currentQ.country}
                        </h1>

                        <div className="grid grid-cols-1 gap-3">
                            {currentQ.options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                const isThisCorrect = option === currentQ.correctAnswer;
                                const showCorrect = isAnswered && isThisCorrect;
                                const showWrong = isAnswered && isSelected && !isThisCorrect;

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        disabled={isAnswered}
                                        className={cn(
                                            "relative p-4 rounded-xl text-left border transition-all duration-200 group",
                                            !isAnswered && "glass-card hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
                                            showCorrect && "bg-emerald-500/20 border-emerald-500/50 text-emerald-100",
                                            showWrong && "bg-red-500/20 border-red-500/50 text-red-100",
                                            isAnswered && !showCorrect && !showWrong && "bg-white/5 border-transparent opacity-50"
                                        )}
                                    >
                                        <span className="font-semibold text-lg">{option}</span>
                                        {showCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400" />}
                                        {showWrong && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {isAnswered && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className={cn(
                                "p-6 rounded-2xl mb-4 flex items-center gap-4",
                                isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                    isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                )}>
                                    {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={cn("font-bold text-lg", isCorrect ? "text-emerald-400" : "text-red-400")}>
                                        {isCorrect ? "Correct!" : "Incorrect"}
                                    </h3>
                                    <p className="text-text-secondary text-sm">
                                        The official language of {currentQ.country} is <span className="font-bold text-white">{currentQ.correctAnswer}</span>.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                {currentIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
