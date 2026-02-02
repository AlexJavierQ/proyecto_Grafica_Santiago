import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Listar todos los descuentos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const activeOnly = searchParams.get('active') === 'true'

        const where: any = {}

        if (activeOnly) {
            const now = new Date()
            where.isActive = true
            where.startDate = { lte: now }
            where.endDate = { gte: now }
        }

        const discounts = await prisma.discount.findMany({
            where,
            include: {
                product: { select: { id: true, name: true, sku: true } },
                category: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(discounts)
    } catch (error) {
        console.error('Error fetching discounts:', error)
        return NextResponse.json({ error: 'Error al obtener descuentos' }, { status: 500 })
    }
}

// POST - Crear un nuevo descuento
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description, type, value, productId, categoryId, startDate, endDate } = body

        // Validaciones
        if (!name || !type || !value || !startDate || !endDate) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        if (!productId && !categoryId) {
            return NextResponse.json({ error: 'Debe seleccionar un producto o categoría' }, { status: 400 })
        }

        if (productId && categoryId) {
            return NextResponse.json({ error: 'Seleccione solo producto O categoría, no ambos' }, { status: 400 })
        }

        if (type === 'PERCENTAGE' && (value < 0 || value > 100)) {
            return NextResponse.json({ error: 'El porcentaje debe estar entre 0 y 100' }, { status: 400 })
        }

        const discount = await prisma.discount.create({
            data: {
                name,
                description,
                type,
                value: parseFloat(value),
                productId: productId || null,
                categoryId: categoryId || null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive: true
            },
            include: {
                product: { select: { id: true, name: true, sku: true } },
                category: { select: { id: true, name: true } }
            }
        })

        return NextResponse.json(discount, { status: 201 })
    } catch (error) {
        console.error('Error creating discount:', error)
        return NextResponse.json({ error: 'Error al crear descuento' }, { status: 500 })
    }
}
