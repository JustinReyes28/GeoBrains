import { NextResponse } from 'next/server';
import { landmarksData } from '../../../../src/lib/data/landmarks';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');

    // Simple shuffling algorithm
    const shuffledLandmarks = [...landmarksData].sort(() => 0.5 - Math.random());
    const selectedLandmarks = shuffledLandmarks.slice(0, Math.min(count, landmarksData.length));

    const questions = selectedLandmarks.map((landmark) => {
        // Generate options: Correct answer + 3 random distractors
        const distractors = landmarksData
            .filter(l => l.name !== landmark.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(l => l.name);

        const options = [...distractors, landmark.name].sort(() => 0.5 - Math.random());

        return {
            id: landmark.id,
            landmarkName: landmark.name,
            imagePath: landmark.imagePath,
            correctAnswer: landmark.name,
            options: options,
            country: landmark.country,
            coordinates: landmark.coordinates
        };
    });

    return NextResponse.json(questions);
}
