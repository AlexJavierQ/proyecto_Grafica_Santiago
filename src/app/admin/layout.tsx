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

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/categorias', label: 'Categorías', icon: Boxes },
    { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { href: '/admin/mayoristas', label: 'Mayoristas', icon: UserCheck },
    { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingCart },
    { href: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
    { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
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
                    {menuItems.map((item) => {
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
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
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
                    <button
                        className={styles.menuButton}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className={styles.headerRight}>
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
