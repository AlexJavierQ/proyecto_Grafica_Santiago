'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, ShoppingBag, Home } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import styles from './page.module.css'
import { useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'

import { Suspense } from 'react'
// import { useEffect, useState } from 'react' // Remove duplicate or unused imports if causing issues, but Suspense is key here
// ... keep other imports

function SuccessContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order') || 'PENDIENTE'

    useEffect(() => {
        // Disparar confeti al cargar
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ffe607', '#012b42']
            })
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ffe607', '#012b42']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()
    }, [])

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className={styles.card}
        >
            <div className={styles.iconWrapper}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className={styles.checkCircle}
                >
                    <Check size={48} strokeWidth={3} />
                </motion.div>
            </div>

            <h1 className={styles.title}>¡Gracias por tu compra!</h1>
            <p className={styles.subtitle}>
                Tu orden ha sido confirmada y prepararemos tu envío lo antes posible.
            </p>

            <div className={styles.orderInfo}>
                <span>Número de Orden</span>
                <strong>{orderNumber}</strong>
            </div>

            <div className={styles.actions}>
                <Link href="/productos" className={styles.primaryBtn}>
                    Seguir Comprando <ShoppingBag size={18} />
                </Link>
                <Link href="/" className={styles.secondaryBtn}>
                    Volver al Inicio <Home size={18} />
                </Link>
            </div>
        </motion.div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <Suspense fallback={<div className={styles.loading}>Cargando confirmación...</div>}>
                        <SuccessContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </>
    )
}
