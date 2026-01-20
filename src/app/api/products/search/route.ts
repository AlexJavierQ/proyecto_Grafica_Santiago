import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query || query.length < 2) {
            return NextResponse.json({ products: [] })
        }

        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } }
                ]
            },
            select: {
                id: true,
                name: true,
                price: true,
                images: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                }
            },
            take: 6
        })

        return NextResponse.json({ products })
    } catch (error) {
        console.error('Error in search API:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
