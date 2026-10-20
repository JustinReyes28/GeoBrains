import { NextResponse } from 'next/server';
import { parseQuizQuery } from '@/src/lib/quiz/schema';
import { shuffle } from '@/src/lib/quiz/random';
import { statsData } from '../../../../src/lib/data/stats';

export async function GET(request: Request) {
    const parsed=parseQuizQuery(request.url);
    if(!parsed.success)return NextResponse.json({error:'Invalid quiz parameters.'},{status:400});
    const {count}=parsed.data;

    // Shuffle countries
    const shuffled = shuffle(statsData);

    // Create pairs for comparison
    const questions = [];
    for (let i = 0; i < Math.min(count, shuffled.length - 1); i++) {
        const countryA = shuffled[i];
        const countryB = shuffled[i + 1];

        // Randomly pick a stat type: population or area
        const statType = Math.random() > 0.5 ? 'population' : 'area';

        if(countryA[statType]===countryB[statType])continue;
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
            label: statType === 'population' ? 'population' : 'total area'
        });
    }

    return NextResponse.json(questions,{headers:{'Cache-Control':'no-store'}});
}
