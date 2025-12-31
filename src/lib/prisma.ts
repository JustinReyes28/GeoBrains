import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL

if (!connectionString) {
    console.error('❌ Database connection string is missing in environment variables.')
    throw new Error('Missing database connection environment variable (DATABASE_URL, POSTGRES_PRISMA_URL, etc.)')
}

const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: 10000, // 10s timeout
})
const adapter = new PrismaPg(pool)

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
