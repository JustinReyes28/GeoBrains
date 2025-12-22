import { NextResponse } from 'next/server';
import { flagsData } from '../../../../src/lib/data/flags';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Simple shuffling algorithm
    const shuffledCountries = [...flagsData].sort(() => 0.5 - Math.random());
    const selectedCountries = shuffledCountries.slice(0, Math.min(count, flagsData.length));

    const questions = selectedCountries.map((country) => {
        // Generate options: Correct answer + 3 random distractors
        const distractors = flagsData
            .filter(c => c.name !== country.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => c.name);

        const options = [...distractors, country.name].sort(() => 0.5 - Math.random());

        return {
            id: country.code,
            countryCode: country.code,
            countryName: country.name,
            correctAnswer: country.name,
            options: options,
            region: country.region,
            coordinates: { lat: country.centerLat, lng: country.centerLng }
        };
    });

    return NextResponse.json(questions);
}
