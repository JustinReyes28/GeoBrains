import { NextResponse } from 'next/server';
import { bordersData, getCountryNameByCode } from '../../../../src/lib/data/borders';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const count = parseInt(searchParams.get('count') || '10');

        // Filter out countries that have no recorded borders in our dataset just in case
        const validCountries = bordersData.filter(c => c.borders.length > 0);

        // Simple shuffling
        const shuffledCountries = [...validCountries].sort(() => 0.5 - Math.random());
        const selectedCountries = shuffledCountries.slice(0, Math.min(count, validCountries.length));

        const questions = selectedCountries.map((country) => {
            // 1. Select one correct neighbor
            // We need to ensure we can resolve its name.
            // validNeighbors are the codes in country.borders
            const validNeighbors = country.borders;
            const correctNeighborCode = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
            const correctAnswer = getCountryNameByCode(correctNeighborCode);

            // 2. Select 3 distractors
            // A distractor must NOT be the country itself AND must NOT be a neighbor
            // We use the bordersData list as the pool for distractors to ensure we have valid names
            const distractorPool = bordersData.filter(c =>
                c.cca3 !== country.cca3 &&
                !validNeighbors.includes(c.cca3)
            );

            const selectedDistractors = distractorPool
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(c => c.name);

            // 3. Combine and shuffle options
            const options = [...selectedDistractors, correctAnswer].sort(() => 0.5 - Math.random());

            // Try to find the neighbor object to get coordinates
            const neighborObj = bordersData.find(c => c.cca3 === correctNeighborCode);
            const neighborCoordinates = neighborObj
                ? { lat: neighborObj.centerLat, lng: neighborObj.centerLng }
                : undefined;

            return {
                id: country.cca3,
                country: country.name,
                correctAnswer: correctAnswer,
                options: options,
                region: country.region,
                coordinates: { lat: country.centerLat, lng: country.centerLng },
                neighborCoordinates
            };
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error("Error generating border questions:", error);
        return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }
}
