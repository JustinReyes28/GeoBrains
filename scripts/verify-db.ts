
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    console.log('--- Database Verification ---');

    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { scores: true }
            }
        }
    });

    console.log(`Total users: ${users.length}`);

    for (const user of users) {
        const scores = await prisma.score.findMany({
            where: { userId: user.id },
            include: { category: true }
        });

        console.log(`\nUser: ${user.name} (${user.email})`);
        console.log(`ID: ${user.id}`);
        console.log(`Total scores in DB: ${user._count.scores}`);

        if (scores.length > 0) {
            const totalScore = scores.reduce((sum, s) => sum + s.value, 0);
            const avgScore = totalScore / scores.length;
            console.log(`Calculated Total Score: ${totalScore}`);
            console.log(`Calculated Avg Accuracy: ${Math.round(avgScore)}%`);

            const categories = [...new Set(scores.map(s => s.category.name))];
            console.log(`Categories played: ${categories.join(', ')}`);
        } else {
            console.log('No scores found for this user.');
        }
    }

    const categories = await prisma.quizCategory.findMany();
    console.log(`\nTotal categories in DB: ${categories.length}`);
    for (const cat of categories) {
        console.log(`- ${cat.name} (${cat.slug})`);
    }
}

verify()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
