'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Truck, Shield, Zap, Sparkles, Palette, BookOpen, Briefcase } from 'lucide-react'
import styles from './HeroSlider.module.css'

const slides = [
    {
        id: 1,
        badge: '¡Bienvenido a tu papelería favorita!',
        title: 'Todo para tu',
        highlight: 'oficina y creatividad',
        description: 'Encuentra más de 40 productos seleccionados para ti. Precios justos, envío rápido y la mejor atención.',
        cta: 'Explorar catálogo',
        ctaLink: '/productos',
        icon: Palette,
        color: '#f9e219'
    },
    {
        id: 2,
        badge: 'Vuelta a clases',
        title: 'Todo lo que',
        highlight: 'necesitan tus hijos',
        description: 'Cuadernos, lápices, colores y más. Prepara el año escolar con los mejores productos.',
        cta: 'Ver escolar',
        ctaLink: '/productos?categoria=escolar',
        icon: BookOpen,
        color: '#10b981'
    },
    {
        id: 3,
        badge: 'Para empresas',
        title: 'Equipa tu',
        highlight: 'oficina completa',
        description: 'Suministros de oficina, tecnología y papelería corporativa. Descuentos para mayoristas.',
        cta: 'Ver oficina',
        ctaLink: '/productos?categoria=oficina',
        icon: Briefcase,
        color: '#3b82f6'
    }
]

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    // Auto-play del carrusel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, []) // Sin dependencias para que el timer no se reinicie

    const nextSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setTimeout(() => setIsAnimating(false), 600)
    }

    const prevSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setTimeout(() => setIsAnimating(false), 600)
    }

    const slide = slides[currentSlide]
    const IconComponent = slide.icon

    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.heroOverlay}></div>
                <img
                    src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1920&q=80"
                    alt="Background"
                    className={styles.heroImg}
                />
            </div>

            <div className={styles.heroContainer}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge} style={{ borderColor: slide.color, color: slide.color }}>
                        <Sparkles size={14} />
                        <span>{slide.badge}</span>
                    </div>

                    <h1 className={styles.heroTitle} key={slide.id}>
                        {slide.title}
                        <br />
                        <em style={{ color: slide.color }}>{slide.highlight}</em>
                    </h1>

                    <p className={styles.heroDescription}>
                        {slide.description}
                    </p>

                    <div className={styles.heroActions}>
                        <Link href={slide.ctaLink} className={styles.btnHero} style={{ background: slide.color }}>
                            <span>{slide.cta}</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="/mayoristas" className={styles.btnHeroOutline}>
                            Soy mayorista
                        </Link>
                    </div>

                    <div className={styles.heroTrust}>
                        <div className={styles.trustItem}>
                            <Truck size={16} />
                            <span>Envío en 24h</span>
                        </div>
                        <div className={styles.trustItem}>
                            <Shield size={16} />
                            <span>Garantía total</span>
                        </div>
                        <div className={styles.trustItem}>
                            <Zap size={16} />
                            <span>Pago seguro</span>
                        </div>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={styles.floatingElements}>
                        <div className={styles.floatIcon} style={{ background: slide.color }}>
                            <IconComponent size={32} color="var(--primary)" />
                        </div>
                        <div className={styles.floatCard}>
                            <img src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&q=80" alt="Product" />
                        </div>
                        <div className={styles.floatCard2}>
                            <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&q=80" alt="Product" />
                        </div>
                        <div className={styles.floatBadge} style={{ background: slide.color }}>
                            <span>+40</span>
                            <small>productos</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button onClick={prevSlide} className={styles.navBtn} aria-label="Previous">
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.dots}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <button onClick={nextSlide} className={styles.navBtn} aria-label="Next">
                    <ArrowRight size={20} />
                </button>
            </div>
        </section>
    )
}
