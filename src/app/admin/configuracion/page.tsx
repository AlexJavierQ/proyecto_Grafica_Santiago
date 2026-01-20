'use client'

import { useState } from 'react'
import { Settings, Globe, Shield, MessageSquare, CreditCard } from 'lucide-react'
import styles from './page.module.css'
import { toast } from 'sonner'

export default function ConfigurationPage() {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success('Configuración guardada correctamente')
        }, 1000)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configuración del Sistema</h1>
            </div>

            <form className={styles.form} onSubmit={handleSave}>
                {/* General Settings */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        <Globe size={20} />
                        Información de la Tienda
                    </h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Nombre de la Empresa</label>
                            <input type="text" defaultValue="Gráfica Santiago" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email de Contacto</label>
                            <input type="email" defaultValue="contacto@graficasantiago.cl" />
                        </div>
                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label>WhatsApp de Ventas</label>
                            <input type="text" defaultValue="+56 9 1234 5678" />
                            <p className={styles.info}>Se usará para el botón flotante de WhatsApp.</p>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payments */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        <CreditCard size={20} />
                        Pagos y Envíos
                    </h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Costo de Envío Base (CLP)</label>
                            <input type="number" defaultValue="5000" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Envío Gratis desde (CLP)</label>
                            <input type="number" defaultValue="50000" />
                            <p className={styles.info}>Dejar en 0 para desactivar envío gratis.</p>
                        </div>
                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label>Moneda del Sitio</label>
                            <select defaultValue="CLP">
                                <option value="CLP">Peso Chileno (CLP)</option>
                                <option value="USD">Dólar (USD)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        <Shield size={20} />
                        Seguridad y Acceso
                    </h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Estado de la Tienda</label>
                            <select defaultValue="online">
                                <option value="online">En línea (Abierta)</option>
                                <option value="maintenance">Modo Mantenimiento</option>
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                            <label>Mensaje de Mantenimiento</label>
                            <textarea rows={2} defaultValue="Estamos realizando mejoras. Volvemos pronto." />
                        </div>
                    </div>
                </div>

                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    )
}
