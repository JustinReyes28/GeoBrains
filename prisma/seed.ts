import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = `${process.env.POSTGRES_PRISMA_URL}`

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('--- Seeding Test Data ---')

    // 1. Create a Test User
    const user = await prisma.user.upsert({
        where: { email: 'test@geobrains.com' },
        update: {},
        create: {
            email: 'test@geobrains.com',
            name: 'Test Explorer',
            password: 'password123',
        },
    })
    console.log(`Created user: ${user.name}`)

    // 2. Create a Quiz Category
    const category = await prisma.quizCategory.upsert({
        where: { slug: 'world-capitals' },
        update: {},
        create: {
            name: 'World Capitals',
            slug: 'world-capitals',
            description: 'Test your knowledge of world capitals!',
        },
    })
    console.log(`Created category: ${category.name}`)

    // 3. Create some Questions
    const questions = [
        {
            text: 'What is the capital of France?',
            answer: 'Paris',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
        },
        {
            text: 'What is the capital of Japan?',
            answer: 'Tokyo',
            options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
        },
    ]

    for (const q of questions) {
        await prisma.question.upsert({
            where: { id: `q-${q.text.toLowerCase().replace(/\s+/g, '-')}` },
            update: {},
            create: {
                id: `q-${q.text.toLowerCase().replace(/\s+/g, '-')}`,
                ...q,
                categoryId: category.id,
            }
        })
    }
    console.log(`Ensured ${questions.length} questions exist.`)

    console.log('--- Seed Finished ---')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Seed Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
