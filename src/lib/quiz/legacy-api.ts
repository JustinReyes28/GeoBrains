import { NextResponse } from 'next/server';
import type { CategoryId } from './config';
import { parseQuizQuery } from './schema';
import { generateRound } from './questions';
export function legacyQuestions(request: Request, category: CategoryId) {
    const parsed = parseQuizQuery(request.url, category);
    if (!parsed.success)
        return NextResponse.json({ error: 'Invalid quiz parameters. Count must be an integer from 1 to 50.' }, { status: 400 });
    const round = generateRound({ ...parsed.data, mode: 'classic' });
    return NextResponse.json(round.questions.map(q => ({ ...q, country: q.subject, countryCode: q.countryCode, countryName: q.correctAnswer, landmarkName: q.correctAnswer, imagePath: q.image, imageUrl: q.image, person: q.subject, description: q.hint })), { headers: { 'Cache-Control': 'no-store' } });
}
