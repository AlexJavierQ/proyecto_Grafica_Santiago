'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import styles from './CartModal.module.css'

interface CartModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()

    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Modal */}
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <ShoppingBag size={22} />
                        Tu Carrito
                        {totalItems() > 0 && (
                            <span className={styles.itemCount}>{totalItems()}</span>
                        )}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.empty}>
                            <ShoppingBag size={64} strokeWidth={1} />
                            <h3>Tu carrito está vacío</h3>
                            <p>Agrega productos para comenzar tu compra</p>
                            <Link href="/productos" className={styles.browseBtn} onClick={onClose}>
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        <>
                            <ul className={styles.itemList}>
                                {items.map((item) => {
                                    const itemImage = item.image || '/placeholder-product.jpg'

                                    return (
                                        <li key={item.id} className={styles.item}>
                                            <div className={styles.itemImage}>
                                                <img
                                                    src={itemImage}
                                                    alt={item.name}
                                                    className={styles.image}
                                                />
                                            </div>
                                            <div className={styles.itemDetails}>
                                                <Link
                                                    href={`/productos/${item.id}`}
                                                    className={styles.itemName}
                                                    onClick={onClose}
                                                >
                                                    {item.name}
                                                </Link>
                                                <span className={styles.itemPrice}>
                                                    ${item.price.toFixed(2)}
                                                </span>
                                                <div className={styles.quantityControls}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className={styles.qtyBtn}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className={styles.quantity}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className={styles.qtyBtn}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={styles.itemActions}>
                                                <span className={styles.itemTotal}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className={styles.removeBtn}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.subtotal}>
                            <span>Subtotal</span>
                            <span className={styles.subtotalAmount}>${totalPrice().toFixed(2)}</span>
                        </div>
                        <p className={styles.shippingNote}>
                            Envío e impuestos calculados en el checkout
                        </p>
                        <Link
                            href="/carrito"
                            className={styles.checkoutBtn}
                            onClick={onClose}
                        >
                            Ir al Carrito
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
