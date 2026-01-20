import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const includeCount = searchParams.get('includeCount') === 'true'

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                orderBy: {
                    order: 'asc'
                },
                include: includeCount ? {
                    _count: {
                        select: { products: true }
                    }
                } : undefined,
                skip,
                take: limit
            }),
            prisma.category.count()
        ])

        return NextResponse.json({
            categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                order: parseInt(data.order || '0'),
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        })

        return NextResponse.json(category)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
