import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // 1. Ventas de los últimos 7 días
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const salesByDay = await prisma.order.groupBy({
            by: ['createdAt'],
            _sum: {
                total: true
            },
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                },
                status: {
                    not: 'CANCELLED'
                }
            }
        })

        // 2. Ventas por categoría
        const salesByCategory = await prisma.orderItem.findMany({
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            },
            where: {
                order: {
                    status: {
                        not: 'CANCELLED'
                    }
                }
            }
        })

        const categorySummary: Record<string, number> = {}
        salesByCategory.forEach(item => {
            const catName = item.product.category?.name || 'Sin Categoría'
            categorySummary[catName] = (categorySummary[catName] || 0) + item.subtotal
        })

        const categoryData = Object.entries(categorySummary).map(([name, value]) => ({ name, value }))

        // 3. Productos más vendidos
        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                subtotal: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        })

        const topProductsDetails = await Promise.all(
            topProducts.map(async (p) => {
                const details = await prisma.product.findUnique({
                    where: { id: p.productId },
                    select: { name: true }
                })
                return {
                    name: details?.name || 'Desconocido',
                    quantity: p._sum.quantity,
                    revenue: p._sum.subtotal
                }
            })
        )

        return NextResponse.json({
            salesByDay,
            categoryData,
            topProducts: topProductsDetails
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error al generar reportes' }, { status: 500 })
    }
}
