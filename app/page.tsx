'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Globe2,
    Flag,
    MapPin,
    BarChart3,
    Milestone,
    Mountain,
    Trophy,
    History,
    TrendingUp,
    User
} from 'lucide-react';
import { cn } from '../src/lib/utils';

// Dynamically import GeoMap to avoid SSR issues with Leaflet
const GeoMap = dynamic(() => import('../src/components/Map/GeoMap').then(mod => mod.GeoMap), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-white/5 animate-pulse rounded-xl border border-white/10 flex items-center justify-center">
            <Globe2 className="w-8 h-8 text-white/20 animate-spin" />
        </div>
    )
});

const categories = [
    { id: 'capitals', name: 'Capitals', icon: Globe2, color: 'text-blue-400', desc: 'Identify world capitals' },
    { id: 'flags', name: 'Flag ID', icon: Flag, color: 'text-red-400', desc: 'Name countries by their flags' },
    { id: 'locations', name: 'Map Pin', icon: MapPin, color: 'text-emerald-400', desc: 'Find countries on the map' },
    { id: 'comparisons', name: 'Stats War', icon: BarChart3, color: 'text-amber-400', desc: 'Compare population & area' },
    { id: 'borders', name: 'Borders', icon: Milestone, color: 'text-purple-400', desc: 'Neighboring countries' },
    { id: 'features', name: 'Landmarks', icon: Mountain, color: 'text-cyan-400', desc: 'Geographic wonders' },
];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand/30">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
                            <Globe2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gradient">GeoBrains</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                            <Trophy className="w-4 h-4" /> Leaderboard
                        </button>
                        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-105">
                            <User className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="mb-16">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-brand/20 text-xs font-semibold text-brand tracking-wide uppercase">
                                <TrendingUp className="w-3 h-3" /> New Daily Challenges Added
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                                Master the <br />
                                <span className="text-gradient">World Map.</span>
                            </h1>
                            <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
                                Test your knowledge with ultra-accurate geographic data, interactive maps,
                                and global competition. Choose a category to begin your journey.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="px-8 py-4 rounded-xl bg-brand text-white font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] transition-transform active:scale-95">
                                    Quick Play
                                </button>
                                <button className="px-8 py-4 rounded-xl glass-card font-bold hover:scale-[1.02] transition-transform active:scale-95">
                                    Browse Quizzes
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-[500px] aspect-square relative">
                            <div className="absolute -inset-4 bg-brand/10 blur-3xl rounded-full" />
                            <div className="h-[500px]">
                                <GeoMap zoom={2} center={[20, 0]} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section>
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Quiz Categories</h2>
                            <p className="text-text-secondary">Select a mode to earn your rank</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg glass-card text-text-secondary hover:text-text-primary">
                                <History className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "glass-card p-8 rounded-2xl flex flex-col items-start text-left group",
                                        selectedCategory === cat.id && "border-brand/40 bg-brand/5"
                                    )}
                                >
                                    <div className={cn("p-4 rounded-xl mb-6 bg-white/5 group-hover:scale-110 transition-transform", cat.color)}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {cat.desc}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-white/5 py-8 text-center text-sm text-text-secondary">
                <p>© 2025 GeoBrains • Built for Explorers</p>
            </footer>
        </div>
    );
}
