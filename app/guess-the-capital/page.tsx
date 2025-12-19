'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw, Home, Globe2, MapPin } from 'lucide-react';
import { cn } from '../../src/lib/utils'; // Adjust path if needed

// Dynamic import for Map to avoid SSR
const GeoMap = dynamic(() => import('../../src/components/Map/GeoMap').then(mod => mod.GeoMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
});

interface Question {
    id: string;
    country: string;
    correctAnswer: string;
    options: string[];
    region: string;
    coordinates?: { lat: number; lng: number };
}

export default function GuessTheCapitalPage() {
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
            const res = await fetch('/api/capitals/random?count=10');
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

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <Globe2 className="w-12 h-12 text-brand animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Loading Capital Data...</h2>
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
                    <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-brand" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                    <p className="text-text-secondary mb-8">You identified world capitals.</p>

                    <div className="text-5xl font-black text-brand mb-2">{score} / {questions.length}</div>
                    <p className="text-sm text-text-secondary mb-8">Final Score</p>

                    <div className="space-y-3">
                        <button
                            onClick={fetchQuestions}
                            className="w-full py-4 rounded-xl bg-brand text-white font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
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
            {/* Header / Progress */}
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <Link href="/" className="p-2 rounded-lg glass-card text-text-secondary hover:text-text-primary transition-colors">
                    <Home className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                        Question {currentIndex + 1} / {questions.length}
                    </div>
                    <div className="bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-brand/20">
                        Score: {score}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Question Section */}
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-2xl border-brand/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Globe2 className="w-32 h-32" />
                        </div>
                        <h2 className="text-sm uppercase tracking-wider text-text-secondary mb-2 font-semibold">Identify the Capital</h2>
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
                                        The capital of {currentQ.country} is <span className="font-bold text-white">{currentQ.correctAnswer}</span>.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full py-4 rounded-xl bg-brand text-white font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                {currentIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Map Section - Only shows on feedback or if user wants to peek (maybe lock it?) */}
                {/* User request: "Optional: Leaflet map showing the country location on correct/incorrect answer" */}

                <div className="hidden lg:block h-[600px] sticky top-8">
                    <div className="w-full h-full rounded-2xl overflow-hidden glass-card border-brand/20 relative">
                        {isAnswered && currentQ.coordinates ? (
                            <GeoMap
                                zoom={5}
                                center={[currentQ.coordinates.lat, currentQ.coordinates.lng]}
                                markers={[{
                                    position: [currentQ.coordinates.lat, currentQ.coordinates.lng],
                                    popup: currentQ.correctAnswer
                                }]}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5 relative">
                                <MapPin className="w-16 h-16 text-white/10" />
                                <p className="absolute bottom-8 text-center text-white/20 text-sm font-medium">Map reveals after answer</p>
                                <div className="absolute inset-0 bg-brand/5" />
                            </div>
                        )}
                        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                    </div>
                </div>
            </main>
        </div>
    );
}
