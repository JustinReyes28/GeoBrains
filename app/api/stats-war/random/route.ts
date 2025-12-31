import { NextResponse } from 'next/server';
import { statsData } from '../../../../src/lib/data/stats';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Shuffle countries
    const shuffled = [...statsData].sort(() => 0.5 - Math.random());

    // Create pairs for comparison
    const questions = [];
    for (let i = 0; i < Math.min(count, shuffled.length - 1); i++) {
        const countryA = shuffled[i];
        const countryB = shuffled[i + 1];

        // Randomly pick a stat type: population or area
        const statType = Math.random() > 0.5 ? 'population' : 'area';

        questions.push({
            id: `${countryA.code}-${countryB.code}-${statType}`,
            countryA: {
                code: countryA.code,
                name: countryA.name,
                value: statType === 'population' ? countryA.population : countryA.area
            },
            countryB: {
                code: countryB.code,
                name: countryB.name,
                value: statType === 'population' ? countryB.population : countryB.area
            },
            statType,
            label: statType === 'population' ? 'population' : 'land area'
        });
    }

    return NextResponse.json(questions);
}
