'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { Plus, Search, Edit, Trash2, Package, Upload, AlertCircle, CheckCircle, BarChart3, Boxes } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)
    const [inventoryStats, setInventoryStats] = useState({
        total: 0,
        lowStock: 0,
        outOfStock: 0
    })

    useEffect(() => {
        fetchProducts()
    }, [search, page])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/products?q=${search}&page=${page}&limit=12`)
            const data = await res.json()
            if (data.products) {
                setProducts(data.products)
                setPagination(data.pagination)

                // We'll calculate stats from the response or have another endpoint,
                // but for now let's use the local filtered results if available
                // Ideally this should come from the API for the whole database
                if (data.pagination) {
                    // Update stats (mocked logic or real if data provides it)
                    // Let's assume the API doesn't provide these yet, so we use current view
                    setInventoryStats({
                        total: data.pagination.total || 0,
                        lowStock: data.products.filter((p: any) => p.stock > 0 && p.stock < 10).length,
                        outOfStock: data.products.filter((p: any) => p.stock === 0).length
                    })
                }
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleDelete = (id: string, name: string) => {
        toast(`¿Eliminar "${name}"?`, {
            description: 'Esta acción no se puede deshacer.',
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
                        if (res.ok) {
                            toast.success('Producto eliminado')
                            fetchProducts()
                        } else {
                            toast.error('No se pudo eliminar el producto')
                        }
                    } catch (err) {
                        toast.error('Error de conexión')
                    }
                }
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => { }
            }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Catálogo de Productos</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0 0' }}>Administra tu inventario, precios y categorías</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/admin/productos/importar" className={styles.importButton}>
                        <Upload size={18} /> Importar Excel/CSV
                    </Link>
                    <Link href="/admin/productos/nuevo" className={styles.addButton}>
                        <Plus size={20} /> Nuevo Producto
                    </Link>
                </div>
            </div>

            {/* Resumen de Inventario */}
            <div className={styles.inventorySummary}>
                <div className={styles.summaryItem}>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Productos</span>
                        <span className={styles.summaryValue}>{inventoryStats.total}</span>
                    </div>
                    <Boxes size={24} style={{ opacity: 0.3, color: 'var(--secondary)' }} />
                </div>
                <div className={styles.summaryItem}>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Stock Bajo (Menos de 10)</span>
                        <span className={styles.summaryValue} style={{ color: '#f59e0b' }}>
                            {inventoryStats.lowStock}
                        </span>
                    </div>
                    <AlertCircle size={24} style={{ opacity: 0.3, color: '#f59e0b' }} />
                </div>
                <div className={styles.summaryItem}>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Sin Stock (Agotados)</span>
                        <span className={styles.summaryValue} style={{ color: '#ef4444' }}>
                            {inventoryStats.outOfStock}
                        </span>
                    </div>
                    <XCircle size={24} style={{ opacity: 0.3, color: '#ef4444' }} />
                </div>
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.searchBox}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre de producto, SKU o categoría..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Información del Producto</th>
                            <th>SKU</th>
                            <th>Categoría</th>
                            <th>Precio Unitario</th>
                            <th>Existencias</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className={styles.loading}>Procesando catálogo...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} className={styles.empty}>No se encontraron resultados para "{search}"</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className={styles.productCell}>
                                        <div className={styles.productIcon}>
                                            <Package size={18} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                            <span style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>{product.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>ID: {product.id.substring(0, 8)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles.sku}>{product.sku}</span></td>
                                <td>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                        {product.category?.name || 'Sin Categoría'}
                                    </span>
                                </td>
                                <td className={styles.price}>{formatPrice(product.price)}</td>
                                <td>
                                    <span className={product.stock < 10 ? styles.lowStock : styles.okStock}>
                                        {product.stock} unidades
                                    </span>
                                </td>
                                <td>
                                    <span className={product.isActive ? styles.badgeActive : styles.badgeInactive}>
                                        {product.isActive ? 'Activo' : 'Pausado'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                                        <Link href={`/admin/productos/${product.id}`} className={styles.actionBtn} title="Editar">
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(product.id, product.name)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className={styles.pageBtn}
                    >
                        Anterior
                    </button>
                    <div className={styles.pageInfo}>
                        Página <span>{page}</span> de <span>{pagination.totalPages}</span>
                    </div>
                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className={styles.pageBtn}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}

function XCircle({ size, style }: { size: number, style?: any }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    )
}
