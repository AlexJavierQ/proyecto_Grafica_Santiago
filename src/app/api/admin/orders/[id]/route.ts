import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                address: true,
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                images: true
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json({ error: 'Error al obtener detalle de orden' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const data = await request.json()

        // Validate status values
        const validOrderStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        const validPaymentStatuses = ['PENDING', 'PAID', 'REFUNDED', 'FAILED']

        if (data.status && !validOrderStatuses.includes(data.status)) {
            return NextResponse.json({ error: 'Estado de orden inválido' }, { status: 400 })
        }

        if (data.paymentStatus && !validPaymentStatuses.includes(data.paymentStatus)) {
            return NextResponse.json({ error: 'Estado de pago inválido' }, { status: 400 })
        }

        const updateData: Record<string, any> = {}

        if (data.status) updateData.status = data.status
        if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus
        if (data.notes !== undefined) updateData.notes = data.notes
        if (data.trackingNumber) updateData.trackingNumber = data.trackingNumber

        const order = await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(order)
    } catch (error: any) {
        console.error('Error updating order:', error)
        return NextResponse.json({ error: error.message || 'Error al actualizar orden' }, { status: 500 })
    }
}
