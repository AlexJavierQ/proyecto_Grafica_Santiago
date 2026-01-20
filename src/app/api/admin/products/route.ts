import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const q = searchParams.get('q')?.toLowerCase()
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // SQLite compatible query (no 'mode: insensitive')
        const where = q ? {
            OR: [
                { name: { contains: q } },
                { sku: { contains: q } }
            ]
        } : {}

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ])

        return NextResponse.json({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Validar SKU único
        const existing = await prisma.product.findUnique({
            where: { sku: data.sku }
        })

        if (existing) {
            return NextResponse.json({ error: 'El SKU ya existe' }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                price: parseFloat(data.price),
                wholesalePrice: data.wholesalePrice ? parseFloat(data.wholesalePrice) : null,
                stock: parseInt(data.stock),
                categoryId: data.categoryId,
                description: data.description,
                images: JSON.stringify(data.images || []), // Array de URLs
                isActive: data.isActive
            }
        })

        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
