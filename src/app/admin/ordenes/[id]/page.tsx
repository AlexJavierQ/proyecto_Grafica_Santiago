'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Package, User, MapPin, CreditCard, ShoppingCart, Truck, CheckCircle, Clock, XCircle, AlertCircle, Save, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import styles from './page.module.css'
import { toast } from 'sonner'

interface OrderItem {
    id: string
    quantity: number
    unitPrice: number
    subtotal: number
    product: {
        name: string
        sku: string
    }
}

interface Order {
    id: string
    orderNumber: string
    createdAt: string
    total: number
    subtotal: number
    shipping: number
    status: string
    paymentStatus: string
    paymentMethod: string | null
    notes: string | null
    trackingNumber: string | null
    user: {
        name: string
        email: string
        phone: string | null
    }
    address: {
        name: string
        phone: string
        address: string
        city: string
        province: string
    } | null
    items: OrderItem[]
}

const ORDER_STATUSES = [
    { value: 'PENDING', label: 'Pendiente', icon: Clock, color: '#f59e0b' },
    { value: 'PAID', label: 'Pagado', icon: CreditCard, color: '#22c55e' },
    { value: 'PROCESSING', label: 'En Proceso', icon: Package, color: '#3b82f6' },
    { value: 'SHIPPED', label: 'Enviado', icon: Truck, color: '#8b5cf6' },
    { value: 'DELIVERED', label: 'Entregado', icon: CheckCircle, color: '#10b981' },
    { value: 'CANCELLED', label: 'Cancelado', icon: XCircle, color: '#ef4444' },
]

const PAYMENT_STATUSES = [
    { value: 'PENDING', label: 'Pendiente', color: '#f59e0b' },
    { value: 'PAID', label: 'Pagado', color: '#22c55e' },
    { value: 'REFUNDED', label: 'Reembolsado', color: '#8b5cf6' },
    { value: 'FAILED', label: 'Fallido', color: '#ef4444' },
]

