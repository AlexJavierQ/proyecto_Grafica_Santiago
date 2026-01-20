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

        // Bypass Prisma Client validation using raw SQL since the client is out of sync with the DB
        // 1. Unlink products that are no longer in this category
        if (productIds.length > 0) {
            const placeholders = productIds.map(() => '?').join(',')
            await prisma.$executeRawUnsafe(
                `UPDATE products SET categoryId = NULL WHERE categoryId = ? AND id NOT IN (${placeholders})`,
                categoryId,
                ...productIds
            )
        } else {
            await prisma.$executeRawUnsafe(
                `UPDATE products SET categoryId = NULL WHERE categoryId = ?`,
                categoryId
            )
        }

        // 2. Link all selected products
        let updatedCount = 0
        if (productIds.length > 0) {
            const placeholders = productIds.map(() => '?').join(',')
            updatedCount = await prisma.$executeRawUnsafe(
                `UPDATE products SET categoryId = ? WHERE id IN (${placeholders})`,
                categoryId,
                ...productIds
            )
        }

        return NextResponse.json({
            success: true,
            updated: updatedCount,
            message: `${updatedCount} productos procesados correctamente`
        })
    } catch (error: any) {
        console.error('Error linking products:', error)
        return NextResponse.json({
            error: error.message || 'Error al vincular productos',
            details: error.stack
        }, { status: 500 })
    }
}
