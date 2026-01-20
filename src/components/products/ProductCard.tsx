'use client'

import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { formatPrice, parseImages } from '@/lib/utils'
import styles from './ProductCard.module.css'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'

interface ProductCardProps {
    id: string
    name: string
    price: number
    wholesalePrice?: number | null
    images: string
    category: string
    stock: number
    isWholesale?: boolean
}

export default function ProductCard({
    id,
    name,
    price,
    wholesalePrice,
    images,
    category,
    stock,
    isWholesale = false,
}: ProductCardProps) {
    const imageList = parseImages(images)
    const mainImage = imageList[0] || '/placeholder-product.jpg'
    const displayPrice = isWholesale && wholesalePrice ? wholesalePrice : price
    const isLowStock = stock <= 5 && stock > 0
    const isOutOfStock = stock === 0

    // Calculate discount percentage for wholesale
    const discountPercent = wholesalePrice && price > wholesalePrice
        ? Math.round(((price - wholesalePrice) / price) * 100)
        : 0

    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        addItem({
            id,
            name,
            price: displayPrice,
            quantity: 1,
            image: mainImage,
            maxStock: stock
        })

        toast.success(`${name} agregado al carrito`, {
            description: 'Puedes ver tus productos en el carrito de compras.',
            duration: 2000,
        })
    }

    return (
        <div className={styles.card}>
            <Link href={`/productos/${id}`} className={styles.imageContainer}>
                <img
                    src={mainImage}
                    alt={name}
                    className={styles.image}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Producto'
                    }}
                />
                {isWholesale && wholesalePrice && (
                    <span className={styles.wholesaleBadge}>Mayorista</span>
                )}
                {isLowStock && (
                    <span className={styles.lowStockBadge}>¡Últimas unidades!</span>
                )}
                {isOutOfStock && (
                    <div className={styles.outOfStock}>
                        <span>Agotado</span>
                    </div>
                )}
                <div className={styles.overlay}>
                    <button className={styles.quickView}>
                        <Eye size={20} />
                        <span>Vista rápida</span>
                    </button>
                </div>
            </Link>

            <div className={styles.content}>
                <span className={styles.category}>{category}</span>
                <Link href={`/productos/${id}`}>
                    <h3 className={styles.name}>{name}</h3>
                </Link>

                <div className={styles.priceContainer}>
                    <span className={styles.price}>{formatPrice(displayPrice)}</span>
                    {isWholesale && wholesalePrice && price !== wholesalePrice && (
                        <>
                            <span className={styles.originalPrice}>{formatPrice(price)}</span>
                            {discountPercent > 0 && (
                                <span className={styles.discountBadge}>-{discountPercent}%</span>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.stockInfo}>
                    {stock > 10 ? (
                        <span className={styles.inStock}>En stock</span>
                    ) : stock > 0 ? (
                        <span className={styles.limitedStock}>Solo {stock} disponibles</span>
                    ) : (
                        <span className={styles.noStock}>Sin stock</span>
                    )}
                </div>

                <button
                    className={styles.addToCart}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    <ShoppingCart size={18} />
                    <span>Agregar al carrito</span>
                </button>
            </div>
        </div>
    )
}
