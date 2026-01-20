'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Shield, User, Mail, Phone, Building2, UserCircle, Key } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import styles from './details.module.css'

interface UserData {
    id: string
    name: string
    email: string
    phone: string | null
    role: string
    status: string
    companyName: string | null
    ruc: string | null
}

export default function EditUserPage() {
    const router = useRouter()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'USER',
        status: 'ACTIVE',
        companyName: '',
        ruc: ''
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`)
                if (!res.ok) throw new Error('Usuario no encontrado')
                const data = await res.json()
                const user: UserData = data.user || data

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    role: user.role || 'USER',
                    status: user.status || 'ACTIVE',
                    companyName: user.companyName || '',
                    ruc: user.ruc || ''
                })
            } catch (err) {
                toast.error('Error al cargar perfil del usuario')
                router.push('/admin/usuarios')
            } finally {
                setLoadingData(false)
            }
        }
        fetchUser()
    }, [id, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('El nombre es un campo obligatorio')
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone || null,
                    role: formData.role,
                    status: formData.status,
                    companyName: formData.companyName || null,
                    ruc: formData.ruc || null
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Fallo al actualizar el registro')
            }

            toast.success('Perfil de usuario actualizado con éxito')
            router.push('/admin/usuarios')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className={styles.page}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', justifyContent: 'center', padding: '10rem 0' }}>
                    <Loader2 className={styles.spin} size={40} style={{ color: 'var(--secondary)' }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Sincronizando datos del usuario...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <Link href="/admin/usuarios" className={styles.backLink}>
                        <ArrowLeft size={16} /> Volver al Directorio
                    </Link>
                    <h1 className={styles.title}>Perfil de Usuario</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <Mail size={14} style={{ opacity: 0.5 }} />
                        <p className={styles.subtitle}>{formData.email}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.formGrid}>
                    {/* Sección: Información de Identidad */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>
                            <UserCircle size={20} />
                            Identidad del Usuario
                        </h3>

                        <div className={styles.formGroup}>
                            <label>Nombre Titular</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nombre completo del usuario"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Mail size={14} /> Canal de Comunicación
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Phone size={14} /> Contacto Móvil
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Ej: +593 99 999 9999"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Sección: Privilegios y Empresa */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>
                            <Key size={20} />
                            Privilegios y Entidad
                        </h3>

                        <div className={styles.formGroup}>
                            <label>Nivel de Acceso (Rol)</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="CUSTOMER">Consumidor Final</option>
                                <option value="WHOLESALE">Socio Mayorista</option>
                                <option value="WAREHOUSE">Gestor de Bodega</option>
                                <option value="ADMIN">Administrador de Sistema</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Estado de Operación</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="ACTIVE">Cuenta Activa</option>
                                <option value="INACTIVE">Cuenta Inactiva</option>
                                <option value="PENDING">Pendiente de Revisión</option>
                                <option value="SUSPENDED">Acceso Suspendido</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Building2 size={14} /> Razón Social / Empresa
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Nombre comercial o jurídico"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>RUC / Identificación Fiscal</label>
                            <input
                                type="text"
                                name="ruc"
                                value={formData.ruc}
                                onChange={handleChange}
                                placeholder="Registro Único de Contribuyentes"
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={styles.cancelBtn}
                    >
                        Descartar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? <Loader2 size={18} className={styles.spin} /> : <Save size={18} />}
                        {loading ? 'Aplicando Cambios...' : 'Actualizar Perfil'}
                    </button>
                </div>
            </form>
        </div>
    )
}
