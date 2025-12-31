import { NextResponse } from 'next/server';
import { languagesData, LanguageData } from '../../../../src/lib/data/languages';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Simple shuffling algorithm
    const shuffledLanguages = [...languagesData].sort(() => 0.5 - Math.random());
    const selectedLanguages = shuffledLanguages.slice(0, Math.min(count, languagesData.length));

    const questions = selectedLanguages.map((item) => {
        // Generate options: Correct answer + 3 random distractors
        const distractors = Array.from(new Set(
            languagesData
                .filter(l => l.language !== item.language)
                .map(l => l.language)
        ))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const options = [...distractors, item.language].sort(() => 0.5 - Math.random());

        return {
            id: item.country,
            country: item.country,
            correctAnswer: item.language,
            options: options,
            region: item.region
        };
    });

    return NextResponse.json(questions);
}
