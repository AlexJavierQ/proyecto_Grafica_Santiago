import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// GET - Obtener un usuario
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                companyName: true,
                ruc: true,
                wholesaleRequested: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { orders: true },
                },
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error al obtener usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar usuario
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, phone, role, status, companyName, ruc, password } = body

        // Verificar que existe
        const existingUser = await prisma.user.findUnique({ where: { id } })
        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Preparar datos de actualización
        const updateData: Record<string, unknown> = {}

        if (name) updateData.name = name
        if (phone !== undefined) updateData.phone = phone
        if (role) updateData.role = role
        if (status) updateData.status = status
        if (companyName !== undefined) updateData.companyName = companyName
        if (ruc !== undefined) updateData.ruc = ruc

        // Si se proporciona nueva contraseña
        if (password && password.length >= 8) {
            updateData.password = await hashPassword(password)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Error al actualizar usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar usuario
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Verificar que existe
        const existingUser = await prisma.user.findUnique({ where: { id } })
        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // No permitir eliminar administradores
        if (existingUser.role === 'ADMIN') {
            return NextResponse.json(
                { error: 'No se puede eliminar un administrador' },
                { status: 403 }
            )
        }

        await prisma.user.delete({ where: { id } })

        return NextResponse.json({ message: 'Usuario eliminado' })
    } catch (error) {
        console.error('Error al eliminar usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
