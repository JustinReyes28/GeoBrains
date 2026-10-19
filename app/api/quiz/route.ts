import { NextResponse } from 'next/server';
import { parseQuizQuery } from '@/src/lib/quiz/schema';
import { generateRound } from '@/src/lib/quiz/questions';
export const dynamic='force-dynamic';
export async function GET(request:Request) {
 const parsed=parseQuizQuery(request.url);
 if(!parsed.success) return NextResponse.json({error:'Choose a valid category, mode, region, difficulty, and count from 1 to 50.'},{status:400});
 return NextResponse.json(generateRound(parsed.data),{headers:{'Cache-Control':'no-store'}});
}
