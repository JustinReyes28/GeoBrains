import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { modes, type Mode } from '@/src/lib/quiz/config';
export const metadata = { title: 'World tour challenges | GeoBrains' };
export default async function PlayPage({ searchParams }: {
    searchParams: Promise<{
        mode?: string;
    }>;
}) {
    const { mode } = await searchParams;
    const initialMode = modes.includes(mode as Mode) ? mode as Mode : 'classic';
    return <QuizPlayer initialMode={initialMode} />;
}
