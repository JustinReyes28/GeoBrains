"use server";

import { prisma } from "./prisma";
import { auth } from "../auth";
import { Prisma } from "@prisma/client";

/**
 * Masks a user ID for logging purposes to avoid exposing PII
 * @param userId The user ID to mask
 * @returns A masked version of the user ID (first 4 chars + ... + last 4 chars)
 */
function maskUserId(userId: string | undefined): string {
    if (!userId || userId.length <= 8) {
        return "[redacted]";
    }
    return `${userId.substring(0, 4)}...${userId.substring(userId.length - 4)}`;
}

export interface UserLeaderboardStats {
    id: string;
    name: string | null;
    totalScore: number;
    rank: number;
    totalQuizzes: number;
    accuracy: number;
    joinDate: string;
}

export interface LeaderboardPlayer {
    id: string;
    rank: number;
    name: string;
    score: number;
    avatar: string | null;
}

/**
 * Fetches leaderboard stats for a specific user.
 * Calculates total score from all Score records and determines global rank.
 */
export async function getUserLeaderboardStats(userId: string): Promise<UserLeaderboardStats | null> {
    try {
        // Get the current session to verify authorization
        const session = await auth();

        // Verify that the requested userId matches the authenticated user's ID
        if (!session?.user?.id || session.user.id !== userId) {
            console.warn(`Unauthorized access attempt: session user ${maskUserId(session?.user?.id)} tried to access data for user ${maskUserId(userId)}`);
            return null;
        }

        // Get the user's basic info including createdAt for join date
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, createdAt: true },
        });

        if (!user) {
            return null;
        }

        // Calculate the user's total score and quiz count
        const userScoreAggregate = await prisma.score.aggregate({
            where: { userId },
            _sum: { value: true },
            _count: { id: true },
            _avg: { value: true },
        });

        const userTotalScore = userScoreAggregate._sum.value ?? 0;
        const totalQuizzes = userScoreAggregate._count.id ?? 0;
        const accuracy = Math.round(userScoreAggregate._avg.value ?? 0);

        // Calculate rank using database-side window function for efficiency
        interface RankResult {
            rank: bigint;
        }

        const rankResult = await prisma.$queryRaw<RankResult[]>(
            Prisma.sql`
                WITH ranked_users AS (
                    SELECT "userId", DENSE_RANK() OVER (ORDER BY SUM(value) DESC) as rank
                    FROM "Score"
                    GROUP BY "userId"
                )
                SELECT rank FROM ranked_users WHERE "userId" = ${userId}
            `
        );

        // Calculate rank from the DENSE_RANK result
        const rank = rankResult.length > 0 ? Number(rankResult[0].rank) : 1;

        // Format join date (e.g., "December 2024")
        const joinDate = user.createdAt.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        return {
            id: user.id,
            name: user.name,
            totalScore: userTotalScore,
            rank,
            totalQuizzes,
            accuracy,
            joinDate,
        };
    } catch (error) {
        console.error("Error fetching user leaderboard stats:", error);
        return null;
    }
}

export interface CategoryPerformance {
    id: string;
    name: string;
    slug: string;
    score: number;
    accuracy: number;
}

/**
 * Fetches category performance for a specific user.
 */
export async function getUserCategoryPerformance(userId: string): Promise<CategoryPerformance[]> {
    try {
        // Get the current session to verify authorization
        const session = await auth();

        // Verify that the requested userId matches the authenticated user's ID
        if (!session?.user?.id || session.user.id !== userId) {
            console.warn(`Unauthorized access attempt: session user ${maskUserId(session?.user?.id)} tried to access category performance for user ${maskUserId(userId)}`);
            return [];
        }

        // Fetch all categories and user's scores in parallel to avoid N+1 queries
        const [categories, userScores] = await Promise.all([
            prisma.quizCategory.findMany(),
            prisma.score.groupBy({
                by: ['categoryId'],
                where: {
                    userId,
                },
                _sum: { value: true },
                _avg: { value: true },
            })
        ]);

        // Create a map of categoryId to aggregated scores for quick lookup
        const scoresMap = new Map<string, { sum: number | null; avg: number | null }>();
        userScores.forEach(score => {
            scoresMap.set(score.categoryId, {
                sum: score._sum.value,
                avg: score._avg.value
            });
        });

        // Build performance array with all categories, including those with no scores
        const performance: CategoryPerformance[] = categories.map(category => {
            const scores = scoresMap.get(category.id);
            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                score: scores?.sum || 0,
                accuracy: scores?.avg ? Math.round(scores.avg) : 0,
            };
        });

        return performance;
    } catch (error) {
        console.error("Error fetching user category performance:", error);
        return [];
    }
}

