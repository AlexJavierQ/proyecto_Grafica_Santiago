'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { parseImages } from '@/lib/utils'
import styles from './page.module.css'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AddToCartProps {
    product: {
        id: string
        name: string
        price: number
        stock: number
        images: string
    }
}

export default function AddToCart({ product }: AddToCartProps) {
    const [quantity, setQuantity] = useState(1)
    const addItem = useCartStore((state) => state.addItem)
    const [isAdding, setIsAdding] = useState(false)
    const router = useRouter()

    const handleAddToCart = () => {
        setIsAdding(true)

        const imageList = parseImages(product.images)
        const imageUrl = imageList[0] || '/placeholder-product.jpg'

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: Number(quantity),
            image: imageUrl,
            maxStock: product.stock
        })

        // Simular feedback visual
        setTimeout(() => {
            setIsAdding(false)
            toast.success(`Agregado: ${quantity} x ${product.name}`)
            router.refresh()
        }, 500)
    }

    if (product.stock === 0) return null

    return (
        <div className={styles.actions}>
            <div className={styles.quantitySelector}>
                <label>Cantidad:</label>
                <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={isAdding}
            >
                {isAdding ? 'Agregando...' : (
                    <>
                        Agregar al Carrito <ShoppingCart size={20} style={{ marginLeft: '10px' }} />
                    </>
                )}
            </button>
        </div>
    )
}
