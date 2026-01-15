import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                status: true,
                companyName: true,
                wholesaleRequested: true,
                createdAt: true,
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
