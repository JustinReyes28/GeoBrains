"use server";

import { prisma } from "./prisma";

export interface UserLeaderboardStats {
    id: string;
    name: string | null;
    totalScore: number;
    rank: number;
}

/**
 * Fetches leaderboard stats for a specific user.
 * Calculates total score from all Score records and determines global rank.
 */
export async function getUserLeaderboardStats(userId: string): Promise<UserLeaderboardStats | null> {
    try {
        // Get the user's basic info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true },
        });

        if (!user) {
            return null;
        }

        // Calculate the user's total score
        const userScoreAggregate = await prisma.score.aggregate({
            where: { userId },
            _sum: { value: true },
        });
        const userTotalScore = userScoreAggregate._sum.value ?? 0;

        // Calculate rank by counting users with a higher total score
        // We need to get all users' total scores and determine position
        const allUserScores = await prisma.score.groupBy({
            by: ["userId"],
            _sum: { value: true },
        });

        // Sort by total score descending
        const sortedScores = allUserScores
            .map((entry) => ({
                userId: entry.userId,
                totalScore: entry._sum.value ?? 0,
            }))
            .sort((a, b) => b.totalScore - a.totalScore);

        // Find the user's rank (1-indexed)
        let rank = sortedScores.findIndex((entry) => entry.userId === userId) + 1;

        // If user has no scores, they won't be in the list, so rank is last
        if (rank === 0) {
            rank = sortedScores.length + 1;
        }

        return {
            id: user.id,
            name: user.name,
            totalScore: userTotalScore,
            rank,
        };
    } catch (error) {
        console.error("Error fetching user leaderboard stats:", error);
        return null;
    }
}
