'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from '../nuevo/page.module.css'
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Category {
    id: string
    name: string
}

export default function EditProductPage() {
    const router = useRouter()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [images, setImages] = useState<string[]>([])
    const [imageUrl, setImageUrl] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        wholesalePrice: '',
        stock: '',
        minStock: '5',
        categoryId: '',
        description: '',
        isActive: true
    })

    // Cargar datos del producto y categorías
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar categorías
                const catRes = await fetch('/api/admin/categories?limit=100')
                const catData = await catRes.json()
                if (catData.categories) {
                    setCategories(catData.categories)
                } else if (Array.isArray(catData)) {
                    setCategories(catData)
                }

                // Cargar producto
                const prodRes = await fetch(`/api/admin/products/${id}`)
                if (!prodRes.ok) throw new Error('Producto no encontrado')
                const product = await prodRes.json()

                setFormData({
                    name: product.name || '',
                    sku: product.sku || '',
                    price: product.price?.toString() || '',
                    wholesalePrice: product.wholesalePrice?.toString() || '',
                    stock: product.stock?.toString() || '0',
                    minStock: product.minStock?.toString() || '5',
                    categoryId: product.categoryId || '',
                    description: product.description || '',
                    isActive: product.isActive ?? true
                })

                // Cargar imágenes
                if (product.images) {
                    try {
                        const parsedImages = JSON.parse(product.images)
                        setImages(Array.isArray(parsedImages) ? parsedImages : [])
                    } catch {
                        setImages([])
                    }
                }
            } catch (err) {
                toast.error('Error al cargar el producto')
                router.push('/admin/productos')
            } finally {
                setLoadingData(false)
            }
        }
        fetchData()
    }, [id, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddImage = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            setImages(prev => [...prev, imageUrl])
            setImageUrl('')
            toast.success('Imagen añadida')
        }
    }

    const handleRemoveImage = (url: string) => {
        setImages(prev => prev.filter(img => img !== url))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('El nombre del producto es requerido')
            return
        }
        if (!formData.categoryId) {
            toast.error('Debe seleccionar una categoría')
            return
        }

        setLoading(true)

        try {
            const payload = {
                name: formData.name,
                sku: formData.sku,
                description: formData.description,
                price: parseFloat(formData.price),
                wholesalePrice: formData.wholesalePrice ? parseFloat(formData.wholesalePrice) : null,
                stock: parseInt(formData.stock) || 0,
                minStock: parseInt(formData.minStock) || 5,
                categoryId: formData.categoryId,
                isActive: formData.isActive,
                images: images.length > 0 ? images : undefined
            }

            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al actualizar producto')
            }

            toast.success('Producto actualizado exitosamente')
            router.push('/admin/productos')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            return
        }

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                throw new Error('Error al eliminar')
            }

            toast.success('Producto eliminado')
            router.push('/admin/productos')
            router.refresh()
        } catch (error) {
            toast.error('Error al eliminar el producto')
        }
    }

    if (loadingData) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className={styles.spin} size={24} />
                    Cargando producto...
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/productos" className={styles.backLink}>
                    <ArrowLeft size={18} /> Volver al inventario
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className={styles.title}>Editar Producto</h1>
                        <p className={styles.subtitle}>Modifica los datos del producto.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}
                    >
                        <Trash2 size={18} />
                        Eliminar
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                    {/* Información Básica */}
                    <div className={styles.section}>
                        <h2>Información General</h2>

                        <div className={styles.field}>
                            <label>Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Cuaderno Universitario"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Descripción</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detalles del producto..."
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    required
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="Ej: PAP-001"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Categoría</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Precios e Inventario */}
                    <div className={styles.section}>
                        <h2>Precios e Inventario</h2>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Precio Unitario ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Precio Mayorista ($)</label>
                                <input
                                    type="number"
                                    name="wholesalePrice"
                                    step="0.01"
                                    value={formData.wholesalePrice}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Stock Actual</label>
                                <input
                                    type="number"
                                    name="stock"
                                    required
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Estado</label>
                                <select
                                    name="isActive"
                                    value={formData.isActive ? 'true' : 'false'}
                                    onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.value === 'true' }))}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? <><Loader2 className={styles.spin} size={20} /> Guardando...</> : <><Save size={20} /> Guardar Cambios</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
