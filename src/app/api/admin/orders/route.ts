import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const q = searchParams.get('q')?.toLowerCase()
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // Build where clause compatible with SQLite
        const whereConditions: any[] = []

        if (status) {
            whereConditions.push({ status })
        }

        if (q) {
            whereConditions.push({
                OR: [
                    { orderNumber: { contains: q } },
                    { user: { name: { contains: q } } },
                    { user: { email: { contains: q } } }
                ]
            })
        }

        const where = whereConditions.length > 0 ? { AND: whereConditions } : {}

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    _count: {
                        select: { items: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.order.count({ where })
        ])

        return NextResponse.json({
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener órdenes' }, { status: 500 })
    }
}
