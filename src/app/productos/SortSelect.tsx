'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'

interface SortSelectProps {
    currentSort: string
}

export default function SortSelect({ currentSort }: SortSelectProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('orden', e.target.value)
        router.push(`/productos?${params.toString()}`)
    }

    return (
        <div className={styles.sortSelect}>
            <label htmlFor="orden">Ordenar por:</label>
            <select
                id="orden"
                value={currentSort}
                onChange={handleChange}
            >
                <option value="recientes">Más recientes</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre A-Z</option>
            </select>
        </div>
    )
}
