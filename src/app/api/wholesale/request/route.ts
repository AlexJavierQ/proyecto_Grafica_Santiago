import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Debe iniciar sesión para realizar esta solicitud' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { error: 'Sesión inválida' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { companyName, taxId, phone, address, message } = body

        if (!companyName || !taxId || !phone || !address) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Actualizar el usuario con la solicitud
        await prisma.user.update({
            where: { id: payload.userId },
            data: {
                wholesaleRequested: true,
                companyName,
                ruc: taxId,
                phone, // Actualizar el teléfono también si se proporciona uno nuevo
                wholesaleAddress: address,
                wholesaleMessage: message
            } as any
        })

        return NextResponse.json({
            message: 'Solicitud enviada con éxito'
        })
    } catch (error) {
        console.error('Error al procesar solicitud mayorista:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
