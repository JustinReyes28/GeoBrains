'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Home, MapPin, Trophy } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { calculateDistance, calculatePoints } from '@/src/lib/distance';
import { recordQuizScore } from '@/src/lib/user-actions';

// Dynamic import for Map to avoid SSR
const GeoMap = dynamic(() => import('../../src/components/Map/GeoMap').then(mod => mod.GeoMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-xl" />
});

interface CountryQuestion {
    name: string;
    code: string;
    region: string;
    centerLat: number;
    centerLng: number;
}

export default function MapPinQuizPage() {
    const [questions, setQuestions] = useState<CountryQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Quiz state
    const [userGuess, setUserGuess] = useState<{ lat: number; lng: number } | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [resultData, setResultData] = useState<{
        distance: number;
        points: number;
        feedback: string;
        color: string;
    } | null>(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/map-pin/random?count=10');
            if (!res.ok) throw new Error('Failed to fetch questions');
            const data = await res.json();
            setQuestions(data);
            setCurrentIndex(0);
            setScore(0);
            setShowResult(false);
            setUserGuess(null);
            setIsAnswered(false);
            setResultData(null);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        if (isAnswered) return;

        const currentQ = questions[currentIndex];
        setUserGuess({ lat, lng });

        const distance = calculateDistance(lat, lng, currentQ.centerLat, currentQ.centerLng);
        const { points, feedback, color } = calculatePoints(distance);

        setResultData({ distance, points, feedback, color });
        setScore(prev => prev + points);
        setIsAnswered(true);
    };

    const handleNext = async () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserGuess(null);
            setIsAnswered(false);
            setResultData(null);
        } else {
            setShowResult(true);
            try {
                await recordQuizScore(score, questions.length * 1000, 'map-locations');
            } catch (error) {
                console.error("Failed to record quiz score:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
                <div className="text-center">
                    <MapPin className="w-12 h-12 text-brand animate-bounce mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Loading Map Data...</h2>
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
                    <p className="text-text-secondary mb-8">You found {questions.length} countries on the map.</p>

                    <div className="text-5xl font-black text-brand mb-2">{score.toLocaleString()}</div>
                    <p className="text-sm text-text-secondary mb-8">Total Score</p>

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

    // Determine markers to show
    const markers = [];
    if (userGuess) {
        markers.push({
            position: [userGuess.lat, userGuess.lng] as [number, number],
            popup: "Your Guess",
            color: "#ef4444" // red-500
        });
    }
    if (isAnswered) {
        markers.push({
            position: [currentQ.centerLat, currentQ.centerLng] as [number, number],
            popup: currentQ.name,
            color: "#10b981" // emerald-500
        });
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col h-screen">
            {/* Header / Stats Bar */}
            <header className="px-6 py-4 glass-panel border-b border-white/5 shrink-0 z-20 relative">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary">
                            <Home className="w-5 h-5" />
                        </Link>
                        <span className="font-bold text-lg hidden md:inline">Map Pin Challenge</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-white/5 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                            Question {currentIndex + 1} / {questions.length}
                        </div>
                        <div className="bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-brand/20 min-w-[120px] text-center">
                            Score: {score}
                        </div>
                    </div>
                </div>
            </header>

            {/* Interaction Area */}
            <div className="flex-1 relative">
                {/* Result Overlay Card - Appears on answering */}
                {isAnswered && resultData && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-4 duration-300 w-[90%] max-w-md">
                        <div className="glass-card p-6 rounded-2xl border-brand/20 shadow-2xl bg-black/80 backdrop-blur-xl">
                            <div className="text-center mb-4">
                                <h2 className={cn("text-3xl font-black mb-1", resultData.color)}>{resultData.feedback}</h2>
                                <p className="text-text-secondary text-lg">
                                    <span className="text-white font-bold">{resultData.distance.toLocaleString()} km</span> from target
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className={cn("text-xl font-bold px-3 py-1 rounded-full bg-white/10", resultData.color)}>
                                    +{resultData.points} pts
                                </span>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full py-3 rounded-xl bg-brand text-white font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Question Prompt Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl pointer-events-none">
                    <div className="glass-card p-4 md:p-6 rounded-2xl border-white/10 shadow-2xl bg-black/60 backdrop-blur-md text-center pointer-events-auto">
                        <p className="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-1">Find this country</p>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                            {currentQ.name}
                        </h1>
                        {!isAnswered && (
                            <p className="text-brand/80 text-sm mt-3 animate-pulse">
                                Click on the map to place your pin
                            </p>
                        )}
                    </div>
                </div>

                {/* Map Container - Full Screen */}
                <div className="w-full h-full bg-bg-secondary">
                    <GeoMap
                        zoom={2}
                        center={[20, 0]}
                        markers={markers}
                        onMapClick={handleMapClick}
                        className="rounded-none border-none"
                    />
                </div>
            </div>
        </div>
    );
}
