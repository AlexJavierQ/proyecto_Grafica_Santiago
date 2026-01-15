import prisma from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { UserCheck, Clock, X, Check, Building2, Phone, Mail, FileText } from 'lucide-react'
import styles from './page.module.css'
import ApproveRejectButtons from './ApproveRejectButtons'

async function getPendingWholesalers() {
    const users = await prisma.user.findMany({
        where: {
            wholesaleRequested: true,
            status: 'PENDING',
        },
        orderBy: { createdAt: 'asc' },
    })

    return users
}

async function getApprovedWholesalers() {
    const users = await prisma.user.findMany({
        where: {
            role: 'WHOLESALE',
            status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
    })

    return users
}

export default async function MayoristasPage() {
    const [pendingUsers, approvedUsers] = await Promise.all([
        getPendingWholesalers(),
        getApprovedWholesalers(),
    ])

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Solicitudes Mayoristas</h1>
                    <p className={styles.subtitle}>Revisa y aprueba solicitudes de cuentas mayoristas</p>
                </div>
            </div>

            {/* Estadísticas */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Clock className={styles.statIcon} />
                    <div>
                        <span className={styles.statValue}>{pendingUsers.length}</span>
                        <span className={styles.statLabel}>Pendientes</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <UserCheck className={styles.statIcon} />
                    <div>
                        <span className={styles.statValue}>{approvedUsers.length}</span>
                        <span className={styles.statLabel}>Aprobados (últimos)</span>
                    </div>
                </div>
            </div>

            {/* Solicitudes pendientes */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Clock size={24} />
                    Solicitudes Pendientes
                </h2>

                {pendingUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <UserCheck size={48} />
                        <p>No hay solicitudes pendientes</p>
                        <span>Las nuevas solicitudes aparecerán aquí</span>
                    </div>
                ) : (
                    <div className={styles.requestsGrid}>
                        {pendingUsers.map((user) => (
                            <div key={user.id} className={styles.requestCard}>
                                <div className={styles.requestHeader}>
                                    <div className={styles.avatar}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={styles.requestInfo}>
                                        <h3>{user.name}</h3>
                                        <span className={styles.requestDate}>
                                            Solicitado: {formatDateTime(user.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.requestDetails}>
                                    <div className={styles.detailItem}>
                                        <Building2 size={16} />
                                        <span>{user.companyName || 'No especificado'}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <FileText size={16} />
                                        <span>RUC: {user.ruc || 'No especificado'}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Mail size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <Phone size={16} />
                                        <span>{user.phone || 'No especificado'}</span>
                                    </div>
                                </div>

                                <ApproveRejectButtons userId={user.id} userName={user.name} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Mayoristas aprobados recientemente */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <UserCheck size={24} />
                    Mayoristas Aprobados Recientemente
                </h2>

                {approvedUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No hay mayoristas aprobados aún</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Empresa</th>
                                    <th>RUC</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.avatarSmall}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{user.name}</span>
                                            </div>
                                        </td>
                                        <td>{user.companyName || '-'}</td>
                                        <td>{user.ruc || '-'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}
