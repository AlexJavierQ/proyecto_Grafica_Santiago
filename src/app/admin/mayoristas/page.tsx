import prisma from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { UserCheck, Clock, X, Check, Building2, Phone, Mail, FileText, MapPin, Search, Plus } from 'lucide-react'
import styles from './page.module.css'
import ApproveRejectButtons from './ApproveRejectButtons'

async function getPendingWholesalers() {
    const users = await prisma.user.findMany({
        where: {
            wholesaleRequested: true,
        },
        orderBy: { updatedAt: 'desc' },
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
                    <h1 className={styles.title}>Centro Mayorista</h1>
                    <p className={styles.subtitle}>Gestiona las solicitudes y cuentas de clientes corporativos</p>
                </div>
            </div>

            {/* Estadísticas */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <span className={styles.statValue}>{pendingUsers.length}</span>
                        <span className={styles.statLabel}>Solicitudes Pendientes</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <span className={styles.statValue}>{approvedUsers.length}</span>
                        <span className={styles.statLabel}>Mayoristas Activos (Recientes)</span>
                    </div>
                </div>
            </div>

            {/* Solicitudes pendientes */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Clock size={22} />
                    Solicitudes por Revisar
                </h2>

                {pendingUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '50%', marginBottom: '1rem' }}>
                            <UserCheck size={48} style={{ opacity: 0.5 }} />
                        </div>
                        <p>No tienes solicitudes pendientes</p>
                        <span>¡Excelente! Estás al día con todos tus clientes potenciales.</span>
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
                                            <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                            {formatDateTime(user.updatedAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.requestDetails}>
                                    <div className={styles.detailItem} title="Empresa">
                                        <Building2 size={16} />
                                        <span>{user.companyName || 'Persona Natural'}</span>
                                    </div>
                                    <div className={styles.detailItem} title="Identificación / RUC">
                                        <FileText size={16} />
                                        <span>RUC: {user.ruc || 'No provisto'}</span>
                                    </div>
                                    <div className={styles.detailItem} title="Dirección">
                                        <MapPin size={16} />
                                        <span>{(user as any).wholesaleAddress || 'No especificada'}</span>
                                    </div>
                                    <div className={styles.detailItem} title="Email">
                                        <Mail size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className={styles.detailItem} title="Teléfono">
                                        <Phone size={16} />
                                        <span>{user.phone || 'Sin teléfono'}</span>
                                    </div>
                                    {(user as any).wholesaleMessage && (
                                        <div className={styles.detailItem} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                                            <FileText size={16} />
                                            <span style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                                "{(user as any).wholesaleMessage}"
                                            </span>
                                        </div>
                                    )}
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
                    <UserCheck size={22} />
                    Mayoristas Activos
                </h2>

                {approvedUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Aún no hay mayoristas aprobados</p>
                        <span>Los usuarios aprobados aparecerán aquí para una gestión rápida.</span>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre del Cliente</th>
                                    <th>Empresa</th>
                                    <th>RUC</th>
                                    <th>Email de Contacto</th>
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
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 600, color: 'white' }}>{user.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Desde {new Date(user.createdAt).toLocaleDateString()}</span>
                                                </div>
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
