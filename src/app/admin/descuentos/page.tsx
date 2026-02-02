'use client'

import { useState, useEffect } from 'react'
import { Plus, Percent, Tag, Calendar, Package, FolderTree, Trash2, Edit2, Power, Search } from 'lucide-react'
import styles from './page.module.css'
import { toast } from 'sonner'

interface Discount {
    id: string
    name: string
    description: string | null
    type: string
    value: number
    productId: string | null
    categoryId: string | null
    startDate: string
    endDate: string
    isActive: boolean
    usageCount: number
    product: { id: string; name: string; sku: string } | null
    category: { id: string; name: string } | null
    createdAt: string
}

interface Product {
    id: string
    name: string
    sku: string
}

interface Category {
    id: string
    name: string
}

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'active' | 'expired'>('all')

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'PERCENTAGE',
        value: '',
        applyTo: 'product' as 'product' | 'category',
        productId: '',
        categoryId: '',
        startDate: '',
        endDate: ''
    })
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchDiscounts()
        fetchProducts()
        fetchCategories()
    }, [])

    const fetchDiscounts = async () => {
        try {
            const res = await fetch('/api/admin/discounts')
            const data = await res.json()
            if (res.ok) {
                setDiscounts(data)
            }
        } catch (error) {
            toast.error('Error al cargar descuentos')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products')
            const data = await res.json()
            if (res.ok) {
                setProducts(data.products || data)
            }
        } catch (error) {
            console.error('Error fetching products')
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories')
            const data = await res.json()
            if (res.ok) {
                setCategories(data)
            }
        } catch (error) {
            console.error('Error fetching categories')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                name: formData.name,
                description: formData.description || null,
                type: formData.type,
                value: formData.value,
                productId: formData.applyTo === 'product' ? formData.productId : null,
                categoryId: formData.applyTo === 'category' ? formData.categoryId : null,
                startDate: formData.startDate,
                endDate: formData.endDate
            }

            const url = editingId
                ? `/api/admin/discounts/${editingId}`
                : '/api/admin/discounts'

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success(editingId ? 'Descuento actualizado' : 'Descuento creado')
                fetchDiscounts()
                resetForm()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Error al guardar')
            }
        } catch (error) {
            toast.error('Error de conexión')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (discount: Discount) => {
        setFormData({
            name: discount.name,
            description: discount.description || '',
            type: discount.type,
            value: discount.value.toString(),
            applyTo: discount.productId ? 'product' : 'category',
            productId: discount.productId || '',
            categoryId: discount.categoryId || '',
            startDate: discount.startDate.split('T')[0],
            endDate: discount.endDate.split('T')[0]
        })
        setEditingId(discount.id)
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este descuento?')) return

        try {
            const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Descuento eliminado')
                fetchDiscounts()
            }
        } catch (error) {
            toast.error('Error al eliminar')
        }
    }

    const handleToggleActive = async (discount: Discount) => {
        try {
            const res = await fetch(`/api/admin/discounts/${discount.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !discount.isActive })
            })
            if (res.ok) {
                toast.success(discount.isActive ? 'Descuento desactivado' : 'Descuento activado')
                fetchDiscounts()
            }
        } catch (error) {
            toast.error('Error al cambiar estado')
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: 'PERCENTAGE',
            value: '',
            applyTo: 'product',
            productId: '',
            categoryId: '',
            startDate: '',
            endDate: ''
        })
        setEditingId(null)
        setShowModal(false)
    }

    const isExpired = (endDate: string) => new Date(endDate) < new Date()
    const isUpcoming = (startDate: string) => new Date(startDate) > new Date()

    const filteredDiscounts = discounts.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.category?.name.toLowerCase().includes(searchTerm.toLowerCase())

        if (filterType === 'active') return matchesSearch && d.isActive && !isExpired(d.endDate)
        if (filterType === 'expired') return matchesSearch && isExpired(d.endDate)
        return matchesSearch
    })

    const stats = {
        total: discounts.length,
        active: discounts.filter(d => d.isActive && !isExpired(d.endDate)).length,
        expired: discounts.filter(d => isExpired(d.endDate)).length
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Descuentos</h1>
                    <p>Gestiona promociones y ofertas para productos y categorías</p>
                </div>
                <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Nuevo Descuento
                </button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <Tag size={20} />
                    <div>
                        <span className={styles.statValue}>{stats.total}</span>
                        <span className={styles.statLabel}>Total</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Percent size={20} />
                    <div>
                        <span className={styles.statValue}>{stats.active}</span>
                        <span className={styles.statLabel}>Activos</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Calendar size={20} />
                    <div>
                        <span className={styles.statValue}>{stats.expired}</span>
                        <span className={styles.statLabel}>Expirados</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar descuentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.filterTab} ${filterType === 'all' ? styles.active : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`${styles.filterTab} ${filterType === 'active' ? styles.active : ''}`}
                        onClick={() => setFilterType('active')}
                    >
                        Activos
                    </button>
                    <button
                        className={`${styles.filterTab} ${filterType === 'expired' ? styles.active : ''}`}
                        onClick={() => setFilterType('expired')}
                    >
                        Expirados
                    </button>
                </div>
            </div>

            {/* Discounts List */}
            <div className={styles.grid}>
                {isLoading ? (
                    <div className={styles.loading}>Cargando...</div>
                ) : filteredDiscounts.length === 0 ? (
                    <div className={styles.empty}>
                        <Tag size={48} />
                        <h3>No hay descuentos</h3>
                        <p>Crea tu primer descuento para comenzar</p>
                    </div>
                ) : (
                    filteredDiscounts.map((discount) => (
                        <div
                            key={discount.id}
                            className={`${styles.discountCard} ${!discount.isActive ? styles.inactive : ''} ${isExpired(discount.endDate) ? styles.expired : ''}`}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.discountBadge}>
                                    {discount.type === 'PERCENTAGE' ? (
                                        <><Percent size={14} /> {discount.value}%</>
                                    ) : (
                                        <>$ {discount.value}</>
                                    )}
                                </div>
                                <div className={styles.cardActions}>
                                    <button onClick={() => handleToggleActive(discount)} title={discount.isActive ? 'Desactivar' : 'Activar'}>
                                        <Power size={16} />
                                    </button>
                                    <button onClick={() => handleEdit(discount)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(discount.id)} className={styles.deleteBtn}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className={styles.discountName}>{discount.name}</h3>
                            {discount.description && (
                                <p className={styles.discountDesc}>{discount.description}</p>
                            )}

                            <div className={styles.applyTo}>
                                {discount.product ? (
                                    <><Package size={14} /> {discount.product.name}</>
                                ) : discount.category ? (
                                    <><FolderTree size={14} /> {discount.category.name}</>
                                ) : null}
                            </div>

                            <div className={styles.dates}>
                                <Calendar size={14} />
                                {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                            </div>

                            {isExpired(discount.endDate) && (
                                <span className={styles.expiredBadge}>Expirado</span>
                            )}
                            {isUpcoming(discount.startDate) && (
                                <span className={styles.upcomingBadge}>Próximamente</span>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={resetForm}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>{editingId ? 'Editar Descuento' : 'Nuevo Descuento'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Nombre del descuento *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Black Friday, Vuelta a Clases"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descripción</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descripción opcional"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Tipo *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">Porcentaje (%)</option>
                                        <option value="FIXED_AMOUNT">Monto Fijo ($)</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Valor *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        placeholder={formData.type === 'PERCENTAGE' ? '15' : '5.00'}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Aplicar a *</label>
                                <div className={styles.radioGroup}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="applyTo"
                                            checked={formData.applyTo === 'product'}
                                            onChange={() => setFormData({ ...formData, applyTo: 'product', categoryId: '' })}
                                        />
                                        Producto específico
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="applyTo"
                                            checked={formData.applyTo === 'category'}
                                            onChange={() => setFormData({ ...formData, applyTo: 'category', productId: '' })}
                                        />
                                        Categoría completa
                                    </label>
                                </div>
                            </div>

                            {formData.applyTo === 'product' ? (
                                <div className={styles.formGroup}>
                                    <label>Producto *</label>
                                    <select
                                        value={formData.productId}
                                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar producto...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className={styles.formGroup}>
                                    <label>Categoría *</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar categoría...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Fecha inicio *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Fecha fin *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear Descuento')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
