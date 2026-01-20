import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        const data = await request.json()

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                order: parseInt(data.order || '0'),
                isActive: data.isActive
            }
        })

        return NextResponse.json(category)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id

        // Verificar si hay productos en esta categoría
        const productsCount = await prisma.product.count({
            where: { categoryId: id }
        })

        if (productsCount > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar la categoría porque tiene productos asociados' },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Categoría eliminada' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
