'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw, Home, Mountain, Check, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { recordQuizScore } from '@/src/lib/user-actions';

interface LandmarkQuestion {
    id: string;
    landmarkName: string;
    imagePath: string;
    correctAnswer: string;
    options: string[];
    country: string;
    coordinates: { lat: number; lng: number };
}

export default function LandmarksQuizPage() {
    const [questions, setQuestions] = useState<LandmarkQuestion[]>([]);
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
            const res = await fetch('/api/landmarks/random?count=10');
            if (!res.ok) throw new Error('Failed to fetch questions');
            const data = await res.json();
            setQuestions(data);
            setCurrentIndex(0);
            setScore(0);
            setShowResult(false);
            setLoading(false);
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
                // Using 'landmark-quiz' ID for tracking
                await recordQuizScore(score, questions.length, 'landmark-quiz');
            } catch (error) {
                console.error("Failed to record quiz score:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <Mountain className="w-12 h-12 text-cyan-400 animate-bounce mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Loading Landmarks...</h2>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">No questions available. Please try again later.</p>
                    <button onClick={fetchQuestions} className="text-brand underline hover:text-brand-light">Retry</button>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
                <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                    <p className="text-text-secondary mb-8">You know your world wonders.</p>

                    <div className="text-5xl font-black text-cyan-400 mb-2">{score} / {questions.length}</div>
                    <p className="text-sm text-text-secondary mb-8">Final Score</p>

                    <div className="space-y-3">
                        <button
                            onClick={fetchQuestions}
                            className="w-full py-4 rounded-xl bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
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
                    <div className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm font-bold border border-cyan-500/20">
                        Score: {score}
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto space-y-8">
                <div className="glass-card p-8 rounded-3xl border-cyan-500/20 relative overflow-hidden bg-gradient-to-br from-black/80 to-cyan-900/10 flex flex-col items-center text-center">

                    <h2 className="text-sm uppercase tracking-wider text-cyan-300 mb-6 font-semibold">What is this famous landmark?</h2>

                    <div className="mb-10 relative w-full aspect-video max-h-[300px] rounded-xl overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={currentQ.imagePath}
                            alt="Landmark to guess"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                                        "relative p-4 rounded-xl text-left border transition-all duration-200 group flex items-center justify-between",
                                        !isAnswered && "glass-card hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
                                        showCorrect && "bg-emerald-500/20 border-emerald-500/50 text-emerald-100",
                                        showWrong && "bg-red-500/20 border-red-500/50 text-red-100",
                                        isAnswered && !showCorrect && !showWrong && "bg-white/5 border-transparent opacity-50"
                                    )}
                                >
                                    <span className="font-semibold text-lg truncate pr-2">{option}</span>
                                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                                    {showWrong && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
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
                                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className={cn("font-bold text-lg", isCorrect ? "text-emerald-400" : "text-red-400")}>
                                    {isCorrect ? "Correct!" : "Incorrect"}
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    It's the <span className="font-bold text-white">{currentQ.correctAnswer}</span> in <span className="text-cyan-300">{currentQ.country}</span>.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 rounded-xl bg-cyan-600 text-white font-bold shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
