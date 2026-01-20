import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Clock, CheckCircle, MapPin, User as UserIcon } from 'lucide-react'
import styles from './page.module.css'
import { formatPrice } from '@/lib/utils'
import { verifyToken } from '@/lib/auth'

async function getUserData() {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) return null

    try {
        const decoded = verifyToken(token.value)

        if (!decoded) return null

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                },
                addresses: true
            }
        })

        return user
    } catch (e) {
        return null
    }
}

export default async function ProfilePage() {
    const user = await getUserData()

    if (!user) {
        redirect('/login?redirect=/perfil')
    }

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Cabecera del Perfil */}
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            <UserIcon size={40} />
                        </div>
                        <div className={styles.headerInfo}>
                            <h1>Hola, {user.name}</h1>
                            <p>{user.email}</p>
                            <div className={styles.badges}>
                                <span className={styles.roleBadge}>{user.role}</span>
                                {(user as any).wholesaleRequested && user.role !== 'WHOLESALE' && (
                                    <span className={`${styles.statusBadge} ${styles.pending}`}>Solicitud Mayorista en Trámite</span>
                                )}
                                {user.role === 'WHOLESALE' && (
                                    <span className={`${styles.statusBadge} ${styles.approved}`}>Cliente Mayorista Verificado</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {/* Historial de Órdenes */}
                        <div className={styles.ordersSection}>
                            <h2><Clock size={20} /> Historial de Pedidos</h2>

                            {user.orders.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Package size={48} />
                                    <p>Aún no tienes pedidos.</p>
                                    <Link href="/productos" className={styles.btnPrimary}>
                                        Ir a comprar
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.ordersList}>
                                    {user.orders.map((order) => (
                                        <div key={order.id} className={styles.orderCard}>
                                            <div className={styles.orderHeader}>
                                                <div>
                                                    <span className={styles.orderNumber}>#{order.orderNumber}</span>
                                                    <span className={styles.orderDate}>
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className={styles.orderStatus}>
                                                    <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className={styles.orderTotal}>
                                                        {formatPrice(order.total)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.orderItems}>
                                                {order.items.map((item) => (
                                                    <div key={item.id} className={styles.miniItem}>
                                                        <span>{item.quantity}x {item.product.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Direcciones (Simplificado) */}
                        <div className={styles.addressesSection}>
                            <h2><MapPin size={20} /> Mis Direcciones</h2>
                            <div className={styles.addressCard}>
                                {user.addresses.length > 0 ? (
                                    <>
                                        <h3>Dirección Principal</h3>
                                        <p>{user.addresses[0].address}</p>
                                        <p>{user.addresses[0].city}, {user.addresses[0].province}</p>
                                    </>
                                ) : (
                                    <p className={styles.mutedText}>No tienes direcciones guardadas.</p>
                                )}
                                <button className={styles.btnOutline}>Gestionar Direcciones</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