export default function OrderDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [status, setStatus] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('')
    const [trackingNumber, setTrackingNumber] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (id) {
            fetchOrder()
        }
    }, [id])

    const fetchOrder = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/admin/orders/${id}`)
            const data = await res.json()
            if (res.ok) {
                setOrder(data)
                setStatus(data.status)
                setPaymentStatus(data.paymentStatus)
                setTrackingNumber(data.trackingNumber || '')
                setNotes(data.notes || '')
            } else {
                toast.error(data.error || 'Error al cargar la orden')
            }
        } catch (err) {
            toast.error('Error de conexión')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        setIsUpdating(true)
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    paymentStatus,
                    trackingNumber: trackingNumber || undefined,
                    notes: notes || undefined
                })
            })
            if (res.ok) {
                const updatedOrder = await res.json()
                setOrder(prev => prev ? { ...prev, ...updatedOrder } : null)
                toast.success('Orden actualizada correctamente')
            } else {
                const error = await res.json()
                toast.error(error.error || 'Error al actualizar orden')
            }
        } catch (err) {
            toast.error('Error de conexión')
        } finally {
            setIsUpdating(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-EC', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getCurrentStatusIndex = () => {
        return ORDER_STATUSES.findIndex(s => s.value === status)
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <RefreshCw size={24} className={styles.spin} />
                    <span>Cargando orden...</span>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <AlertCircle size={48} />
                    <h2>Orden no encontrada</h2>
                    <p>La orden que buscas no existe o fue eliminada</p>
                    <Link href="/admin/ordenes" className={styles.backBtn}>
                        <ArrowLeft size={18} />
                        Volver a Órdenes
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Link href="/admin/ordenes" className={styles.backButton}>
                <ArrowLeft size={16} />
                Volver a Órdenes
            </Link>

            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h1>Orden #{order.orderNumber}</h1>
                    <p className={styles.orderDate}>Realizada el {formatDate(order.createdAt)}</p>
                </div>
                <div className={styles.headerBadges}>
                    <span
                        className={styles.statusBadge}
                        style={{ background: `${ORDER_STATUSES.find(s => s.value === order.status)?.color}20`, color: ORDER_STATUSES.find(s => s.value === order.status)?.color }}
                    >
                        {ORDER_STATUSES.find(s => s.value === order.status)?.label}
                    </span>
                    <span
                        className={styles.statusBadge}
                        style={{ background: `${PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.color}20`, color: PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.color }}
                    >
                        Pago: {PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.label}
                    </span>
                </div>
            </div>

            {/* Status Timeline */}
            <div className={styles.statusTimeline}>
                {ORDER_STATUSES.filter(s => s.value !== 'CANCELLED').map((s, index) => {
                    const currentIndex = getCurrentStatusIndex()
                    const isActive = index <= currentIndex && status !== 'CANCELLED'
                    const isCurrent = s.value === status
                    const IconComponent = s.icon

                    return (
                        <div
                            key={s.value}
                            className={`${styles.timelineStep} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
                        >
                            <div className={styles.timelineIcon} style={isActive ? { background: s.color } : {}}>
                                <IconComponent size={18} />
                            </div>
                            <span className={styles.timelineLabel}>{s.label}</span>
                            {index < ORDER_STATUSES.length - 2 && <div className={`${styles.timelineLine} ${isActive && index < currentIndex ? styles.activeLine : ''}`} />}
                        </div>
                    )
                })}
            </div>

            <div className={styles.grid}>
                <div className={styles.leftColumn}>
                    {/* Productos */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <ShoppingCart size={20} />
                            Productos ({order.items.length})
                        </h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cant.</th>
                                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className={styles.productInfo}>
                                                <div>
                                                    <span className={styles.productName}>{item.product.name}</span>
                                                    <span className={styles.productSku}>SKU: {item.product.sku}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatPrice(item.unitPrice)}</td>
                                        <td>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.orderSummary}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Envío</span>
                                <span>{formatPrice(order.shipping)}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Gestión de Estado */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <Package size={20} />
                            Gestión de Orden
                        </h2>

                        <div className={styles.statusControls}>
                            <div className={styles.controlGroup}>
                                <label>Estado de la Orden</label>
                                <select
                                    className={styles.select}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {ORDER_STATUSES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Estado de Pago</label>
                                <select
                                    className={styles.select}
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                >
                                    {PAYMENT_STATUSES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Número de Seguimiento</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Ej: EC123456789"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Notas Internas</label>
                                <textarea
                                    className={styles.textarea}
                                    rows={3}
                                    placeholder="Notas sobre esta orden..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <button
                                className={styles.saveBtn}
                                onClick={handleUpdateStatus}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <RefreshCw size={18} className={styles.spin} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    {/* Cliente */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <User size={20} />
                            Cliente
                        </h2>
                        <div className={styles.customerDetail}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Nombre</span>
                                <span className={styles.detailValue}>{order.user.name}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Email</span>
                                <span className={styles.detailValue}>{order.user.email}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Teléfono</span>
                                <span className={styles.detailValue}>{order.user.phone || 'No registrado'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Envío */}
                    {order.address && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <MapPin size={20} />
                                Dirección de Envío
                            </h2>
                            <div className={styles.customerDetail}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Destinatario</span>
                                    <span className={styles.detailValue}>{order.address.name}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Dirección</span>
                                    <span className={styles.detailValue}>{order.address.address}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Ciudad / Provincia</span>
                                    <span className={styles.detailValue}>{order.address.city}, {order.address.province}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Teléfono</span>
                                    <span className={styles.detailValue}>{order.address.phone}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pago */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>
                            <CreditCard size={20} />
                            Método de Pago
                        </h2>
                        <div className={styles.detailItem}>
                            <span className={styles.detailValue}>{order.paymentMethod || 'No especificado'}</span>
                        </div>
                    </div>

                    {/* Tracking */}
                    {order.trackingNumber && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <Truck size={20} />
                                Seguimiento
                            </h2>
                            <div className={styles.trackingBox}>
                                <span className={styles.trackingNumber}>{order.trackingNumber}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
