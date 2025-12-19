import { NextResponse } from 'next/server';
import { capitalsData, CountryData } from '../../../../src/lib/data/capitals';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Simple shuffling algorithm
    const shuffledCounties = [...capitalsData].sort(() => 0.5 - Math.random());
    const selectedCountries = shuffledCounties.slice(0, Math.min(count, capitalsData.length));

    const questions = selectedCountries.map((country) => {
        // Generate options: Correct answer + 3 random distractors
        const distractors = capitalsData
            .filter(c => c.country !== country.country)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => c.capital);

        const options = [...distractors, country.capital].sort(() => 0.5 - Math.random());

        return {
            id: country.country, // simple ID
            country: country.country,
            correctAnswer: country.capital,
            options: options,
            region: country.region,
            coordinates: { lat: country.lat, lng: country.lng }
        };
    });

    return NextResponse.json(questions);
}
