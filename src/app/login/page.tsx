'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import styles from './page.module.css'
import { useAuthStore } from '@/lib/authStore'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al iniciar sesión')
            }

            // Guardar en el store de autenticación
            const userRole = data.user.role === 'ADMIN' ? 'admin' :
                data.user.role === 'MAYORISTA' ? 'mayorista' : 'cliente'

            login({
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: userRole
            })

            // Redirigir a la página solicitada o al inicio
            const params = new URLSearchParams(window.location.search)
            const redirectTo = params.get('redirect') || '/'
            router.push(redirectTo)
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

                <h1 className={styles.title}>Iniciar Sesión</h1>
                <p className={styles.subtitle}>Ingresa a tu cuenta para continuar</p>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Correo electrónico
                        </label>
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
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
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

                    <div className={styles.options}>
                        <label className={styles.remember}>
                            <input type="checkbox" />
                            <span>Recordarme</span>
                        </label>
                        <Link href="/recuperar" className={styles.forgotLink}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className={styles.spinner} size={20} />
                                Ingresando...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>o</span>
                </div>

                <p className={styles.registerText}>
                    ¿No tienes una cuenta?{' '}
                    <Link href="/registro" className={styles.registerLink}>
                        Regístrate aquí
                    </Link>
                </p>


            </div>
        </div>
    )
}
