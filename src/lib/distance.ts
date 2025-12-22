/**
 * Calculate the distance between two points using the Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Calculate points based on distance from actual location
 */
export function calculatePoints(distanceKm: number): { points: number; feedback: string; color: string } {
    if (distanceKm < 100) return { points: 1000, feedback: "🎯 Perfect!", color: "text-emerald-400" };
    if (distanceKm < 300) return { points: 750, feedback: "🔥 Amazing!", color: "text-emerald-300" };
    if (distanceKm < 500) return { points: 500, feedback: "👍 Great!", color: "text-blue-400" };
    if (distanceKm < 1000) return { points: 250, feedback: "😅 Close!", color: "text-amber-400" };
    if (distanceKm < 2000) return { points: 100, feedback: "🌍 Keep trying!", color: "text-orange-400" };
    return { points: 0, feedback: "❌ Too far!", color: "text-red-400" };
}
