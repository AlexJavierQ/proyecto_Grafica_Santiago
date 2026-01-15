import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST - Aprobar o rechazar solicitud mayorista
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { action } = await request.json()

        if (!action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Acción inválida. Use "approve" o "reject"' },
                { status: 400 }
            )
        }

        // Verificar que existe
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Verificar que tiene solicitud pendiente
        if (!user.wholesaleRequested || user.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Este usuario no tiene una solicitud mayorista pendiente' },
                { status: 400 }
            )
        }

        if (action === 'approve') {
            // Aprobar: cambiar rol a WHOLESALE y estado a ACTIVE
            await prisma.user.update({
                where: { id },
                data: {
                    role: 'WHOLESALE',
                    status: 'ACTIVE',
                    wholesaleRequested: false,
                },
            })

            // TODO: Enviar email de notificación

            return NextResponse.json({
                message: 'Usuario aprobado como mayorista exitosamente',
                success: true,
            })
        } else {
            // Rechazar: cambiar estado a REJECTED
            await prisma.user.update({
                where: { id },
                data: {
                    status: 'REJECTED',
                    wholesaleRequested: false,
                },
            })

            // TODO: Enviar email de notificación

            return NextResponse.json({
                message: 'Solicitud rechazada',
                success: true,
            })
        }
    } catch (error) {
        console.error('Error al procesar solicitud mayorista:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
