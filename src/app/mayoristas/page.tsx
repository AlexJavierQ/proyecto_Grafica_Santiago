'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import { useAuthStore } from '@/lib/authStore'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Building2, FileText, Phone, MapPin, Mail } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function WholesalePage() {
    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        companyName: '',
        taxId: '',
        phone: '',
        address: '',
        city: '',
        businessType: 'libreria',
        message: '',
        agreeTerms: false
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const nextStep = () => {
        if (step === 1 && (!formData.companyName || !formData.taxId)) {
            toast.error('Por favor completa los datos de la empresa')
            return
        }
        if (step === 2 && (!formData.phone || !formData.address || !formData.city)) {
            toast.error('Por favor completa los datos de contacto')
            return
        }
        setStep(prev => prev + 1)
        window.scrollTo(0, 0)
    }

    const prevStep = () => setStep(prev => prev - 1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.agreeTerms) {
            toast.error('Debes aceptar los términos y condiciones')
            return
        }

        if (!isAuthenticated) {
            toast.error('Debe iniciar sesión para solicitar una cuenta mayorista')
            router.push('/login?redirect=/mayoristas')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/wholesale/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    address: `${formData.address}, ${formData.city}`
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar la solicitud')
            }

            toast.success('Solicitud enviada exitosamente')
            setIsSubmitted(true)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.loginPrompt}>
                        <Building2 size={64} color="#3b82f6" style={{ marginBottom: '1.5rem' }} />
                        <h1>¿Eres cliente mayorista?</h1>
                        <p>Inicia sesión o regístrate para solicitar el acceso a precios mayoristas y beneficios exclusivos.</p>
                        <Link href="/login?redirect=/mayoristas" className={styles.loginButton}>
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (isSubmitted || (user as any)?.wholesaleRequested) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.successMessage}>
                        <CheckCircle2 size={64} className={styles.pulseIcon} />
                        <h2>¡Solicitud en Proceso!</h2>
                        <p>Tu solicitud de cuenta mayorista ha sido registrada y está siendo evaluada por nuestro equipo comercial.</p>
                        <div className={styles.nextSteps}>
                            <h3>¿Qué sigue?</h3>
                            <ul>
                                <li>Revisaremos tu documentación tributaria.</li>
                                <li>Te contactaremos vía telefónica para validar detalles.</li>
                                <li>Recibirás un email confirmando la activación de tu cuenta.</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '2.5rem' }}>
                            <Link href="/productos" className={styles.loginButton} style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
                                Seguir Explorando
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Programa de Distribuidores</span>
                    <h1>Panel de Solicitud Mayorista</h1>
                    <p>Únete a nuestra red de aliados estratégicos y accede a beneficios exclusivos.</p>
                </div>

                {/* Stepper */}
                <div className={styles.stepper}>
                    <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ''}`}>
                        <div className={styles.stepNumber}>1</div>
                        <span>Empresa</span>
                    </div>
                    <div className={styles.stepLine}></div>
                    <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ''}`}>
                        <div className={styles.stepNumber}>2</div>
                        <span>Contacto</span>
                    </div>
                    <div className={styles.stepLine}></div>
                    <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ''}`}>
                        <div className={styles.stepNumber}>3</div>
                        <span>Detalles</span>
                    </div>
                    <div className={styles.stepLine}></div>
                    <div className={`${styles.stepItem} ${step >= 4 ? styles.stepActive : ''}`}>
                        <div className={styles.stepNumber}>4</div>
                        <span>Revisión</span>
                    </div>
                </div>

                <div className={styles.formContainer}>
                    {step === 1 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <Building2 size={24} />
                                <h2>Datos de la Empresa</h2>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Razón Social / Nombre Comercial</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Nombre legal de tu negocio"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>RUC / NIT</label>
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleChange}
                                    placeholder="Número de identificación tributaria"
                                    className={styles.input}
                                />
                            </div>
                            <button onClick={nextStep} className={styles.submitButton}>Siguiente Paso</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <MapPin size={24} />
                                <h2>Ubicación y Contacto</h2>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Dirección Comercial</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Calle, Av, Número"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Ej. Santiago, Bogotá, etc."
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Teléfono / WhatsApp</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+56 9 XXXX XXXX"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.btnRow}>
                                <button onClick={prevStep} className={styles.backButton}>Atrás</button>
                                <button onClick={nextStep} className={styles.submitButton}>Siguiente Paso</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <FileText size={24} />
                                <h2>Detalles del Negocio</h2>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tipo de Negocio</label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className={styles.input}
                                >
                                    <option value="libreria">Librería / Papelería</option>
                                    <option value="oficina">Suministros de Oficina</option>
                                    <option value="reventa">Distribuidor / Reventa</option>
                                    <option value="educacion">Institución Educativa</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mensaje o Comentarios (Opcional)</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Cuéntanos sobre tu volumen de compras mensual..."
                                    className={styles.textarea}
                                ></textarea>
                            </div>
                            <div className={styles.btnRow}>
                                <button onClick={prevStep} className={styles.backButton}>Atrás</button>
                                <button onClick={nextStep} className={styles.submitButton}>Revisar Solicitud</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                                <CheckCircle2 size={24} />
                                <h2>Resumen de Solicitud</h2>
                            </div>
                            <div className={styles.reviewGrid}>
                                <div className={styles.reviewItem}>
                                    <strong>Empresa:</strong> <span>{formData.companyName}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <strong>RUC/NIT:</strong> <span>{formData.taxId}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <strong>Ubicación:</strong> <span>{formData.address}, {formData.city}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <strong>Teléfono:</strong> <span>{formData.phone}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <strong>Rubro:</strong> <span style={{ textTransform: 'capitalize' }}>{formData.businessType}</span>
                                </div>
                            </div>

                            <div className={styles.termsBox}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                    />
                                    <span>Acepto que la información proporcionada es verídica y autorizo el tratamiento de mis datos comerciales.</span>
                                </label>
                            </div>

                            <div className={styles.btnRow}>
                                <button onClick={prevStep} className={styles.backButton}>Corregir</button>
                                <button
                                    onClick={handleSubmit}
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Enviando...
                                        </>
                                    ) : 'Confirmar y Enviar Solicitud'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
