'use client'

import { Check, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './page.module.css'
import { toast } from 'sonner'

interface ApproveRejectButtonsProps {
    userId: string
    userName: string
}

export default function ApproveRejectButtons({ userId, userName }: ApproveRejectButtonsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<'approve' | 'reject' | null>(null)

    const handleAction = async (action: 'approve' | 'reject') => {
        // We'll use a custom toast for confirmation instead of window.confirm
        toast(action === 'approve' ? `¿Aprobar a ${userName}?` : `¿Rechazar a ${userName}?`, {
            description: action === 'approve'
                ? 'El usuario podrá ver precios mayoristas inmediatamente.'
                : 'La solicitud será rechazada y el usuario notificado.',
            action: {
                label: action === 'approve' ? 'Aprobar' : 'Rechazar',
                onClick: async () => {
                    setIsLoading(action)
                    try {
                        const res = await fetch(`/api/admin/users/${userId}/wholesale`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action }),
                        })

                        if (!res.ok) {
                            const data = await res.json()
                            throw new Error(data.error || 'Error al procesar solicitud')
                        }

                        toast.success(action === 'approve'
                            ? `¡${userName} ahora es mayorista!`
                            : `Solicitud de ${userName} rechazada.`)

                        router.refresh()
                    } catch (error) {
                        toast.error(error instanceof Error ? error.message : 'Error al procesar')
                    } finally {
                        setIsLoading(null)
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
        <div className={styles.requestActions}>
            <button
                className={styles.rejectButton}
                onClick={() => handleAction('reject')}
                disabled={isLoading !== null}
            >
                {isLoading === 'reject' ? (
                    <Loader2 size={18} className={styles.spinner} />
                ) : (
                    <X size={18} />
                )}
                Rechazar
            </button>
            <button
                className={styles.approveButton}
                onClick={() => handleAction('approve')}
                disabled={isLoading !== null}
            >
                {isLoading === 'approve' ? (
                    <Loader2 size={18} className={styles.spinner} />
                ) : (
                    <Check size={18} />
                )}
                Aprobar
            </button>
        </div>
    )
}
