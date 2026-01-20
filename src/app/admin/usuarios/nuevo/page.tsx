'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UserPlus, Loader2, Shield, User, Mail, Phone, Building2, UserCircle, Key } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import styles from '../[id]/details.module.css'

export default function NewUserPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        companyName: '',
        ruc: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error('Nombre, Email y Contraseña son campos obligatorios')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Fallo al crear el nuevo usuario')
            }

            toast.success(`Usuario "${formData.name}" creado correctamente`)
            router.push('/admin/usuarios')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <Link href="/admin/usuarios" className={styles.backLink}>
                        <ArrowLeft size={16} /> Cancelar y Volver
                    </Link>
                    <h1 className={styles.title}>Alta de Nuevo Usuario</h1>
                    <p className={styles.subtitle}>Registra manualmente una nueva cuenta en el sistema</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.formGrid}>
                    {/* Sección: Identidad y Seguridad */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>
                            <UserCircle size={20} />
                            Credenciales de Acceso
                        </h3>

                        <div className={styles.formGroup}>
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Juan Pérez"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="usuario@dominio.com"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Contraseña Provisional</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Mínimo 8 caracteres"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Phone size={14} /> Teléfono de Contacto
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+56 9 XXXX XXXX"
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Sección: Roles y Empresa */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>
                            <Shield size={20} />
                            Configuración de Perfil
                        </h3>

                        <div className={styles.formGroup}>
                            <label>Nivel de Permisos (Rol)</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="CUSTOMER">Consumidor Final</option>
                                <option value="WHOLESALE">Socio Mayorista</option>
                                <option value="WAREHOUSE">Personal de Bodega</option>
                                <option value="ADMIN">Administrador General</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Estado Inicial</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="ACTIVE">Activo Inmediatamente</option>
                                <option value="PENDING">Requiere Activación</option>
                                <option value="INACTIVE">Desactivado (Borrador)</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <Building2 size={14} /> Empresa Asociada
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Nombre comercial (opcional)"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>RUC / Identificador Tributario</label>
                            <input
                                type="text"
                                name="ruc"
                                value={formData.ruc}
                                onChange={handleChange}
                                placeholder="ID Fiscal de la empresa"
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
                        {loading ? <Loader2 size={18} className={styles.spin} /> : <UserPlus size={18} />}
                        {loading ? 'Procesando registro...' : 'Crear Usuario'}
                    </button>
                </div>
            </form>
        </div>
    )
}
