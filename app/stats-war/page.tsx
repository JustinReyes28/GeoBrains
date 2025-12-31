'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Trophy,
    RotateCcw,
    Home,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Maximize2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { recordQuizScore, getCategoryHighScore } from '@/src/lib/user-actions';

interface StatQuestion {
    id: string;
    countryA: {
        code: string;
        name: string;
        value: number;
    };
    countryB: {
        code: string;
        name: string;
        value: number;
    };
    statType: 'population' | 'area';
    label: string;
}

export default function StatsWarPage() {
    const [questions, setQuestions] = useState<StatQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        fetchQuestions();
        loadHighScore();
    }, []);

    const loadHighScore = async () => {
        const hScore = await getCategoryHighScore('stats-war');
        setHighScore(hScore);
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/stats-war/random?count=15');
            if (!res.ok) throw new Error('Failed to fetch questions');
            const data = await res.json();
            setQuestions(data);
            setCurrentIndex(0);
            setScore(0);
            setStreak(0);
            setShowResult(false);
            setIsAnswered(false);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleGuess = (guess: 'higher' | 'lower') => {
        if (isAnswered) return;

        const currentQ = questions[currentIndex];
        const correct = guess === 'higher'
            ? currentQ.countryB.value >= currentQ.countryA.value
            : currentQ.countryB.value <= currentQ.countryA.value;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setScore(prev => prev + 1);
            setStreak(prev => prev + 1);
            if (streak + 1 > highScore) setHighScore(streak + 1);
        } else {
            // Game over after a short delay to see the result
            setTimeout(() => {
                setShowResult(true);
                recordScore();
            }, 1500);
        }
    };

    const recordScore = async () => {
        try {
            await recordQuizScore(score, questions.length, 'stats-war', 0, true);
            // Refresh high score display
            if (score > highScore) {
                setHighScore(score);
            }
        } catch (error) {
            console.error("Failed to record score:", error);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnswered(false);
            setIsCorrect(null);
        } else {
            setShowResult(true);
            recordScore();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-amber-400 animate-pulse mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Preparing Challenges...</h2>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
                <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center border-amber-500/20 shadow-2xl shadow-amber-500/10">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Game Over!</h1>
                    <p className="text-text-secondary mb-8">Your comparison skills are sharp.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-3xl font-black text-amber-400">{score}</div>
                            <div className="text-xs uppercase tracking-wider text-text-secondary">Total Score</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-3xl font-black text-brand">{highScore}</div>
                            <div className="text-xs uppercase tracking-wider text-text-secondary">Best Streak</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={fetchQuestions}
                            className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Try Again
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
    const statIcon = currentQ.statType === 'population' ? <Users className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />;
    const statSuffix = currentQ.statType === 'population' ? 'million people' : 'thousand km²';

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/10 blur-[120px] rounded-full -z-10" />

            <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
                <Link href="/" className="p-2 rounded-lg glass-card text-text-secondary hover:text-text-primary transition-colors">
                    <Home className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-3">
                    <div className="glass-card px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border-amber-500/20">
                        <span className="text-amber-400 uppercase tracking-tighter">Streak</span>
                        <span className="bg-amber-400 text-black px-2 rounded-md">{streak}</span>
                    </div>
                    <div className="glass-card px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="text-text-secondary uppercase tracking-tighter">Best</span>
                        <span>{highScore}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-4 pb-12 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
                        {statIcon} {currentQ.label} comparison
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Stats <span className="text-gradient">War</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[500px]">
                    {/* Country A - Revealed */}
                    <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                        <div className="relative z-10 space-y-6">
                            <img
                                src={`https://flagsapi.com/${currentQ.countryA.code}/shiny/64.png`}
                                alt={currentQ.countryA.name}
                                className="w-24 h-24 mx-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                            />
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{currentQ.countryA.name}</h2>
                                <p className="text-text-secondary text-sm uppercase tracking-widest font-semibold">{currentQ.label}</p>
                            </div>
                            <div className="text-5xl font-black text-white decoration-amber-400 underline underline-offset-8">
                                {currentQ.countryA.value}
                                <span className="text-lg font-medium ml-2 text-text-secondary">{statSuffix}</span>
                            </div>
                        </div>
                    </div>

                    {/* VS Divider */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white text-black font-black flex items-center justify-center text-xl shadow-2xl z-20 border-4 border-bg-primary hidden lg:flex">
                        VS
                    </div>

                    {/* Country B - Hidden/Guessing */}
                    <div className={cn(
                        "glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500",
                        isAnswered ? (isCorrect ? "border-emerald-500/50 bg-emerald-500/5" : "border-red-500/50 bg-red-500/5") : "border-white/10"
                    )}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                        <div className="relative z-10 space-y-6 w-full">
                            <img
                                src={`https://flagsapi.com/${currentQ.countryB.code}/shiny/64.png`}
                                alt={currentQ.countryB.name}
                                className="w-24 h-24 mx-auto drop-shadow-2xl transition-transform duration-500"
                            />
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{currentQ.countryB.name}</h2>
                                <p className="text-text-secondary text-sm uppercase tracking-widest font-semibold">{currentQ.label}</p>
                            </div>

                            {!isAnswered ? (
                                <div className="space-y-4 pt-4">
                                    <button
                                        onClick={() => handleGuess('higher')}
                                        className="w-full py-4 rounded-2xl bg-white text-black font-black hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3 group px-8"
                                    >
                                        <TrendingUp className="w-6 h-6 text-emerald-600 group-hover:translate-y--1 transition-transform" />
                                        HIGHER
                                    </button>
                                    <button
                                        onClick={() => handleGuess('lower')}
                                        className="w-full py-4 rounded-2xl glass-card border-white/20 text-white font-black hover:bg-white/5 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-3 px-8"
                                    >
                                        <TrendingDown className="w-6 h-6 text-red-400" />
                                        LOWER
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in zoom-in-95 duration-500 pt-4">
                                    <div className={cn(
                                        "text-5xl font-black mb-4",
                                        isCorrect ? "text-emerald-400" : "text-red-400"
                                    )}>
                                        {currentQ.countryB.value}
                                        <span className="text-lg font-medium ml-2 opacity-70">{statSuffix}</span>
                                    </div>

                                    {isCorrect && (
                                        <button
                                            onClick={nextQuestion}
                                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 text-black font-bold hover:scale-105 transition-transform"
                                        >
                                            Next Round <ArrowRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
