'use client'

import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'
import styles from './page.module.css'
import { DollarSign, Users, ShoppingBag, Package, AlertCircle, Loader2, TrendingUp, Clock, CheckCircle, Truck, ArrowUpRight, ArrowDownRight, Eye, Layers, Activity, Calendar, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    totalSales: number
    salesChange: number
    totalOrders: number
    ordersChange: number
    totalUsers: number
    newUsers: number
    pendingWholesaleRequests: number
    pendingOrders: number
    totalProducts: number
    avgOrderValue: number
    conversionRate: number
    wholesaleUsers: number
}

interface LowStockProduct {
    id: string
    name: string
    sku: string
    stock: number
    minStock: number
}

interface RecentOrder {
    id: string
    orderNumber: string
    total: number
    status: string
    customerName: string
    createdAt: string
}

interface SalesData {
    name: string
    ventas: number
}

interface TopProduct {
    name: string
    quantity: number
    revenue: number
}

const COLORS = ['#FFD700', '#00C49F', '#FF8042', '#8884d8', '#82ca9d']

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
    const [topProducts, setTopProducts] = useState<TopProduct[]>([])
    const [salesChart, setSalesChart] = useState<SalesData[]>([])
    const [ordersByStatus, setOrdersByStatus] = useState<{ name: string, value: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/admin/dashboard')
                const data = await res.json()

                if (data.error) {
                    setError(data.error)
                    return
                }

                setStats(data.stats)
                setLowStockProducts(data.lowStockProducts || [])
                setRecentOrders(data.recentOrders || [])
                setTopProducts(data.topProducts || [])
                setSalesChart(data.salesChart || [])
                setOrdersByStatus(data.ordersByStatus || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#f59e0b'
            case 'PAID': return '#10b981'
            case 'PROCESSING': return '#8b5cf6'
            case 'SHIPPED': return '#3b82f6'
            case 'DELIVERED': return '#22c55e'
            case 'CANCELLED': return '#ef4444'
            default: return '#6b7280'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendiente'
            case 'PAID': return 'Pagado'
            case 'PROCESSING': return 'Procesando'
            case 'SHIPPED': return 'Enviado'
            case 'DELIVERED': return 'Entregado'
            case 'CANCELLED': return 'Cancelado'
            default: return status
        }
    }

    if (isLoading) {
        return (
            <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <Loader2 size={48} className={styles.spin} style={{ color: 'var(--secondary)' }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Sincronizando métricas en tiempo real...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Welcome Banner */}
            <div className={styles.welcomeBanner}>
                <div className={styles.welcomeInfo}>
                    <h1 className={styles.welcomeTitle}>Panel de Control Administrativo</h1>
                    <p className={styles.welcomeSubtitle}>Visión general del rendimiento y gestión de operaciones de Santiago.</p>
                </div>
                <div className={styles.quickActions}>
                    <Link href="/admin/productos/nuevo" className={styles.actionButton}>
                        <Package size={18} />
                        <span>Producto</span>
                    </Link>
                    <Link href="/admin/mayoristas" className={styles.actionButton}>
                        <Users size={18} />
                        <span>Solicitudes ({stats?.pendingWholesaleRequests || 0})</span>
                    </Link>
                    <Link href="/admin/ordenes" className={styles.actionButton}>
                        <ShoppingBag size={18} />
                        <span>Órdenes</span>
                    </Link>
                </div>
            </div>

            {/* KPI Cards - Principal */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.green}`}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Ingresos Estimados</span>
                        <span className={styles.statValue}>{formatCurrency(stats?.totalSales || 0)}</span>
                        <span className={styles.statTrend} style={{ color: (stats?.salesChange || 0) >= 0 ? '#22c55e' : '#ef4444' }}>
                            {(stats?.salesChange || 0) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(stats?.salesChange || 0)}% <span style={{ opacity: 0.6, marginLeft: '4px' }}>vs mes anterior</span>
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.blue}`}>
                        <ShoppingBag size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Órdenes Realizadas</span>
                        <span className={styles.statValue}>{stats?.totalOrders || 0}</span>
                        <span className={styles.statTrend} style={{ color: (stats?.ordersChange || 0) >= 0 ? '#22c55e' : '#ef4444' }}>
                            {(stats?.ordersChange || 0) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(stats?.ordersChange || 0)}% <span style={{ opacity: 0.6, marginLeft: '4px' }}>asistencia</span>
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.yellow}`}>
                        <Activity size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Valor Promedio</span>
                        <span className={styles.statValue}>{formatCurrency(stats?.avgOrderValue || 0)}</span>
                        <span className={styles.statTrend} style={{ opacity: 0.5 }}>Eficiencia por venta</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.iconWrapper} ${styles.purple}`}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Clientes Registrados</span>
                        <span className={styles.statValue}>{stats?.totalUsers?.toLocaleString() || 0}</span>
                        <span className={styles.statTrend} style={{ color: '#22c55e' }}>
                            +{stats?.newUsers || 0} <span style={{ opacity: 0.6, marginLeft: '4px' }}>nuevos usuarios</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Mini Stats Grid */}
            <div className={styles.miniStatsGrid}>
                <div className={styles.miniStatCard}>
                    <Clock size={16} style={{ color: '#f59e0b' }} />
                    <div>
                        <span className={styles.miniStatValue}>{stats?.pendingOrders || 0}</span>
                        <span className={styles.miniStatLabel}>Por Atender</span>
                    </div>
                </div>
                <div className={styles.miniStatCard}>
                    <Layers size={16} style={{ color: '#3b82f6' }} />
                    <div>
                        <span className={styles.miniStatValue}>{stats?.totalProducts || 0}</span>
                        <span className={styles.miniStatLabel}>Catálogo Total</span>
                    </div>
                </div>
                <div className={styles.miniStatCard}>
                    <CheckCircle size={16} style={{ color: '#8b5cf6' }} />
                    <div>
                        <span className={styles.miniStatValue}>{stats?.wholesaleUsers || 0}</span>
                        <span className={styles.miniStatLabel}>Partners Mayoristas</span>
                    </div>
                </div>
                <div className={styles.miniStatCard}>
                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                    <div>
                        <span className={styles.miniStatValue}>{lowStockProducts.length}</span>
                        <span className={styles.miniStatLabel}>Alertas Stock</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
                {/* Evolución Temporal */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <TrendingUp size={20} style={{ color: 'var(--secondary)' }} />
                            <h3>Fluctuación de Ingresos</h3>
                        </div>
                        <Link href="/admin/reportes" className={styles.chartLink}>Análisis Detallado</Link>
                    </div>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={salesChart}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F9E219" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#F9E219" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(249, 226, 25, 0.2)', strokeWidth: 2 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        backgroundColor: '#111827',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                                    }}
                                    itemStyle={{ color: 'var(--secondary)', fontWeight: 700 }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontSize: '11px' }}
                                    formatter={(value: any) => [formatCurrency(value), 'Ventas Netas']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="var(--secondary)"
                                    fill="url(#colorSales)"
                                    strokeWidth={3}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Historial Operativo */}
                <div className={styles.recentOrdersCard}>
                    <div className={styles.chartHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Calendar size={20} style={{ color: 'var(--secondary)' }} />
                            <h3>Últimos Movimientos</h3>
                        </div>
                        <Link href="/admin/ordenes" className={styles.chartLink}>Historial</Link>
                    </div>
                    <div className={styles.ordersList}>
                        {recentOrders.length === 0 ? (
                            <div className={styles.emptyState}>No se han registrado transacciones hoy</div>
                        ) : (
                            recentOrders.slice(0, 5).map((order) => (
                                <div key={order.id} className={styles.orderItem}>
                                    <div className={styles.orderInfo}>
                                        <span className={styles.orderNumber}>Orden #{order.orderNumber}</span>
                                        <span className={styles.orderCustomer}>{order.customerName}</span>
                                    </div>
                                    <div className={styles.orderMeta}>
                                        <span className={styles.orderAmount}>{formatCurrency(order.total)}</span>
                                        <span
                                            className={styles.orderStatus}
                                            style={{
                                                background: `${getStatusColor(order.status)}15`,
                                                color: getStatusColor(order.status),
                                                border: `1px solid ${getStatusColor(order.status)}30`
                                            }}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className={styles.bottomGrid}>
                {/* Ranking de Productos */}
                <div className={styles.topProductsCard}>
                    <h3><BarChart3 size={18} /> Rendimiento de Artículos</h3>
                    <div className={styles.productsList}>
                        {topProducts.length === 0 ? (
                            <div className={styles.emptyState}>Datos insuficientes para el ranking</div>
                        ) : (
                            topProducts.slice(0, 5).map((product, index) => (
                                <div key={index} className={styles.topProductItem}>
                                    <span className={styles.productRank}>{index + 1}</span>
                                    <div className={styles.productDetails}>
                                        <span className={styles.productName}>{product.name}</span>
                                        <span className={styles.productQty}>{product.quantity} unidades despachadas</span>
                                    </div>
                                    <span className={styles.productRevenue}>{formatCurrency(product.revenue)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Salud del Stock */}
                <div className={styles.stockCard}>
                    <h3><AlertCircle size={16} /> Alertas Críticas de Stock</h3>
                    <div className={styles.stockList}>
                        {lowStockProducts.length === 0 ? (
                            <div className={styles.emptyStock}>
                                <CheckCircle size={32} style={{ color: '#22c55e', opacity: 0.8 }} />
                                <p>Inventario Sincronizado</p>
                                <span>No hay alertas de reposición pendientes.</span>
                            </div>
                        ) : (
                            lowStockProducts.slice(0, 5).map((product) => (
                                <div key={product.id} className={styles.stockItem}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{product.name}</span>
                                        <span className={styles.itemSku}>{product.sku}</span>
                                    </div>
                                    <span className={styles.stockCount} style={{ color: product.stock === 0 ? '#ef4444' : '#f59e0b' }}>
                                        {product.stock === 0 ? 'Agotado' : `${product.stock} un.`}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    {lowStockProducts.length > 5 && (
                        <Link href="/admin/productos" className={styles.viewInventoryBtn}>
                            Ver los {lowStockProducts.length} ítems restantes
                        </Link>
                    )}
                </div>

                {/* Distribución Operativa */}
                <div className={styles.pieChartCard}>
                    <h3>Estado Operativo de Órdenes</h3>
                    {ordersByStatus.length === 0 ? (
                        <div className={styles.emptyState}>Sin datos de flujo</div>
                    ) : (
                        <>
                            <div className={styles.pieWrapper}>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie
                                            data={ordersByStatus}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={1500}
                                        >
                                            {ordersByStatus.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="rgba(0,0,0,0.5)"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: '#111827',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                fontSize: '12px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.pieLegend}>
                                {ordersByStatus.map((entry, index) => (
                                    <div key={index} className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ background: COLORS[index % COLORS.length] }} />
                                        <span>{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
