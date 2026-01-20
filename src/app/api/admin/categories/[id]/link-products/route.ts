import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user || (user.role !== 'ADMIN' && user.role !== 'WAREHOUSE')) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: categoryId } = await params
        const { productIds } = await request.json()

        if (!Array.isArray(productIds)) {
            return NextResponse.json({ error: 'productIds debe ser un array' }, { status: 400 })
        }

        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        })

        if (!category) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
        }

        // Usamos métodos estándar de Prisma para asegurar compatibilidad con PostgreSQL en Vercel
        // 1. Desvincular productos que ya no pertenecen a esta categoría
        await prisma.product.updateMany({
            where: {
                categoryId: categoryId,
                id: { notIn: productIds }
            },
            data: { categoryId: null as any }
        })

        // 2. Vincular los productos seleccionados
        const updateResult = await prisma.product.updateMany({
            where: {
                id: { in: productIds }
            },
            data: { categoryId: categoryId }
        })

        return NextResponse.json({
            success: true,
            updated: updateResult.count,
            message: `${updateResult.count} productos vinculados correctamente`
        })
    } catch (error: any) {
        console.error('Error linking products:', error)
        return NextResponse.json({
            error: error.message || 'Error al vincular productos',
            details: error.stack
        }, { status: 500 })
    }
}
