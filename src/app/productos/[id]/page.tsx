import prisma from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Package, Shield, Truck } from 'lucide-react'
import styles from './page.module.css'
import AddToCart from './AddToCart'
import { getCurrentUser } from '@/lib/auth'

// Función para obtener el producto
async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    })
    return product
}

// Función para obtener productos relacionados
async function getRelatedProducts(categoryId: string, currentProductId: string) {
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            id: { not: currentProductId },
            isActive: true,
        },
        take: 4,
    })
    return products
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

    const user = await getCurrentUser()
    const isWholesale = user?.role === 'WHOLESALE'
    const displayPrice = isWholesale && product.wholesalePrice ? product.wholesalePrice : product.price

    // Calcular si hay stock bajo
    const isLowStock = product.stock > 0 && product.stock < 10

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Breadcrumb / Navegación */}
                    <div className={styles.breadcrumb}>
                        <Link href="/productos" className={styles.backLink}>
                            <ArrowLeft size={16} />
                            Volver al catálogo
                        </Link>
                        <span className={styles.separator}>/</span>
                        <span className={styles.categoryName}>{product.category.name}</span>
                        <span className={styles.separator}>/</span>
                        <span className={styles.productName}>{product.name}</span>
                    </div>

                    <div className={styles.productLayout}>
                        {/* Columna Izquierda: Imagen */}
                        <div className={styles.imageSection}>
                            <div className={styles.mainImageContainer}>
                                {product.images ? (
                                    <img src={JSON.parse(product.images)[0]} alt={product.name} />
                                ) : (
                                    <div className={styles.placeholderImage}>Sin imagen</div>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha: Detalles */}
                        <div className={styles.detailsSection}>
                            {isWholesale && (
                                <div className={styles.wholesaleBadgeDetail}>Precios Mayoristas</div>
                            )}
                            <h1 className={styles.title}>{product.name}</h1>

                            <div className={styles.metaInfo}>
                                <span className={styles.categoryBadge}>{product.category.name}</span>
                                <span className={styles.sku}>SKU: {product.sku}</span>
                            </div>

                            <div className={styles.priceContainer}>
                                <span className={styles.price}>${displayPrice.toFixed(2)}</span>
                                <span className={styles.unit}>/ unidad</span>
                                {isWholesale && product.wholesalePrice && product.price !== product.wholesalePrice && (
                                    <span className={styles.originalPrice}>PVP: ${product.price.toFixed(2)}</span>
                                )}
                            </div>

                            {/* Información de Mayorista (Modificada si ya es mayorista) */}
                            {!isWholesale ? (
                                <div className={styles.wholesaleInfo}>
                                    <span className={styles.wholesalePrice}>
                                        Precio mayorista: <strong>${(product.wholesalePrice || 0).toFixed(2)}</strong>
                                        {product.wholesalePrice && product.price > product.wholesalePrice && (
                                            <span className={styles.discountBadge}>
                                                -{Math.round(((product.price - product.wholesalePrice) / product.price) * 100)}%
                                            </span>
                                        )}
                                    </span>
                                    <span className={styles.wholesaleNote}>
                                        (Aplicable para cuentas mayoristas aprobadas)
                                    </span>
                                    <Link href="/mayoristas" className={styles.wholesaleLink}>
                                        Solicitar cuenta mayorista
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.wholesaleActiveInfo}>
                                    <Check size={16} />
                                    <span>Estás ahorrando ${(product.price - displayPrice).toFixed(2)} por unidad</span>
                                </div>
                            )}

                            <div className={styles.stockStatus}>
                                {product.stock > 0 ? (
                                    <div className={`${styles.stockBadge} ${isLowStock ? styles.lowStock : styles.inStock}`}>
                                        <Check size={16} />
                                        {isLowStock ? `¡Solo quedan ${product.stock} unidades!` : 'En Stock'}
                                    </div>
                                ) : (
                                    <div className={styles.noStock}>Agotado</div>
                                )}
                            </div>

                            <div className={styles.description}>
                                <h3>Descripción</h3>
                                <p>{product.description}</p>
                            </div>

                            {/* Acciones de compra (Componente Cliente) */}
                            <AddToCart
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: displayPrice,
                                    stock: product.stock,
                                    images: product.images
                                }}
                            />

                            {/* Características adicionales */}
                            <div className={styles.features}>
                                <div className={styles.featureItem}>
                                    <Truck size={20} />
                                    <span>Envío a todo el país</span>
                                </div>
                                <div className={styles.featureItem}>
                                    <Shield size={20} />
                                    <span>Garantía de calidad</span>
                                </div>
                                <div className={styles.featureItem}>
                                    <Package size={20} />
                                    <span>Devoluciones fáciles</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos Relacionados */}
                    {relatedProducts.length > 0 && (
                        <div className={styles.relatedSection}>
                            <h2>Productos Relacionados</h2>
                            <div className={styles.relatedGrid}>
                                {relatedProducts.map((related) => (
                                    <ProductCard
                                        key={related.id}
                                        id={related.id}
                                        name={related.name}
                                        price={related.price}
                                        wholesalePrice={related.wholesalePrice}
                                        images={related.images}
                                        category={product.category.name}
                                        stock={related.stock}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
