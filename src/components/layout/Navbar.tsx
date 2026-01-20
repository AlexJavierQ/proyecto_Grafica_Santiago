'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Search, Shield, LogOut, Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/authStore'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const totalItems = useCartStore((state) => state.totalItems())
    const { user, isAuthenticated, logout, isAdmin } = useAuthStore()

    const isHome = pathname === '/'

    // Evitar hidratación mismatch y detectar scroll
    useEffect(() => {
        setMounted(true)

        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Check initial position

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Búsqueda en vivo con debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true)
                setShowResults(true)
                try {
                    const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
                    const data = await res.json()
                    setSearchResults(data.products || [])
                } catch (error) {
                    console.error('Error searching:', error)
                } finally {
                    setIsSearching(false)
                }
            } else {
                setSearchResults([])
                setShowResults(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Cerrar resultados al hacer clic fuera o navegar
    useEffect(() => {
        setShowResults(false)
        setIsMenuOpen(false)
    }, [pathname])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setShowResults(false)
            window.location.href = `/productos?buscar=${encodeURIComponent(searchQuery)}`
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
        logout()
        window.location.href = '/'
    }

    return (
        <nav className={`${styles.navbar} ${isHome && !scrolled ? styles.transparent : styles.solid}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/img/logo.png"
                        alt="Gráfica Santiago"
                        width={140}
                        height={45}
                        className={styles.logoImg}
                        priority
                    />
                </Link>

                {/* Barra de búsqueda - Desktop */}
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <Search size={20} />
                    </button>

                    {/* Resultados de búsqueda en vivo */}
                    {mounted && showResults && (
                        <div className={styles.searchResults}>
                            {isSearching ? (
                                <div className={styles.searchLoading}>
                                    <Loader2 className="animate-spin" size={24} />
                                </div>
                            ) : searchResults.length > 0 ? (
                                <>
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/productos/${product.id}`}
                                            className={styles.searchItem}
                                            onClick={() => setShowResults(false)}
                                        >
                                            <img
                                                src={JSON.parse(product.images || '["/placeholder-product.jpg"]')[0]}
                                                alt={product.name}
                                                className={styles.searchItemImage}
                                            />
                                            <div className={styles.searchItemInfo}>
                                                <span className={styles.searchItemCategory}>
                                                    {product.category?.name}
                                                </span>
                                                <span className={styles.searchItemName}>{product.name}</span>
                                                <span className={styles.searchItemPrice}>
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link
                                        href={`/productos?buscar=${encodeURIComponent(searchQuery)}`}
                                        className={styles.searchItem}
                                        style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.05)', marginTop: '0.5rem' }}
                                    >
                                        Ver todos los resultados
                                    </Link>
                                </>
                            ) : searchQuery.length >= 2 && (
                                <div className={styles.noResults}>
                                    No se encontraron productos para "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </form>

                {/* Navegación - Desktop */}
                <div className={styles.navLinks}>
                    <Link href="/productos" className={styles.navLink}>Productos</Link>
                    <Link href="/categorias" className={styles.navLink}>Categorías</Link>
                    <Link href="/mayoristas" className={styles.navLink}>Mayoristas</Link>
                    <Link href="/contacto" className={styles.navLink}>Contáctanos</Link>
                    {mounted && isAuthenticated && isAdmin() && (
                        <Link href="/admin" className={styles.adminButton}>
                            <Shield size={14} /> Admin
                        </Link>
                    )}
                </div>

                {/* Acciones */}
                <div className={styles.actions}>
                    <Link href="/carrito" className={styles.cartButton}>
                        <ShoppingCart size={24} />
                        {mounted && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </Link>

                    {/* Icono de usuario: si está logueado va a perfil, si no a login */}
                    {mounted && isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <Link href="/perfil" className={styles.userButton} title={user?.name}>
                                <User size={24} />
                                <span className={styles.userName}>{user?.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={handleLogout} className={styles.logoutButton} title="Cerrar sesión">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.userButton}>
                            <User size={24} />
                        </Link>
                    )}

                    {/* Menú móvil */}
                    <button
                        className={styles.menuButton}
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileSearchForm}>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                            className={styles.searchInput}
                        />
                        <button type="submit" className={styles.searchButton} onClick={handleSearch}>
                            <Search size={20} />
                        </button>

                        {/* Resultados de búsqueda en vivo - Móvil */}
                        {mounted && showResults && (
                            <div className={styles.searchResults}>
                                {isSearching ? (
                                    <div className={styles.searchLoading}>
                                        <Loader2 className="animate-spin" size={24} />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/productos/${product.id}`}
                                                className={styles.searchItem}
                                                onClick={() => {
                                                    setShowResults(false)
                                                    setIsMenuOpen(false)
                                                }}
                                            >
                                                <img
                                                    src={JSON.parse(product.images || '["/placeholder-product.jpg"]')[0]}
                                                    alt={product.name}
                                                    className={styles.searchItemImage}
                                                />
                                                <div className={styles.searchItemInfo}>
                                                    <span className={styles.searchItemCategory}>
                                                        {product.category?.name}
                                                    </span>
                                                    <span className={styles.searchItemName}>{product.name}</span>
                                                    <span className={styles.searchItemPrice}>
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </>
                                ) : searchQuery.length >= 2 && (
                                    <div className={styles.noResults}>
                                        Sin resultados
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <Link href="/productos" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Productos</Link>
                    <Link href="/categorias" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Categorías</Link>
                    <Link href="/mayoristas" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Mayoristas</Link>
                    <Link href="/contacto" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Contáctanos</Link>
                    {mounted && isAuthenticated && isAdmin() && (
                        <Link href="/admin" className={`${styles.mobileNavLink} ${styles.adminMobileLink}`} onClick={() => setIsMenuOpen(false)}>
                            <Shield size={16} /> Panel Admin
                        </Link>
                    )}
                    {mounted && isAuthenticated ? (
                        <>
                            <Link href="/perfil" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                                Mi Perfil
                            </Link>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className={styles.mobileNavLink}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}
