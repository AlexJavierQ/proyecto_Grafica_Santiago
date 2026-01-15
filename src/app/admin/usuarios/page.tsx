import prisma from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { ROLE_LABELS, USER_STATUS_LABELS } from '@/lib/constants'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react'
import styles from './page.module.css'
import DeleteUserButton from './DeleteUserButton'

async function getUsers(searchParams: Promise<{ search?: string; role?: string; status?: string }>) {
    const params = await searchParams
    const where: Record<string, unknown> = {}

    if (params.search) {
        where.OR = [
            { name: { contains: params.search } },
            { email: { contains: params.search } },
        ]
    }

    if (params.role) {
        where.role = params.role
    }

    if (params.status) {
        where.status = params.status
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            companyName: true,
            lastLogin: true,
            createdAt: true,
        },
    })

    return users
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; role?: string; status?: string }>
}) {
    const users = await getUsers(searchParams)

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Usuarios</h1>
                    <p className={styles.subtitle}>Gestiona los usuarios del sistema</p>
                </div>
                <Link href="/admin/usuarios/nuevo" className={styles.addButton}>
                    <Plus size={20} />
                    Nuevo Usuario
                </Link>
            </div>

            {/* Filtros */}
            <div className={styles.filters}>
                <form className={styles.searchForm}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        name="search"
                        placeholder="Buscar por nombre o email..."
                        className={styles.searchInput}
                    />
                </form>

                <div className={styles.filterGroup}>
                    <select name="role" className={styles.select}>
                        <option value="">Todos los roles</option>
                        <option value="CUSTOMER">Cliente</option>
                        <option value="WHOLESALE">Mayorista</option>
                        <option value="WAREHOUSE">Bodeguero</option>
                        <option value="ADMIN">Administrador</option>
                    </select>

                    <select name="status" className={styles.select}>
                        <option value="">Todos los estados</option>
                        <option value="ACTIVE">Activo</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="INACTIVE">Inactivo</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Último acceso</th>
                            <th>Registrado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className={styles.userName}>{user.name}</span>
                                                <span className={styles.userEmail}>{user.email}</span>
                                                {user.companyName && (
                                                    <span className={styles.userCompany}>{user.companyName}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${styles[`role${user.role}`]}`}>
                                            {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[`status${user.status}`]}`}>
                                            {USER_STATUS_LABELS[user.status as keyof typeof USER_STATUS_LABELS] || user.status}
                                        </span>
                                    </td>
                                    <td className={styles.dateCell}>
                                        {user.lastLogin ? formatDateTime(user.lastLogin) : 'Nunca'}
                                    </td>
                                    <td className={styles.dateCell}>
                                        {formatDateTime(user.createdAt)}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/admin/usuarios/${user.id}`} className={styles.actionButton} title="Editar">
                                                <Edit size={18} />
                                            </Link>
                                            <DeleteUserButton userId={user.id} userName={user.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Resumen */}
            <div className={styles.summary}>
                Mostrando {users.length} usuario{users.length !== 1 ? 's' : ''}
            </div>
        </div>
    )
}