export interface RecentActivity {
    category: string;
    score: number;
    time: string;
    correct?: number | null;
    total?: number | null;
}

/**
 * Fetches recent quiz activity for a specific user.
 */
export async function getUserRecentActivity(userId: string, limit = 4): Promise<RecentActivity[]> {
    try {
        // Get the current session to verify authorization
        const session = await auth();

        // Verify that the requested userId matches the authenticated user's ID
        if (!session?.user?.id || session.user.id !== userId) {
            console.warn(`Unauthorized access attempt: session user ${maskUserId(session?.user?.id)} tried to access recent activity for user ${maskUserId(userId)}`);
            return [];
        }

        const recentScores = await prisma.score.findMany({
            where: { userId },
            include: { category: true },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return recentScores.map((score) => {
            const timeDiff = new Date().getTime() - score.createdAt.getTime();
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);

            let timeStr = "Just now";
            if (days > 0) {
                timeStr = `${days} day${days > 1 ? "s" : ""} ago`;
            } else if (hours > 0) {
                timeStr = `${hours} hour${hours > 1 ? "s" : ""} ago`;
            } else {
                const minutes = Math.floor(timeDiff / (1000 * 60));
                if (minutes > 0) {
                    timeStr = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
                }
            }

            return {
                category: score.category.name,
                score: score.value,
                time: timeStr,
                // TODO: Store real correct/total counts in Score model when extended
                // Currently we only have the percentage score, not the actual question counts
                correct: null,
                total: null,
            };
        });
    } catch (error) {
        console.error("Error fetching user recent activity:", error);
        return [];
    }
}

/**
 * Fetches the top users for the global leaderboard.
 */
export async function getLeaderboardRankings(limit = 10): Promise<LeaderboardPlayer[]> {
    try {
        // 1. Get aggregated scores for all users who have played
        const scoreGroups = await prisma.score.groupBy({
            by: ["userId"],
            _sum: {
                value: true,
            },
            orderBy: {
                _sum: {
                    value: "desc",
                },
            },
            take: limit,
        });

        if (scoreGroups.length === 0) {
            return [];
        }

        // 2. Fetch user details for these users
        const userIds = scoreGroups.map((group) => group.userId);
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
        });

        // 3. Combine and format data
        // Map users for quick lookup
        const userMap = new Map(users.map((u) => [u.id, u]));

        const leaderboard: LeaderboardPlayer[] = scoreGroups.map((group, index) => {
            const user = userMap.get(group.userId);
            return {
                id: group.userId,
                rank: index + 1,
                name: user?.name ?? "Anonymous Explorer",
                score: group._sum.value ?? 0,
                avatar: user?.image ?? null,
            };
        });

        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard rankings:", error);
        return [];
    }
}

/**
 * Records a quiz score in the database.
 * Calculates the percentage score and links it to the user and category.
 */
export async function recordQuizScore(
    score: number,
    totalQuestions: number,
    categorySlug: string,
    timeInSeconds: number = 0,
    isRawValue: boolean = false
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;
        const value = isRawValue ? score : Math.round((score / totalQuestions) * 100);

        // Ensure the category exists
        const category = await prisma.quizCategory.upsert({
            where: { slug: categorySlug },
            update: {},
            create: {
                name: categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                slug: categorySlug,
            }
        });

        // Record the score
        await prisma.score.create({
            data: {
                userId,
                categoryId: category.id,
                value,
                timeInSeconds,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Error recording quiz score:", error);
        return { success: false, error: "Internal Server Error" };
    }
}

/**
 * Fetches the highest score for a specific category for the current user.
 */
export async function getCategoryHighScore(categorySlug: string): Promise<number> {
    try {
        const session = await auth();
        if (!session?.user?.id) return 0;

        const userId = session.user.id;

        const category = await prisma.quizCategory.findUnique({
            where: { slug: categorySlug },
            select: { id: true }
        });

        if (!category) return 0;

        const maxScore = await prisma.score.aggregate({
            where: {
                userId,
                categoryId: category.id
            },
            _max: {
                value: true
            }
        });

        return maxScore._max.value ?? 0;
    } catch (error) {
        console.error("Error fetching category high score:", error);
        return 0;
    }
}
