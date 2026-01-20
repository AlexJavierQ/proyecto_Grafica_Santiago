'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { ArrowLeft, Save, Upload, Loader2, ImagePlus, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Category {
    id: string
    name: string
}

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [imageUrl, setImageUrl] = useState('')
    const [images, setImages] = useState<string[]>([])

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

    // Cargar categorías desde la API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories?limit=100')
                const data = await res.json()
                if (data.categories) {
                    setCategories(data.categories)
                } else if (Array.isArray(data)) {
                    setCategories(data)
                }
            } catch (err) {
                toast.error('Error al cargar categorías')
            } finally {
                setLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [])

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

        // Validaciones
        if (!formData.name.trim()) {
            toast.error('El nombre del producto es requerido')
            return
        }
        if (!formData.sku.trim()) {
            toast.error('El SKU es requerido')
            return
        }
        if (!formData.categoryId) {
            toast.error('Debe seleccionar una categoría')
            return
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error('El precio debe ser mayor a 0')
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
                images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80']
            }

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al crear producto')
            }

            toast.success('Producto creado exitosamente')
            router.push('/admin/productos')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/productos" className={styles.backLink}>
                    <ArrowLeft size={18} /> Volver al inventario
                </Link>
                <h1 className={styles.title}>Crear Nuevo Producto</h1>
                <p className={styles.subtitle}>Completa los datos para añadir un nuevo artículo al catálogo.</p>
            </div>

            {/* Stepper Visual (Dummy para guía) */}
            <div className={styles.stepper}>
                <div className={`${styles.step} ${styles.stepActive}`}>
                    <div className={styles.stepNumber}>1</div>
                    <span className={styles.stepLabel}>Información</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <span className={styles.stepLabel}>Precios</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <span className={styles.stepLabel}>Multimedia</span>
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
                            <span className={styles.fieldHelp}>Un nombre claro ayuda a los clientes a encontrar el producto.</span>
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
                                    disabled={loadingCategories}
                                >
                                    <option value="">{loadingCategories ? 'Cargando...' : 'Seleccionar...'}</option>
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
                                <label>Stock Inicial</label>
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
                        {loading ? <><Loader2 className={styles.spin} size={20} /> Guardando...</> : <><Save size={20} /> Guardar Producto</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
