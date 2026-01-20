'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import styles from './page.module.css'

interface DeleteUserButtonProps {
    userId: string
    userName: string
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        toast(`¿Eliminar al usuario "${userName}"?`, {
            description: 'Esta acción desactivará permanentemente su acceso al sistema.',
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    setIsDeleting(true)
                    try {
                        const res = await fetch(`/api/admin/users/${userId}`, {
                            method: 'DELETE',
                        })

                        if (!res.ok) {
                            const data = await res.json()
                            throw new Error(data.error || 'Fallo de integridad al eliminar')
                        }

                        toast.success(`Usuario ${userName} removido correctamente`)
                        router.refresh()
                    } catch (error) {
                        toast.error(error instanceof Error ? error.message : 'Error inesperado')
                    } finally {
                        setIsDeleting(false)
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
        <button
            className={styles.actionButton}
            onClick={handleDelete}
            disabled={isDeleting}
            title="Eliminar permanentemente"
            style={{ color: '#ef4444' }}
        >
            {isDeleting ? <Loader2 size={18} className={styles.spin} /> : <Trash2 size={18} />}
        </button>
    )
}
