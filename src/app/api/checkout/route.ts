import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { items, userId } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            )
        }

        // Usamos una transacción para asegurar integridad
        const result = await prisma.$transaction(async (tx) => {
            let totalAmount = 0

            // 1. Verificar stock y calcular total
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.id }
                })

                if (!product) {
                    throw new Error(`Producto ${item.name} no encontrado`)
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para ${item.name}. Disponible: ${product.stock}`)
                }

                totalAmount += item.price * item.quantity
            }

            // 2. Crear la orden (Asumiendo usuario anónimo si no hay userId por ahora, o crear usuario invitado)
            // Para simplicidad en este sprint, si no hay userId, usamos un ID fijo de prueba o null si el esquema lo permite
            // Ojo: El schema Order requiere userId. En un caso real obligaríamos login.
            // Aquí buscaré el primer usuario cliente para asignar la orden si no viene userId (solo para demo)
            let orderUserId = userId
            if (!orderUserId) {
                const demoUser = await tx.user.findFirst({ where: { role: 'CUSTOMER' } })
                if (demoUser) orderUserId = demoUser.id
            }

            if (!orderUserId) {
                throw new Error('Debes iniciar sesión para comprar')
            }

            const order = await tx.order.create({
                data: {
                    user: { connect: { id: orderUserId } },
                    status: 'PENDING',
                    total: totalAmount,
                    subtotal: totalAmount / 1.15,
                    orderNumber: `ORD-${Date.now()}`,
                    items: {
                        create: items.map((item: any) => ({
                            product: { connect: { id: item.id } },
                            quantity: item.quantity,
                            unitPrice: item.price,
                            subtotal: item.price * item.quantity
                        }))
                    },
                    address: {
                        create: {
                            user: { connect: { id: orderUserId } },
                            name: 'Cliente Generico',
                            phone: '0999999999',
                            address: 'Dirección Tienda',
                            city: 'Quito',
                            province: 'Pichincha',
                            postalCode: '170101'
                        }
                    }
                }
            })

            // 3. Descontar inventario
            for (const item of items) {
                const currentProduct = await tx.product.findUnique({ where: { id: item.id } });
                if (!currentProduct) continue;

                const newStock = currentProduct.stock - item.quantity;

                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: newStock }
                })

                // Registrar movimiento
                await tx.inventoryMovement.create({
                    data: {
                        productId: item.id,
                        type: 'OUT',
                        quantity: item.quantity,
                        reason: `Venta Orden #${order.orderNumber}`,
                        userId: orderUserId,
                        previousStock: currentProduct.stock,
                        newStock: newStock
                    }
                })
            }

            return order
        })

        return NextResponse.json({ success: true, order: result })

    } catch (error: any) {
        console.error('Error en checkout:', error)
        return NextResponse.json(
            { error: error.message || 'Error al procesar la orden' },
            { status: 500 }
        )
    }
}
