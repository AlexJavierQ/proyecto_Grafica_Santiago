import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Get current date and calculate date ranges
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Get total sales this month
        const salesThisMonth = await prisma.order.aggregate({
            where: {
                createdAt: { gte: startOfMonth },
                status: { not: 'CANCELLED' }
            },
            _sum: { total: true },
            _count: true
        })

        // Get total sales last month for comparison
        const salesLastMonth = await prisma.order.aggregate({
            where: {
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                status: { not: 'CANCELLED' }
            },
            _sum: { total: true },
            _count: true
        })

        // Get total orders this month
        const ordersThisMonth = await prisma.order.count({
            where: { createdAt: { gte: startOfMonth } }
        })

        const ordersLastMonth = await prisma.order.count({
            where: {
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
            }
        })

        // Get total users
        const totalUsers = await prisma.user.count()
        const newUsersThisMonth = await prisma.user.count({
            where: { createdAt: { gte: startOfMonth } }
        })

        // Get wholesale users count
        const wholesaleUsers = await prisma.user.count({
            where: { role: 'WHOLESALE' }
        })

        // Get total active products
        const totalProducts = await prisma.product.count({
            where: { isActive: true }
        })

        // Get products with low stock (stock <= 5)
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: { lte: 5 }
            },
            select: {
                id: true,
                name: true,
                sku: true,
                stock: true,
                minStock: true
            },
            orderBy: { stock: 'asc' },
            take: 5
        })

        // Get sales data for the last 7 days
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
        const last7Days: { name: string; date: string; ventas: number }[] = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            const dayName = dayNames[date.getDay()]
            last7Days.push({
                name: dayName,
                date: date.toISOString().split('T')[0],
                ventas: 0
            })
        }

        // Get actual order data for last 7 days
        const ordersLast7Days = await prisma.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: { not: 'CANCELLED' }
            },
            select: {
                total: true,
                createdAt: true
            }
        })

        // Aggregate by day
        ordersLast7Days.forEach(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
            const dayEntry = last7Days.find(d => d.date === orderDate)
            if (dayEntry) {
                dayEntry.ventas += order.total
            }
        })

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                createdAt: true,
                user: {
                    select: { name: true }
                }
            }
        })

        // Get top products (by quantity sold this month)
        const topProductsData = await prisma.orderItem.groupBy({
            by: ['productId'],
            where: {
                order: {
                    createdAt: { gte: startOfMonth },
                    status: { not: 'CANCELLED' }
                }
            },
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

        // Get product names for top products
        const topProductIds = topProductsData.map(p => p.productId)
        const productNames = await prisma.product.findMany({
            where: { id: { in: topProductIds } },
            select: { id: true, name: true }
        })

        const topProducts = topProductsData.map(p => {
            const product = productNames.find(pn => pn.id === p.productId)
            return {
                name: product?.name || 'Producto desconocido',
                quantity: p._sum.quantity || 0,
                revenue: p._sum.subtotal || 0
            }
        })

        // Get orders by status for pie chart
        const ordersByStatusData = await prisma.order.groupBy({
            by: ['status'],
            _count: true
        })

        const statusLabels: Record<string, string> = {
            'PENDING': 'Pendiente',
            'PAID': 'Pagado',
            'SHIPPED': 'Enviado',
            'DELIVERED': 'Entregado',
            'CANCELLED': 'Cancelado'
        }

        const ordersByStatus = ordersByStatusData.map(s => ({
            name: statusLabels[s.status] || s.status,
            value: s._count
        }))

        // Calculate percentage changes
        const currentSales = salesThisMonth._sum.total || 0
        const lastSales = salesLastMonth._sum.total || 0
        const salesChange = lastSales > 0
            ? Math.round(((currentSales - lastSales) / lastSales) * 100)
            : 0

        const ordersChange = ordersLastMonth > 0
            ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
            : 0

        // Calculate average order value
        const avgOrderValue = ordersThisMonth > 0 ? Math.round(currentSales / ordersThisMonth) : 0

        // Get pending wholesale requests count
        let pendingWholesaleRequests = 0
        try {
            pendingWholesaleRequests = await prisma.wholesaleRequest.count({
                where: { status: 'PENDING' }
            })
        } catch {
            // If table doesn't exist, try alternative
            pendingWholesaleRequests = await prisma.user.count({
                where: { wholesaleRequested: true }
            })
        }

        // Get pending orders count
        const pendingOrders = await prisma.order.count({
            where: { status: 'PENDING' }
        })

        return NextResponse.json({
            stats: {
                totalSales: currentSales,
                salesChange,
                totalOrders: ordersThisMonth,
                ordersChange,
                totalUsers,
                newUsers: newUsersThisMonth,
                pendingWholesaleRequests,
                pendingOrders,
                totalProducts,
                avgOrderValue,
                wholesaleUsers,
                conversionRate: 0 // Placeholder
            },
            lowStockProducts,
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                orderNumber: o.orderNumber,
                total: o.total,
                status: o.status,
                customerName: o.user?.name || 'Cliente',
                createdAt: o.createdAt.toISOString()
            })),
            topProducts,
            ordersByStatus,
            salesChart: last7Days.map(d => ({ name: d.name, ventas: Math.round(d.ventas) }))
        })
    } catch (error: any) {
        console.error('Dashboard API error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
