import prisma from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { ROLE_LABELS, USER_STATUS_LABELS } from '@/lib/constants'
import Link from 'next/link'
import { Plus, Search, Edit, Users, Shield, UserCheck, Activity, UserPlus } from 'lucide-react'
import styles from './page.module.css'
import DeleteUserButton from './DeleteUserButton'

async function getUsers(searchParams: Promise<{ search?: string; role?: string; status?: string; page?: string }>) {
    const params = await searchParams
    const page = parseInt(params.page || '1')
    const limit = 10
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: 'insensitive' as any } },
            { email: { contains: params.search, mode: 'insensitive' as any } },
        ]
    }

    if (params.role) {
        where.role = params.role
    }

    if (params.status) {
        where.status = params.status
    }

    const [users, total, adminCount, wholesaleCount, activeCount] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
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
        }),
        prisma.user.count({ where }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'WHOLESALE' } }),
        prisma.user.count({ where: { status: 'ACTIVE' } })
    ])

    return { users, total, page, totalPages: Math.ceil(total / limit), stats: { adminCount, wholesaleCount, activeCount } }
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; role?: string; status?: string; page?: string }>
}) {
    const { users, total, page, totalPages, stats } = await getUsers(searchParams)
    const params = await searchParams

    return (
        <div className={styles.page}>
            {/* Resumen de Usuarios */}
            <div className={styles.statsSummary}>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Usuarios</span>
                        <span className={styles.statValue}>{total}</span>
                    </div>
                    <Users size={20} style={{ color: 'var(--secondary)', opacity: 0.5 }} />
                </div>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Administradores</span>
                        <span className={styles.statValue}>{stats.adminCount}</span>
                    </div>
                    <Shield size={20} style={{ color: '#ef4444', opacity: 0.5 }} />
                </div>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Mayoristas</span>
                        <span className={styles.statValue}>{stats.wholesaleCount}</span>
                    </div>
                    <UserCheck size={20} style={{ color: '#8b5cf6', opacity: 0.5 }} />
                </div>
                <div className={styles.statBox}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Usuarios Activos</span>
                        <span className={styles.statValue} style={{ color: '#22c55e' }}>{stats.activeCount}</span>
                    </div>
                    <Activity size={20} style={{ color: '#22c55e', opacity: 0.5 }} />
                </div>
            </div>

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Directorios de Usuarios</h1>
                    <p className={styles.subtitle}>Administra el acceso, roles y estados de todos los usuarios registrados</p>
                </div>
                <Link href="/admin/usuarios/nuevo" className={styles.addButton}>
                    <UserPlus size={20} />
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
                        defaultValue={params.search}
                        placeholder="Buscar por nombre o dirección de email..."
                        className={styles.searchInput}
                    />
                </form>

                <div className={styles.filterGroup}>
                    <select name="role" className={styles.select} defaultValue={params.role}>
                        <option value="">Cualquier Rol</option>
                        <option value="CUSTOMER">Consumidor Final</option>
                        <option value="WHOLESALE">Mayorista</option>
                        <option value="WAREHOUSE">Bodeguero</option>
                        <option value="ADMIN">Administrador</option>
                    </select>

                    <select name="status" className={styles.select} defaultValue={params.status}>
                        <option value="">Cualquier Estado</option>
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
                            <th>Nombre de Usuario / Email</th>
                            <th>Rol Asignado</th>
                            <th>Estado</th>
                            <th>Último Acceso</th>
                            <th>Fecha Registro</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    No se encontraron usuarios con los filtros aplicados
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
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                                        <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                                            <Link href={`/admin/usuarios/${user.id}`} className={styles.actionButton} title="Editar Perfil">
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

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <Link
                        href={{ query: { ...params, page: page - 1 } }}
                        className={`${styles.pageBtn} ${page === 1 ? styles.disabled : ''}`}
                    >
                        Anterior
                    </Link>
                    <div className={styles.pageInfo}>
                        Página <span>{page}</span> de <span>{totalPages}</span>
                    </div>
                    <Link
                        href={{ query: { ...params, page: page + 1 } }}
                        className={`${styles.pageBtn} ${page === totalPages ? styles.disabled : ''}`}
                    >
                        Siguiente
                    </Link>
                </div>
            )}

            <div className={styles.summary}>
                Mostrando {users.length} de {total} usuarios en total
            </div>
        </div>
    )
}
