'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu, X, Package } from 'lucide-react'
import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const cartItemsCount = 0 // TODO: Implementar con contexto

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/productos?buscar=${encodeURIComponent(searchQuery)}`
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <img src="/img/logo.png" alt="Gráfica Santiago" className={styles.logoImg} />
                    <span className={styles.logoText}></span>
                </Link>

                {/* Barra de búsqueda - Desktop */}
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <Search size={20} />
                    </button>
                </form>

                {/* Navegación - Desktop */}
                <div className={styles.navLinks}>
                    <Link href="/productos" className={styles.navLink}>
                        Productos
                    </Link>
                    <Link href="/categorias" className={styles.navLink}>
                        Categorías
                    </Link>
                </div>

                {/* Acciones */}
                <div className={styles.actions}>
                    <Link href="/carrito" className={styles.cartButton}>
                        <ShoppingCart size={24} />
                        {cartItemsCount > 0 && (
                            <span className={styles.cartBadge}>{cartItemsCount}</span>
                        )}
                    </Link>
                    <Link href="/login" className={styles.userButton}>
                        <User size={24} />
                    </Link>

                    {/* Menú móvil */}
                    <button
                        className={styles.menuButton}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button type="submit" className={styles.searchButton}>
                            <Search size={20} />
                        </button>
                    </form>
                    <Link href="/productos" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                        Productos
                    </Link>
                    <Link href="/categorias" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                        Categorías
                    </Link>
                    <Link href="/login" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                        Iniciar Sesión
                    </Link>
                </div>
            )}
        </nav>
    )
}
