import prisma from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import SortSelect from './SortSelect'
import Link from 'next/link'
import { Filter, Search } from 'lucide-react'
import styles from './page.module.css'
import { getCurrentUser } from '@/lib/auth'

async function getProducts(searchParams: Promise<{
    buscar?: string
    categoria?: string
    orden?: string
    pagina?: string
}>) {
    const params = await searchParams
    const page = parseInt(params.pagina || '1')
    const perPage = 12
    const skip = (page - 1) * perPage

    const where: Record<string, unknown> = { isActive: true }

    if (params.buscar) {
        where.OR = [
            { name: { contains: params.buscar } },
            { description: { contains: params.buscar } },
        ]
    }

    if (params.categoria) {
        where.categoryId = params.categoria
    }

    const orderBy: Record<string, string> = {}
    switch (params.orden) {
        case 'precio-asc':
            orderBy.price = 'asc'
            break
        case 'precio-desc':
            orderBy.price = 'desc'
            break
        case 'nombre':
            orderBy.name = 'asc'
            break
        default:
            orderBy.createdAt = 'desc'
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy,
            skip,
            take: perPage,
        }),
        prisma.product.count({ where }),
    ])

    return { products, total, page, perPage, totalPages: Math.ceil(total / perPage) }
}

async function getCategories() {
    return prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: { _count: { select: { products: true } } },
    })
}

export default async function ProductosPage({
    searchParams,
}: {
    searchParams: Promise<{ buscar?: string; categoria?: string; orden?: string; pagina?: string }>
}) {
    const [{ products, total, page, totalPages }, categories] = await Promise.all([
        getProducts(searchParams),
        getCategories(),
    ])

    const params = await searchParams
    const user = await getCurrentUser()
    const isWholesale = user?.role === 'WHOLESALE'

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div>
                            {isWholesale && (
                                <div className={styles.wholesaleIntro}>
                                    <span className={styles.wholesaleBadge}>Vista Mayorista Activa</span>
                                    <p>Estás viendo nuestros precios especiales para distribuidores.</p>
                                </div>
                            )}
                            <h1 className={styles.title}>Catálogo de Productos</h1>
                            <p className={styles.subtitle}>
                                {params.buscar
                                    ? `Resultados para "${params.buscar}"`
                                    : `${total} productos disponibles`
                                }
                            </p>
                        </div>
                    </div>

                    <div className={styles.content}>
                        {/* Sidebar de filtros */}
                        <aside className={styles.sidebar}>
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>
                                    <Filter size={18} />
                                    Categorías
                                </h3>
                                <ul className={styles.categoryList}>
                                    <li>
                                        <Link
                                            href="/productos"
                                            className={`${styles.categoryLink} ${!params.categoria ? styles.categoryActive : ''}`}
                                        >
                                            Todas las categorías
                                            <span className={styles.categoryCount}>{total}</span>
                                        </Link>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/productos?categoria=${category.id}`}
                                                className={`${styles.categoryLink} ${params.categoria === category.id ? styles.categoryActive : ''}`}
                                            >
                                                {category.name}
                                                <span className={styles.categoryCount}>{category._count.products}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Productos */}
                        <div className={styles.productsSection}>
                            {/* Toolbar */}
                            <div className={styles.toolbar}>
                                <span className={styles.resultsCount}>
                                    Mostrando {products.length} de {total} productos
                                </span>
                                <SortSelect currentSort={params.orden || 'recientes'} />
                            </div>

                            {/* Grid de productos */}
                            {products.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Search size={48} />
                                    <h2>No se encontraron productos</h2>
                                    <p>Intenta con otros términos de búsqueda o categoría</p>
                                    <Link href="/productos" className={styles.resetButton}>
                                        Ver todos los productos
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.productGrid}>
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                id={product.id}
                                                name={product.name}
                                                price={product.price}
                                                wholesalePrice={product.wholesalePrice}
                                                images={product.images}
                                                category={product.category.name}
                                                stock={product.stock}
                                                isWholesale={isWholesale}
                                            />
                                        ))}
                                    </div>

                                    {/* Paginación */}
                                    {totalPages > 1 && (
                                        <div className={styles.pagination}>
                                            {page > 1 && (
                                                <Link
                                                    href={`/productos?${new URLSearchParams({ ...params, pagina: String(page - 1) })}`}
                                                    className={styles.pageLink}
                                                >
                                                    Anterior
                                                </Link>
                                            )}

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                <Link
                                                    key={p}
                                                    href={`/productos?${new URLSearchParams({ ...params, pagina: String(p) })}`}
                                                    className={`${styles.pageLink} ${p === page ? styles.pageLinkActive : ''}`}
                                                >
                                                    {p}
                                                </Link>
                                            ))}

                                            {page < totalPages && (
                                                <Link
                                                    href={`/productos?${new URLSearchParams({ ...params, pagina: String(page + 1) })}`}
                                                    className={styles.pageLink}
                                                >
                                                    Siguiente
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
