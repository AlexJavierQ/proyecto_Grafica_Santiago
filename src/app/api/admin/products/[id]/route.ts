import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET - Obtener un producto específico
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        })

        if (!product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PUT - Actualizar un producto
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const { name, sku, description, price, wholesalePrice, stock, minStock, categoryId, isActive, images } = body

        const updateData: Record<string, unknown> = {}

        if (name !== undefined) updateData.name = name
        if (sku !== undefined) updateData.sku = sku
        if (description !== undefined) updateData.description = description
        if (price !== undefined) updateData.price = price
        if (wholesalePrice !== undefined) updateData.wholesalePrice = wholesalePrice
        if (stock !== undefined) updateData.stock = stock
        if (minStock !== undefined) updateData.minStock = minStock
        if (categoryId !== undefined) updateData.categoryId = categoryId
        if (isActive !== undefined) updateData.isActive = isActive
        if (images !== undefined) updateData.images = JSON.stringify(images)

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { category: true }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
    }
}

// DELETE - Eliminar un producto
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params

        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
    }
}
