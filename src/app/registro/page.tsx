'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import styles from './page.module.css'
import { useAuthStore } from '@/lib/authStore'
import { toast } from 'sonner'

export default function RegisterPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isWholesale, setIsWholesale] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        ruc: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Validaciones frontend básicas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            setIsLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            setIsLoading(false)
            return
        }

        if (isWholesale && (!formData.companyName || !formData.ruc)) {
            setError('Razón Social y RUC son requeridos para cuentas mayoristas')
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    isWholesale,
                    companyName: isWholesale ? formData.companyName : undefined,
                    ruc: isWholesale ? formData.ruc : undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al registrarse')
            }

            if (data.requiresApproval) {
                toast.success('Solicitud enviada exitosamente')
                // Mostrar mensaje de éxito especial para mayoristas
                alert('Registro exitoso. Tu solicitud de cuenta mayorista ha sido enviada y está pendiente de aprobación. Te notificaremos cuando esté activa.')
                router.push('/login')
                return
            }

            // Login automático para usuarios normales
            login({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role
            })

            toast.success('¡Registro exitoso! Bienvenido.')
            router.push('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/img/logo.png"
                        alt="Gráfica Santiago"
                        width={180}
                        height={55}
                        priority
                    />
                </Link>

                <h1 className={styles.title}>Crear Cuenta</h1>
                <p className={styles.subtitle}>Únete a nosotros para empezar a comprar</p>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Nombres Completos</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej. Juan Pérez"
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Ej. 099 123 4567"
                            className={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 8 caracteres"
                                className={styles.input}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Opción Mayorista */}
                    <div className={styles.wholesaleOption}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={isWholesale}
                                onChange={(e) => setIsWholesale(e.target.checked)}
                                disabled={isLoading}
                            />
                            Solicitar cuenta mayorista
                        </label>

                        {isWholesale && (
                            <div className={styles.wholesaleFields}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="companyName" className={styles.label}>Razón Social</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Nombre de tu empresa"
                                        className={styles.input}
                                        required={isWholesale}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="ruc" className={styles.label}>RUC / RISA</label>
                                    <input
                                        type="text"
                                        id="ruc"
                                        name="ruc"
                                        value={formData.ruc}
                                        onChange={handleChange}
                                        placeholder="1234567890001"
                                        className={styles.input}
                                        required={isWholesale}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className={styles.spinner} size={20} />
                                Registrando...
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>o</span>
                </div>

                <p className={styles.loginText}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className={styles.loginLink}>
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    )
}
