'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './page.module.css'

interface DeleteUserButtonProps {
    userId: string
    userName: string
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`¿Estás seguro de eliminar al usuario "${userName}"?`)) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al eliminar usuario')
            }

            router.refresh()
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Error al eliminar')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
            title="Eliminar"
        >
            <Trash2 size={18} />
        </button>
    )
}
