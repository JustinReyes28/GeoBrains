import { legacyQuestions } from '@/src/lib/quiz/legacy-api';
export const dynamic='force-dynamic';
export async function GET(request:Request) {return legacyQuestions(request,'landmarks');}
