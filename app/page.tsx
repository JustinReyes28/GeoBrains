import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, CalendarDays, Coins, Flag, Globe2, Heart, Languages, MapPin, Milestone, Mountain, Timer, Trophy, User, Compass } from 'lucide-react';
import { contentCounts } from '@/src/lib/quiz/questions';
import { worldCountries } from '@/src/lib/data/world';
import { statsData } from '@/src/lib/data/stats';
import { ProgressSummary } from '@/components/quiz/ProgressSummary';
const categories = [
    { id: 'capitals', name: 'Capitals', icon: Globe2, desc: 'From Paris to Ngerulmud. Find the capital.', href: '/guess-the-capital' },
    { id: 'flags', name: 'Flags', icon: Flag, desc: 'A whole country in a few colors and shapes.', href: '/flag-quiz' },
    { id: 'borders', name: 'Borders', icon: Milestone, desc: 'Discover who lives next door.', href: '/borders-quiz' },
    { id: 'landmarks', name: 'Landmarks', icon: Mountain, desc: 'Recognize the places that stay with us.', href: '/landmarks-quiz' },
    { id: 'languages', name: 'Languages', icon: Languages, desc: 'Connect countries with their languages.', href: '/languages-quiz' },
    { id: 'currencies', name: 'Currencies', icon: Coins, desc: 'Follow the money around the globe.', href: '/currencies-quiz' },
    { id: 'people', name: 'Famous people', icon: User, desc: 'Meet the people behind the places.', href: '/famous-people-quiz' },
    { id: 'regions', name: 'World regions', icon: Compass, desc: 'Place every country in the bigger picture.', href: '/regions-quiz' },
] as const;
const challenges = [
    { mode: 'practice', name: 'Practice', icon: BookOpen, desc: 'Take your time. Use hints. Build your knowledge.' },
    { mode: 'sprint', name: '60-second sprint', icon: Timer, desc: 'A race around the world against the clock.' },
    { mode: 'survival', name: 'Survival', icon: Heart, desc: 'Three lives. How far will your knowledge take you?' },
    { mode: 'daily', name: 'Daily challenge', icon: CalendarDays, desc: 'One shared world tour, new every day at 00:00 UTC.' },
];
export default function Home() {
    return <div className="min-h-screen text-text-primary">
        <a href="#main" className="skip-link">Skip to challenges</a>
        <header className="border-b border-white/10 glass-panel">
            <nav aria-label="Main navigation" className="max-w-6xl mx-auto px-4 sm:px-6 min-h-18 py-4 flex items-center justify-between gap-3">
                <Link prefetch={false} href="/" className="flex gap-2 items-center font-black text-xl">
                    <Globe2 aria-hidden="true" className="text-brand w-7 h-7" />GeoBrains</Link>
                <div className="flex gap-2 sm:gap-5">
                    <Link prefetch={false} className="nav-link" href="/profile?tab=leaderboard">
                        <Trophy aria-hidden="true" className="w-4 h-4" />
                        <span>Leaderboard</span>
                    </Link>
                    <Link prefetch={false} className="nav-link" href="/profile">
                        <User aria-hidden="true" className="w-4 h-4" />
                        <span>Profile</span>
                    </Link>
                </div>
            </nav>
        </header>
        <main id="main" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <section className="home-hero grid lg:grid-cols-[1.2fr_1fr] items-center gap-10 py-14 sm:py-20">
                <div>
                    <p className="text-brand font-bold text-sm tracking-widest uppercase mb-5">Curiosity has no borders</p>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">A little more<br />of the world.<br />
                        <span className="text-brand">Every day.</span>
                    </h1>
                    <p className="text-lg text-text-secondary leading-relaxed max-w-lg mb-8">Explore {worldCountries.length} countries through flags, capitals, neighbors, and more. Make a world tour your own, or take on today’s shared challenge.</p>
                    <div className="flex flex-wrap gap-3">
                        <Link prefetch={false} href="/play" className="primary-button">Start a world tour<ArrowRight aria-hidden="true" className="w-5 h-5" />
                        </Link>
                        <Link prefetch={false} href="/play?mode=daily" className="secondary-button">
                            <CalendarDays aria-hidden="true" className="w-5 h-5" />Today’s challenge</Link>
                    </div>
                    <p className="text-sm text-text-secondary mt-5">No account needed · Five ways to play · Learn from every answer</p>
                </div>
                <div className="atlas-illustration" aria-hidden="true">
                    <div className="atlas-grid" />
                    <Globe2 className="atlas-globe" strokeWidth={0.7} />
                    <span className="atlas-label atlas-north">Europe</span>
                    <span className="atlas-label atlas-east">Asia</span>
                    <span className="atlas-label atlas-west">Americas</span>
                    <span className="atlas-label atlas-south">Oceania</span>
                    <span className="atlas-label atlas-center">Africa</span>
                    <p className="atlas-caption">{worldCountries.length} countries. One shared world.</p>
                </div>
            </section>
            <section aria-labelledby="modes-title">
                <div className="flex items-end justify-between gap-4 mb-5">
                    <div>
                        <h2 id="modes-title" className="text-2xl sm:text-3xl font-bold mb-2">Find your way to play</h2>
                        <p className="text-text-secondary">Mix categories, pick a region, and choose your pace.</p>
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{challenges.map(c => {
                    const Icon = c.icon;
                    return <Link prefetch={false} key={c.mode} href={'/play?mode=' + c.mode} className="challenge-card">
                        <Icon aria-hidden="true" className="text-brand w-6 h-6 mb-4" />
                        <h3 className="font-bold mb-2">{c.name}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{c.desc}</p>
                    </Link>;
                })}</div>
            </section>
            <ProgressSummary />
            <section aria-labelledby="categories-title" className="mt-14">
                <h2 id="categories-title" className="text-2xl sm:text-3xl font-bold mb-2">Follow your curiosity</h2>
                <p className="text-text-secondary mb-6">Stay with a favorite subject. Every category supports the new game modes.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{categories.map(c => {
                    const Icon = c.icon;
                    return <Link prefetch={false} key={c.id} href={c.href} className="challenge-card">
                        <div className="flex justify-between items-center mb-5">
                            <Icon aria-hidden="true" className="text-brand w-7 h-7" />
                            <span className="text-xs text-text-secondary">{contentCounts[c.id]} questions</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{c.name}</h3>
                        <p className="text-sm text-text-secondary">{c.desc}</p>
                    </Link>;
                })}
                    <Link prefetch={false} href="/map-pin-quiz" className="challenge-card">
                        <div className="flex justify-between items-center mb-5">
                            <MapPin aria-hidden="true" className="text-emerald-300 w-7 h-7" />
                            <span className="text-xs text-text-secondary">{worldCountries.length} targets · interactive map</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Map pin</h3>
                        <p className="text-sm text-text-secondary">Place your guess. See how close you came.</p>
                    </Link>
                    <Link prefetch={false} href="/stats-war" className="challenge-card">
                        <div className="flex justify-between items-center mb-5">
                            <BarChart3 aria-hidden="true" className="text-amber-300 w-7 h-7" />
                            <span className="text-xs text-text-secondary">{statsData.length} countries · comparison game</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Stats war</h3>
                        <p className="text-sm text-text-secondary">Higher or lower? Compare area and population.</p>
                    </Link>
                </div>
            </section>
        </main>
        <footer className="border-t border-white/10 py-7 px-4 text-sm text-text-secondary">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-3">
                <p>GeoBrains · Keep exploring.</p>
                <div className="flex gap-5">
                    <Link prefetch={false} href="/content-sources" className="hover:text-white">Content & sources</Link>
                    <a href="https://github.com/JustinReyes28/GeoBrains" target="_blank" rel="noopener noreferrer" className="hover:text-white">View on GitHub</a>
                </div>
            </div>
        </footer>
    </div>;
}
