import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Obtener un descuento por ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const discount = await prisma.discount.findUnique({
            where: { id },
            include: {
                product: { select: { id: true, name: true, sku: true, price: true } },
                category: { select: { id: true, name: true } }
            }
        })

        if (!discount) {
            return NextResponse.json({ error: 'Descuento no encontrado' }, { status: 404 })
        }

        return NextResponse.json(discount)
    } catch (error) {
        console.error('Error fetching discount:', error)
        return NextResponse.json({ error: 'Error al obtener descuento' }, { status: 500 })
    }
}

// PUT - Actualizar un descuento
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, description, type, value, productId, categoryId, startDate, endDate, isActive } = body

        const discount = await prisma.discount.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(type && { type }),
                ...(value !== undefined && { value: parseFloat(value) }),
                ...(productId !== undefined && { productId: productId || null }),
                ...(categoryId !== undefined && { categoryId: categoryId || null }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(isActive !== undefined && { isActive })
            },
            include: {
                product: { select: { id: true, name: true, sku: true } },
                category: { select: { id: true, name: true } }
            }
        })

        return NextResponse.json(discount)
    } catch (error) {
        console.error('Error updating discount:', error)
        return NextResponse.json({ error: 'Error al actualizar descuento' }, { status: 500 })
    }
}

// DELETE - Eliminar un descuento
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await prisma.discount.delete({ where: { id } })

        return NextResponse.json({ message: 'Descuento eliminado correctamente' })
    } catch (error) {
        console.error('Error deleting discount:', error)
        return NextResponse.json({ error: 'Error al eliminar descuento' }, { status: 500 })
    }
}
