'use client'

import { useState, useEffect } from 'react'
import {
    ShoppingCart, Search, Eye, RefreshCw, Clock, CreditCard,
    Truck, CheckCircle, XCircle, Package, DollarSign, Filter,
    ChevronLeft, ChevronRight, Calendar, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.css'
import { toast } from 'sonner'

interface Order {
    id: string
    orderNumber: string
    createdAt: string
    total: number
    status: string
    paymentStatus: string
    user: {
        name: string
        email: string
    }
    _count: {
        items: number
    }
}

const ORDER_STATUSES = [
    { value: '', label: 'Todos', icon: Filter, color: '#64748b' },
    { value: 'PENDING', label: 'Pendiente', icon: Clock, color: '#f59e0b' },
    { value: 'PAID', label: 'Pagado', icon: CreditCard, color: '#22c55e' },
    { value: 'PROCESSING', label: 'En Proceso', icon: Package, color: '#3b82f6' },
    { value: 'SHIPPED', label: 'Enviado', icon: Truck, color: '#8b5cf6' },
    { value: 'DELIVERED', label: 'Entregado', icon: CheckCircle, color: '#10b981' },
    { value: 'CANCELLED', label: 'Cancelado', icon: XCircle, color: '#ef4444' },
]

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        paid: 0,
        shipped: 0,
        delivered: 0,
        revenue: 0
    })

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const query = new URLSearchParams()
            if (search) query.append('q', search)
            if (statusFilter) query.append('status', statusFilter)
            query.append('page', page.toString())
            query.append('limit', '12')

            const res = await fetch(`/api/admin/orders?${query.toString()}`)
            const data = await res.json()
            if (data.orders) {
                setOrders(data.orders)
                setPagination(data.pagination)

                // Calculate stats from all orders
                if (data.pagination) {
                    setStats({
                        total: data.pagination.total || 0,
                        pending: data.orders.filter((o: Order) => o.status === 'PENDING').length,
                        paid: data.orders.filter((o: Order) => o.status === 'PAID').length,
                        shipped: data.orders.filter((o: Order) => o.status === 'SHIPPED').length,
                        delivered: data.orders.filter((o: Order) => o.status === 'DELIVERED').length,
                        revenue: data.orders.reduce((acc: number, o: Order) => acc + o.total, 0)
                    })
                }
            }
        } catch (err) {
            toast.error('Error al cargar órdenes')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [statusFilter, page])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchOrders()
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return {
            date: date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    const getStatusInfo = (status: string) => {
        return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0]
    }

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            'PENDING': 'Pendiente',
            'PAID': 'Pagado',
            'PROCESSING': 'En Proceso',
            'SHIPPED': 'Enviado',
            'DELIVERED': 'Entregado',
            'CANCELLED': 'Cancelado'
        }
        return statusMap[status] || status
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                        <ShoppingCart size={28} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Gestión de Órdenes</h1>
                        <p className={styles.subtitle}>Supervisa y procesa los pedidos de tus clientes</p>
                    </div>
                </div>
                <button className={styles.refreshBtn} onClick={fetchOrders} disabled={isLoading}>
                    <RefreshCw size={18} className={isLoading ? styles.spin : ''} />
                    Actualizar
                </button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                        <ShoppingCart size={22} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{pagination?.total || orders.length}</span>
                        <span className={styles.statLabel}>Total Órdenes</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <Clock size={22} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.pending}</span>
                        <span className={styles.statLabel}>Pendientes</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                        <Truck size={22} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{stats.shipped}</span>
                        <span className={styles.statLabel}>En Camino</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                        <DollarSign size={22} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{formatPrice(stats.revenue)}</span>
                        <span className={styles.statLabel}>Ingresos</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
                <form className={styles.searchBox} onSubmit={handleSearch}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por # orden, cliente o email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className={styles.statusFilters}>
                    {ORDER_STATUSES.map(status => (
                        <button
                            key={status.value}
                            className={`${styles.statusFilterBtn} ${statusFilter === status.value ? styles.active : ''}`}
                            onClick={() => { setStatusFilter(status.value); setPage(1); }}
                            style={statusFilter === status.value ? { background: `${status.color}20`, borderColor: status.color, color: status.color } : {}}
                        >
                            <status.icon size={14} />
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.tableCard}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <RefreshCw size={24} className={styles.spin} />
                        <span>Cargando órdenes...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className={styles.empty}>
                        <ShoppingCart size={48} />
                        <h3>No hay órdenes</h3>
                        <p>No se encontraron órdenes con los filtros seleccionados</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Orden</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const dateInfo = formatDate(order.createdAt)
                                    const statusInfo = getStatusInfo(order.status)

                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <div className={styles.orderNumberCell}>
                                                    <span className={styles.orderNumber}>{order.orderNumber}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.dateCell}>
                                                    <span className={styles.dateMain}>{dateInfo.date}</span>
                                                    <span className={styles.dateTime}>{dateInfo.time}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.customerCell}>
                                                    <span className={styles.customerName}>{order.user.name}</span>
                                                    <span className={styles.customerEmail}>{order.user.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.itemsCount}>{order._count.items}</span>
                                            </td>
                                            <td>
                                                <span className={styles.priceCell}>{formatPrice(order.total)}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{
                                                        background: `${statusInfo.color}15`,
                                                        color: statusInfo.color,
                                                        borderColor: `${statusInfo.color}30`
                                                    }}
                                                >
                                                    <statusInfo.icon size={12} />
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <Link href={`/admin/ordenes/${order.id}`} className={styles.viewBtn}>
                                                    <Eye size={16} />
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                        <div className={styles.paginationInfo}>
                            Mostrando <strong>{orders.length}</strong> de <strong>{pagination.total}</strong> órdenes
                        </div>
                        <div className={styles.paginationControls}>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className={styles.pageBtn}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum = i + 1
                                if (pagination.totalPages > 5) {
                                    if (page > 3) {
                                        pageNum = page - 2 + i
                                    }
                                    if (page > pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i
                                    }
                                }
                                if (pageNum < 1 || pageNum > pagination.totalPages) return null
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`${styles.pageNum} ${page === pageNum ? styles.activePage : ''}`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}

                            <button
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className={styles.pageBtn}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
