import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../src/lib/prisma'

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method === 'GET') {
        const todos = await prisma.todo.findMany()
        return response.status(200).json(todos)
    }

    if (request.method === 'POST') {
        const { title } = request.body
        const todo = await prisma.todo.create({
            data: { title },
        })
        return response.status(201).json(todo)
    }

    return response.status(405).end()
}
