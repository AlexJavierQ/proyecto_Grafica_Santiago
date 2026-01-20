'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Boxes,
    UserCheck
} from 'lucide-react'
import { useState, useEffect } from 'react'
import styles from './layout.module.css'
const menuGroups = [
    {
        title: 'Principal',
        items: [
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
        ]
    },
    {
        title: 'Ecommerce',
        items: [
            { href: '/admin/productos', label: 'Productos', icon: Package },
            { href: '/admin/categorias', label: 'Categorías', icon: Boxes },
            { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingCart },
            { href: '/admin/mayoristas', label: 'Mayoristas', icon: UserCheck },
        ]
    },
    {
        title: 'Usuarios y Seguridad',
        items: [
            { href: '/admin/usuarios', label: 'Gestión Usuarios', icon: Users },
            { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
        ]
    }
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        // Verificar autenticación
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user && (data.user.role === 'ADMIN' || data.user.role === 'WAREHOUSE')) {
                    setUser(data.user)
                } else {
                    router.push('/login')
                }
            })
            .catch(() => router.push('/login'))
    }, [router])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    if (!user) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        <Package className={styles.logoIcon} />
                        <span>Admin Panel</span>
                    </Link>
                    <button
                        className={styles.closeSidebar}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {menuGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className={styles.navGroup}>
                            <h3 className={styles.navGroupTitle}>{group.title}</h3>
                            <div className={styles.navGroupItems}>
                                {group.items.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/admin' && pathname.startsWith(item.href))

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <div className={styles.navIconWrapper}>
                                                <Icon size={18} />
                                            </div>
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userRole}>{user.role}</span>
                        </div>
                    </div>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay móvil */}
            {isSidebarOpen && (
                <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button
                            className={styles.menuButton}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className={styles.headerInfo}>
                            <span className={styles.headerGreeting}>
                                {currentTime.getHours() < 12 ? '☀️ Buenos días' :
                                    currentTime.getHours() < 19 ? '🌤️ Buenas tardes' : '🌙 Buenas noches'}
                                {user ? `, ${user.name.split(' ')[0]}` : ''}
                            </span>
                            <span className={styles.headerDate}>
                                {currentTime.toLocaleDateString('es-CL', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })} • {currentTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.headerStatus}>
                            <span className={styles.statusDot}></span>
                            <span>Sistema Online</span>
                        </div>
                        <Link href="/" className={styles.viewSite}>
                            Ver tienda
                        </Link>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    )
}
