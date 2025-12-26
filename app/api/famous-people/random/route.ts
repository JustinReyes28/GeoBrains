import { NextResponse } from 'next/server';
import { famousPeopleData, FamousPersonData } from '../../../../src/lib/data/famous_people';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Simple shuffling algorithm
    const shuffledPeople = [...famousPeopleData].sort(() => 0.5 - Math.random());
    const selectedPeople = shuffledPeople.slice(0, Math.min(count, famousPeopleData.length));

    const questions = selectedPeople.map((item) => {
        // Generate options: Correct answer + 3 random distractors
        const distractors = Array.from(new Set(
            famousPeopleData
                .filter(p => p.country !== item.country)
                .map(p => p.country)
        ))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const options = [...distractors, item.country].sort(() => 0.5 - Math.random());

        return {
            id: item.person,
            person: item.person,
            description: item.description,
            correctAnswer: item.country,
            options: options,
            region: item.region,
            imageUrl: item.imageUrl
        };
    });

    return NextResponse.json(questions);
}
