import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import {
    DollarSign,
    Package,
    Users,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    Clock,
    ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.css'

async function getDashboardData() {
    const [
        totalProducts,
        totalUsers,
        totalOrders,
        lowStockProducts,
        recentOrders,
        pendingWholesale,
        productsByCategory,
    ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.order.count(),
        prisma.product.findMany({
            where: {
                isActive: true,
                stock: { lte: 5 }
            },
            select: { id: true, name: true, stock: true, minStock: true },
            take: 5,
        }),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } },
        }),
        prisma.user.count({
            where: { wholesaleRequested: true, status: 'PENDING' }
        }),
        prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { order: 'asc' },
        }),
    ])

    // Calcular ventas totales (simulado ya que no hay órdenes reales)
    const totalSales = await prisma.order.aggregate({
        _sum: { total: true },
    })

    return {
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales: totalSales._sum.total || 0,
        lowStockProducts,
        recentOrders,
        pendingWholesale,
        productsByCategory,
    }
}

export default async function AdminDashboard() {
    const data = await getDashboardData()

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Bienvenido al panel de administración</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Ventas Totales</span>
                        <span className={styles.statValue}>{formatPrice(data.totalSales)}</span>
                    </div>
                    <TrendingUp className={styles.statTrend} size={20} />
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <Package size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Productos</span>
                        <span className={styles.statValue}>{data.totalProducts}</span>
                    </div>
                    <Link href="/admin/productos" className={styles.statLink}>
                        <ArrowUpRight size={20} />
                    </Link>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Usuarios</span>
                        <span className={styles.statValue}>{data.totalUsers}</span>
                    </div>
                    <Link href="/admin/usuarios" className={styles.statLink}>
                        <ArrowUpRight size={20} />
                    </Link>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <ShoppingCart size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Órdenes</span>
                        <span className={styles.statValue}>{data.totalOrders}</span>
                    </div>
                    <Link href="/admin/ordenes" className={styles.statLink}>
                        <ArrowUpRight size={20} />
                    </Link>
                </div>
            </div>

            {/* Alertas */}
            {(data.lowStockProducts.length > 0 || data.pendingWholesale > 0) && (
                <div className={styles.alerts}>
                    {data.pendingWholesale > 0 && (
                        <Link href="/admin/mayoristas" className={styles.alertCard}>
                            <Clock className={styles.alertIcon} />
                            <div>
                                <strong>{data.pendingWholesale} solicitudes mayoristas</strong>
                                <span>pendientes de aprobación</span>
                            </div>
                        </Link>
                    )}
                    {data.lowStockProducts.length > 0 && (
                        <div className={styles.alertCardWarning}>
                            <AlertTriangle className={styles.alertIcon} />
                            <div>
                                <strong>{data.lowStockProducts.length} productos</strong>
                                <span>con stock bajo</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.grid}>
                {/* Productos con stock bajo */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Stock Bajo</h2>
                        <Link href="/admin/productos" className={styles.cardLink}>Ver todos</Link>
                    </div>
                    <div className={styles.cardContent}>
                        {data.lowStockProducts.length === 0 ? (
                            <p className={styles.emptyState}>No hay productos con stock bajo 🎉</p>
                        ) : (
                            <ul className={styles.list}>
                                {data.lowStockProducts.map((product) => (
                                    <li key={product.id} className={styles.listItem}>
                                        <span className={styles.listName}>{product.name}</span>
                                        <span className={`${styles.badge} ${product.stock === 0 ? styles.badgeDanger : styles.badgeWarning}`}>
                                            {product.stock} unidades
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Productos por categoría */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Productos por Categoría</h2>
                        <Link href="/admin/categorias" className={styles.cardLink}>Ver todas</Link>
                    </div>
                    <div className={styles.cardContent}>
                        <ul className={styles.list}>
                            {data.productsByCategory.map((category) => (
                                <li key={category.id} className={styles.listItem}>
                                    <span className={styles.listName}>{category.name}</span>
                                    <span className={styles.badge}>
                                        {category._count.products} productos
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Órdenes recientes */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Órdenes Recientes</h2>
                        <Link href="/admin/ordenes" className={styles.cardLink}>Ver todas</Link>
                    </div>
                    <div className={styles.cardContent}>
                        {data.recentOrders.length === 0 ? (
                            <p className={styles.emptyState}>No hay órdenes aún</p>
                        ) : (
                            <ul className={styles.list}>
                                {data.recentOrders.map((order) => (
                                    <li key={order.id} className={styles.listItem}>
                                        <div>
                                            <span className={styles.listName}>{order.orderNumber}</span>
                                            <span className={styles.listSubtext}>{order.user.name}</span>
                                        </div>
                                        <span className={styles.listPrice}>{formatPrice(order.total)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
