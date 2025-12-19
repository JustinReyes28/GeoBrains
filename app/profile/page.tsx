'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    Globe2,
    Trophy,
    Target,
    Zap,
    Crown,
    Medal,
    TrendingUp,
    Clock,
    ArrowLeft,
    Star,
    Award,
    Flag,
    MapPin,
    BarChart3,
    Milestone,
    Mountain,
    User,
    LogOut,
    LogIn,
    UserPlus
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '../../src/lib/utils';
import { getUserLeaderboardStats, type UserLeaderboardStats } from '../../src/lib/user-actions';

// Mock data for demonstration - will be replaced with API calls
const mockUser = {
    id: '1',
    name: 'Geography Master',
    email: 'master@geobrains.com',
    avatar: null,
    joinDate: 'December 2024',
    globalRank: 42,
    totalQuizzes: 156,
    accuracy: 87.5,
    bestCategory: 'Capitals',
    totalScore: 12450,
};

const mockLeaderboard = [
    { rank: 1, name: 'MapKing', score: 25800, avatar: null },
    { rank: 2, name: 'GeoWizard', score: 24200, avatar: null },
    { rank: 3, name: 'WorldExplorer', score: 22100, avatar: null },
    { rank: 4, name: 'AtlasAce', score: 19850, avatar: null },
    { rank: 5, name: 'CompassPro', score: 18600, avatar: null },
    { rank: 6, name: 'TerraNova', score: 17200, avatar: null },
    { rank: 7, name: 'GlobalGuru', score: 15900, avatar: null },
    { rank: 8, name: 'EarthChamp', score: 14500, avatar: null },
    { rank: 9, name: 'NationNinja', score: 13200, avatar: null },
    { rank: 10, name: 'BorderBoss', score: 12800, avatar: null },
];

const mockCategoryScores = [
    { id: 'capitals', name: 'Capitals', icon: Globe2, color: 'text-blue-400', score: 2450, accuracy: 92 },
    { id: 'flags', name: 'Flag ID', icon: Flag, color: 'text-red-400', score: 2100, accuracy: 85 },
    { id: 'locations', name: 'Map Pin', icon: MapPin, color: 'text-emerald-400', score: 1980, accuracy: 88 },
    { id: 'comparisons', name: 'Stats War', icon: BarChart3, color: 'text-amber-400', score: 1750, accuracy: 82 },
    { id: 'borders', name: 'Borders', icon: Milestone, color: 'text-purple-400', score: 2200, accuracy: 90 },
    { id: 'features', name: 'Landmarks', icon: Mountain, color: 'text-cyan-400', score: 1970, accuracy: 86 },
];

