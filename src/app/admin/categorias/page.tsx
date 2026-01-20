'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Boxes, Link2, Check, CheckCircle, Package, Layers, Power, Search } from 'lucide-react'
import styles from './page.module.css'
import { toast } from 'sonner'

interface Category {
    id: string
    name: string
    description: string | null
    image: string | null
    order: number
    isActive: boolean
    _count?: { products: number }
}

interface Product {
    id: string
    name: string
    sku: string
    categoryId: string | null
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [linkingCategory, setLinkingCategory] = useState<Category | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)

    // Products for linking
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [productSearch, setProductSearch] = useState('')
    const [loadingProducts, setLoadingProducts] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: '0',
        isActive: true
    })

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/categories?page=${page}&limit=12&includeCount=true`)
            const data = await res.json()
            if (data.categories) {
                setCategories(data.categories)
                setPagination(data.pagination)
            }
        } catch (err) {
            toast.error('Error al cargar categorías')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [page])

    const handleOpenModal = (category: Category | null = null) => {
        setError('')
        if (category) {
            setEditingCategory(category)
            setFormData({
                name: category.name,
                description: category.description || '',
                order: category.order.toString(),
                isActive: category.isActive
            })
        } else {
            setEditingCategory(null)
            setFormData({
                name: '',
                description: '',
                order: '0',
                isActive: true
            })
        }
        setIsModalOpen(true)
    }

    const handleOpenLinkModal = async (category: Category) => {
        setLinkingCategory(category)
        setSelectedProducts([])
        setProductSearch('')
        setLoadingProducts(true)
        setIsLinkModalOpen(true)

        try {
            const res = await fetch('/api/admin/products?limit=500')
            const data = await res.json()
            if (data.products) {
                setProducts(data.products)
                const alreadyLinked = data.products
                    .filter((p: Product) => p.categoryId === category.id)
                    .map((p: Product) => p.id)
                setSelectedProducts(alreadyLinked)
            }
        } catch {
            toast.error('Error al cargar productos')
        } finally {
            setLoadingProducts(false)
        }
    }

    const handleLinkProducts = async () => {
        if (!linkingCategory) return
        setIsSubmitting(true)

        try {
            const res = await fetch(`/api/admin/categories/${linkingCategory.id}/link-products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: selectedProducts })
            })

            if (res.ok) {
                const data = await res.json()
                toast.success(`${data.updated} productos vinculados correctamente`)
                setIsLinkModalOpen(false)
                fetchCategories()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Error al vincular productos')
            }
        } catch {
            toast.error('Error de conexión')
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleProductSelection = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const selectFiltered = () => {
        const filtered = filteredProducts.map(p => p.id)
        setSelectedProducts(prev => [...new Set([...prev, ...filtered])])
    }

    const deselectFiltered = () => {
        const filtered = filteredProducts.map(p => p.id)
        setSelectedProducts(prev => prev.filter(id => !filtered.includes(id)))
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        const url = editingCategory
            ? `/api/admin/categories/${editingCategory.id}`
            : '/api/admin/categories'
        const method = editingCategory ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(editingCategory ? 'Categoría actualizada' : 'Categoría creada con éxito')
                setIsModalOpen(false)
                fetchCategories()
            } else {
                setError(data.error || 'Ocurrió un error inesperado')
                toast.error(data.error || 'Error al guardar')
            }
        } catch (err) {
            setError('Error de conexión con el servidor')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (category: Category) => {
        toast(`¿Eliminar la categoría "${category.name}"?`, {
            description: 'Esta acción no se puede deshacer y los productos quedarán sin categoría.',
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        const res = await fetch(`/api/admin/categories/${category.id}`, {
                            method: 'DELETE'
                        })
                        if (res.ok) {
                            toast.success('Categoría eliminada')
                            fetchCategories()
                        } else {
                            toast.error('No se pudo eliminar la categoría')
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
            {/* Resumen de Categorías */}
            <div className={styles.statsSummary}>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Estructura</span>
                        <span className={styles.statValue}>{categories.length} Categorías</span>
                    </div>
                    <Layers size={20} style={{ opacity: 0.3, color: 'var(--secondary)' }} />
                </div>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Disponibilidad</span>
                        <span className={styles.statValue} style={{ color: '#22c55e' }}>
                            {categories.filter(c => c.isActive).length} Activas
                        </span>
                    </div>
                    <Power size={20} style={{ opacity: 0.3, color: '#22c55e' }} />
                </div>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Productos</span>
                        <span className={styles.statValue}>
                            {categories.reduce((acc, curr) => acc + (curr._count?.products || 0), 0)} Ítems
                        </span>
                    </div>
                    <Package size={20} style={{ opacity: 0.3, color: 'var(--secondary)' }} />
                </div>
            </div>

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Taxonomía de Productos</h1>
                    <p className={styles.subtitle}>Gestiona la jerarquía y organización de tu catálogo comercial</p>
                </div>
                <button className={styles.addButton} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>Crear Nueva Categoría</span>
                </button>
            </div>

            <div className={styles.tableContainer}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <Package className={styles.spin} style={{ marginBottom: '1rem' }} />
                        <p>Cargando estructura de categorías...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className={styles.empty}>
                        <Boxes size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <h3>Sin categorías</h3>
                        <p>Aún no has definido ninguna categoría para tus productos.</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre de Categoría</th>
                                <th>Descripción Breve</th>
                                <th style={{ textAlign: 'center' }}>Productos</th>
                                <th style={{ textAlign: 'center' }}>Prioridad</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Gestión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <div className={styles.categoryCell}>
                                            <div className={styles.categoryIcon}>
                                                <Boxes size={18} />
                                            </div>
                                            <span style={{ fontWeight: 600, color: 'white' }}>{category.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.description} title={category.description || ''}>
                                            {category.description || 'Sin descripción'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={styles.productCount}>
                                            {category._count?.products || 0}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>#{category.order}</span>
                                    </td>
                                    <td>
                                        <span className={category.isActive ? styles.badgeActive : styles.badgeInactive}>
                                            {category.isActive ? 'Activa' : 'Pausada'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                                            <button
                                                className={styles.linkBtn}
                                                onClick={() => handleOpenLinkModal(category)}
                                                title="Vincular existencias"
                                            >
                                                <Link2 size={16} />
                                            </button>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleOpenModal(category)}
                                                title="Editar detalles"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(category)}
                                                title="Eliminar permanentemente"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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

            {/* Modal Nueva/Editar Categoría */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {editingCategory ? <Edit2 size={20} /> : <Plus size={20} />}
                                {editingCategory ? 'Modificar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Etiqueta de Categoría</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                    required
                                    placeholder="Ej: Materiales P.O.P"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descripción del Departamento</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Detalles sobre los productos incluidos..."
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Prioridad de Visualización</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData(p => ({ ...p, order: e.target.value }))}
                                        min="0"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Estado Inicial</label>
                                    <select
                                        value={formData.isActive ? 'true' : 'false'}
                                        onChange={e => setFormData(p => ({ ...p, isActive: e.target.value === 'true' }))}
                                    >
                                        <option value="true">Activa y Publicada</option>
                                        <option value="false">Oculta (Borrador)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                                    {isSubmitting ? 'Procesando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Vincular De Manera Masiva */}
            {isLinkModalOpen && linkingCategory && (
                <div className={styles.modalOverlay} onClick={() => setIsLinkModalOpen(false)}>
                    <div className={`${styles.modal} ${styles.linkModal}`} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                <Link2 size={20} />
                                Asignar Productos a "{linkingCategory.name}"
                            </h2>
                            <button onClick={() => setIsLinkModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.linkContent}>
                            <div className={styles.linkSearch}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                                    <input
                                        style={{ paddingLeft: '3rem', width: '100%' }}
                                        type="text"
                                        placeholder="Buscar por nombre técnico o SKU..."
                                        value={productSearch}
                                        onChange={e => setProductSearch(e.target.value)}
                                    />
                                    {productSearch && (
                                        <button
                                            onClick={() => setProductSearch('')}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                <div className={styles.linkActions}>
                                    <button type="button" onClick={selectFiltered} className={styles.selectAllBtn}>
                                        Marcar Resultados
                                    </button>
                                    <button type="button" onClick={deselectFiltered} className={styles.deselectAllBtn}>
                                        Desmarcar Resultados
                                    </button>
                                    <div className={styles.selectedCount}>
                                        <CheckCircle size={14} />
                                        <span>{selectedProducts.length} Ítems seleccionados</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.productsList}>
                                {loadingProducts ? (
                                    <div className={styles.loading}>Sincronizando productos...</div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className={styles.empty}>No hay coincidencias en el inventario</div>
                                ) : (
                                    filteredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            className={`${styles.productItem} ${selectedProducts.includes(product.id) ? styles.selected : ''}`}
                                            onClick={() => toggleProductSelection(product.id)}
                                        >
                                            <div className={styles.productCheck}>
                                                {selectedProducts.includes(product.id) && <Check size={14} />}
                                            </div>
                                            <div className={styles.productInfo}>
                                                <span className={styles.productName}>{product.name}</span>
                                                <span className={styles.productSku}>{product.sku}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setIsLinkModalOpen(false)} className={styles.cancelBtn}>
                                Cerrar Ventana
                            </button>
                            <button
                                onClick={handleLinkProducts}
                                disabled={isSubmitting}
                                className={styles.submitBtn}
                            >
                                {isSubmitting ? 'Guardando...' : `Confirmar Vinculación`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
