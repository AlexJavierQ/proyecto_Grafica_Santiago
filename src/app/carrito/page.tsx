'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react'
import styles from './page.module.css'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/authStore'

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
    const { user, isAuthenticated } = useAuthStore()
    const [mounted, setMounted] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para realizar la compra')
            router.push('/login?redirect=/carrito')
            return
        }

        setIsProcessing(true)
        const toastId = toast.loading('Procesando tu pedido...')

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    userId: user?.id
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error en el pago')
            }

            toast.dismiss(toastId)
            toast.success('¡Pedido realizado correctamente!')
            clearCart()
            router.push(`/checkout/exito?order=${data.order.orderNumber}`)
        } catch (error: any) {
            toast.dismiss(toastId)
            toast.error(error.message)
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.emptyCart}>
                            <ShoppingBag size={64} className={styles.emptyIcon} />
                            <h2 className={styles.emptyText}>Tu carrito está vacío</h2>
                            <Link href="/productos" className={styles.continueLink}>
                                Continuar comprando
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    const subtotal = totalPrice()
    const iva = subtotal * 0.15 // IVA Ecuador 15%
    const total = subtotal + iva

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Tu Carrito</h1>

                    <div className={styles.cartLayout}>
                        {/* Lista de Items */}
                        <div className={styles.itemsList}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.cartItem}>
                                    <img src={item.image} alt={item.name} className={styles.itemImage} />

                                    <div className={styles.itemInfo}>
                                        <Link href={`/productos/${item.id}`} className={styles.itemName}>
                                            {item.name}
                                        </Link>

                                        <div className={styles.itemMeta}>
                                            <span className={styles.price}>{formatPrice(item.price)} c/u</span>

                                            <div className={styles.controls}>
                                                <div className={styles.quantityControl}>
                                                    <button
                                                        className={styles.qtyBtn}
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                                    <button
                                                        className={styles.qtyBtn}
                                                        onClick={() => updateQuantity(item.id, Math.min(item.maxStock, item.quantity + 1))}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    className={styles.removeBtn}
                                                    onClick={() => removeItem(item.id)}
                                                    title="Eliminar producto"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de Orden */}
                        <div className={styles.summary}>
                            <h2>Resumen del Pedido</h2>

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>IVA (15%)</span>
                                <span>{formatPrice(iva)}</span>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <button
                                className={styles.checkoutButton}
                                onClick={handleCheckout}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Procesando...' : (
                                    <>Pagar Ahora <ArrowRight size={20} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