const mockRecentActivity = [
    { category: 'Capitals', score: 85, time: '2 hours ago', correct: 17, total: 20 },
    { category: 'Flags', score: 70, time: '5 hours ago', correct: 14, total: 20 },
    { category: 'Map Pin', score: 95, time: '1 day ago', correct: 19, total: 20 },
    { category: 'Borders', score: 80, time: '2 days ago', correct: 16, total: 20 },
];

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard'>(
        tabParam === 'leaderboard' ? 'leaderboard' : 'stats'
    );
    const [userStats, setUserStats] = useState<UserLeaderboardStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Update tab when URL changes
    useEffect(() => {
        setActiveTab(tabParam === 'leaderboard' ? 'leaderboard' : 'stats');
    }, [tabParam]);

    // Fetch user stats when authenticated
    useEffect(() => {
        async function fetchStats() {
            if (session?.user?.id) {
                setStatsLoading(true);
                try {
                    const stats = await getUserLeaderboardStats(session.user.id);
                    setUserStats(stats);
                } catch (error) {
                    console.error('Failed to fetch user stats:', error);
                }
                setStatsLoading(false);
            }
        }
        fetchStats();
    }, [session?.user?.id]);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand/30">
            {/* Header */}
            <nav className="fixed top-0 w-full z-[1000] glass-panel border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
                                <Globe2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gradient">GeoBrains</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm font-semibold">
                                        {statsLoading ? '...' : (userStats?.totalScore ?? 0).toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card hover:bg-white/10 transition-colors text-text-secondary hover:text-red-400"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium shadow-lg shadow-brand/20 hover:scale-105 transition-transform"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Profile Hero */}
                {/* Profile Hero - Only show when logged in */}
                {isAuthenticated ? (
                    <section className="mb-12">
                        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
                            {/* Background glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />

                            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand to-purple-500 flex items-center justify-center shadow-2xl shadow-brand/30">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                                        <Crown className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {userStats?.name ?? session?.user?.name ?? 'Geography Master'}
                                    </h1>
                                    <p className="text-text-secondary mb-4">
                                        {statsLoading ? 'Loading member info...' : `Member since ${userStats?.joinDate ?? mockUser.joinDate}`}
                                    </p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel">
                                            <Medal className="w-4 h-4 text-amber-400" />
                                            <span className="text-sm font-medium">
                                                Rank #{statsLoading ? '...' : (userStats?.rank ?? 0)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel">
                                            <Target className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium">
                                                {statsLoading ? '...' : (userStats?.accuracy ?? 0)}% Accuracy
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel">
                                            <Zap className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm font-medium">
                                                {statsLoading ? '...' : (userStats?.totalQuizzes ?? 0)} Quizzes
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Score Card */}
                                <div className="glass-panel rounded-2xl p-6 text-center min-w-[180px]">
                                    <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-gradient">
                                        {statsLoading ? '...' : (userStats?.totalScore ?? 0).toLocaleString()}
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1">Total Points</p>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    /* Guest Hero */
                    <section className="mb-12">
                        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden text-center">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 blur-3xl rounded-full" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                    Compete with <span className="text-gradient">Explorers Worldwide</span>
                                </h1>
                                <p className="text-text-secondary mb-8 text-lg">
                                    Join the GeoBrains community to track your progress, earn badges, and climb the global leaderboards.
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <Link
                                        href="/auth/register"
                                        className="px-8 py-3 rounded-xl bg-brand text-white font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-transform"
                                    >
                                        Create Account
                                    </Link>
                                    <Link
                                        href="/auth/login"
                                        className="px-8 py-3 rounded-xl glass-card font-semibold hover:bg-white/10 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('stats')}
                        className={cn(
                            "px-6 py-3 rounded-xl font-semibold transition-all",
                            activeTab === 'stats'
                                ? "bg-brand text-white shadow-lg shadow-brand/20"
                                : "glass-card text-text-secondary hover:text-text-primary"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            My Stats
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('leaderboard')}
                        className={cn(
                            "px-6 py-3 rounded-xl font-semibold transition-all",
                            activeTab === 'leaderboard'
                                ? "bg-brand text-white shadow-lg shadow-brand/20"
                                : "glass-card text-text-secondary hover:text-text-primary"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Leaderboard
                        </div>
                    </button>
                </div>

                {activeTab === 'stats' ? (
                    <>
                        {isAuthenticated ? (
                            <>
                                {/* Category Scores Grid */}
                                <section className="mb-12">
                                    <h2 className="text-2xl font-bold mb-6">Category Performance</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {mockCategoryScores.map((cat) => {
                                            const Icon = cat.icon;
                                            return (
                                                <div key={cat.id} className="glass-card rounded-2xl p-6 group">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className={cn("p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform", cat.color)}>
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xl font-bold">{cat.score.toLocaleString()}</div>
                                                            <div className="text-xs text-text-secondary">points</div>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-brand to-purple-500 rounded-full"
                                                                style={{ width: `${cat.accuracy}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-text-secondary">{cat.accuracy}%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Recent Activity */}
                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                                    <div className="glass-card rounded-2xl overflow-hidden">
                                        {mockRecentActivity.map((activity, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "flex items-center justify-between p-5",
                                                    index !== mockRecentActivity.length - 1 && "border-b border-white/5"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                        <Star className="w-5 h-5 text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{activity.category} Quiz</h4>
                                                        <p className="text-sm text-text-secondary">
                                                            {activity.correct}/{activity.total} correct
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-brand">{activity.score}%</div>
                                                    <div className="text-xs text-text-secondary flex items-center gap-1 justify-end">
                                                        <Clock className="w-3 h-3" />
                                                        {activity.time}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <section className="text-center py-16 px-4">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                        <BarChart3 className="w-8 h-8 text-text-secondary" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3">Track Your Stats</h2>
                                    <p className="text-text-secondary mb-8">
                                        Sign in to see your performance breakdown, quiz history, and accuracy stats across all categories to help you improve.
                                    </p>
                                    <Link
                                        href="/auth/login"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:scale-105 transition-transform"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Log In to View Stats
                                    </Link>
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    /* Leaderboard Tab */
                    <section>
                        <div className="glass-card rounded-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Global Rankings</h2>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <TrendingUp className="w-4 h-4" />
                                    Updated live
                                </div>
                            </div>

                            {/* Leaderboard List */}
                            <div>
                                {mockLeaderboard.map((player, index) => (
                                    <div
                                        key={player.rank}
                                        className={cn(
                                            "flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors",
                                            index !== mockLeaderboard.length - 1 && "border-b border-white/5",
                                            player.rank <= 3 && "bg-gradient-to-r from-amber-500/5 to-transparent"
                                        )}
                                    >
                                        {/* Rank */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                                            player.rank === 1 && "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg",
                                            player.rank === 2 && "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
                                            player.rank === 3 && "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
                                            player.rank > 3 && "bg-white/5 text-text-secondary"
                                        )}>
                                            {player.rank === 1 ? <Crown className="w-5 h-5" /> : player.rank}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand/50 to-purple-500/50 flex items-center justify-center">
                                            <User className="w-6 h-6 text-white/80" />
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{player.name}</h4>
                                            <p className="text-sm text-text-secondary">Top Player</p>
                                        </div>

                                        {/* Score */}
                                        <div className="text-right">
                                            <div className="text-lg font-bold">{player.score.toLocaleString()}</div>
                                            <div className="text-xs text-text-secondary">points</div>
                                        </div>

                                        {/* Medal for top 3 */}
                                        {player.rank <= 3 && (
                                            <Award className={cn(
                                                "w-6 h-6",
                                                player.rank === 1 && "text-amber-400",
                                                player.rank === 2 && "text-slate-400",
                                                player.rank === 3 && "text-amber-600"
                                            )} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Your Position - Only show when logged in */}
                            {isAuthenticated && (
                                <div className="p-6 border-t border-white/10 bg-brand/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center font-bold text-white">
                                            {statsLoading ? '...' : (userStats?.rank ?? mockUser.globalRank)}
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-purple-500 flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{userStats?.name ?? session?.user?.name ?? mockUser.name}</h4>
                                            <p className="text-sm text-brand">Your Position</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold">
                                                {statsLoading ? '...' : (userStats?.totalScore ?? mockUser.totalScore).toLocaleString()}
                                            </div>
                                            <div className="text-xs text-text-secondary">points</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-white/5 py-8 text-center text-sm text-text-secondary">
                <p>© 2025 GeoBrains • Built for Explorers</p>
            </footer>
        </div>
    );
}
