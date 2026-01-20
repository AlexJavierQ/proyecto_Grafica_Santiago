import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import styles from './page.module.css'
import Link from 'next/link'

export const metadata = {
    title: 'Contáctanos | Gráfica Santiago',
    description: 'Visítanos en nuestra tienda o contáctanos por WhatsApp, teléfono o correo electrónico.',
}

export default function ContactoPage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className={styles.badge}>Estamos para ayudarte</span>
                        <h1>Contáctanos</h1>
                        <p>¿Tienes preguntas o necesitas asesoría? Estamos a tu servicio.</p>
                    </div>

                    <div className={styles.grid}>
                        {/* Información de contacto */}
                        <div className={styles.infoSection}>
                            {/* WhatsApp CTA - Movido arriba para visibilidad */}
                            <Link
                                href="https://wa.me/593991234567?text=Hola,%20me%20gustaría%20más%20información%20sobre%20sus%20productos"
                                target="_blank"
                                className={styles.whatsappButton}
                            >
                                <MessageCircle size={24} />
                                <span>Escríbenos por WhatsApp</span>
                            </Link>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h3>Ubicación</h3>
                                    <p>Megasantiago</p>
                                    <p className={styles.muted}>Loja, Ecuador</p>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <h3>Teléfono</h3>
                                    <p>+593 99 123 4567</p>
                                    <p className={styles.muted}>Lunes a Viernes 8am - 6pm</p>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <h3>Correo Electrónico</h3>
                                    <p>ventas@graficasantiago.com</p>
                                    <p className={styles.muted}>Respondemos en 24 horas</p>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h3>Horario de Atención</h3>
                                    <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
                                    <p>Sábados: 9:00 AM - 2:00 PM</p>
                                </div>
                            </div>

                        </div>

                        {/* Mapa */}
                        <div className={styles.mapSection}>
                            <div className={styles.mapContainer}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.100077820862!2d-79.20633442502479!3d-3.9998446959738945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cb370032bb6e7d%3A0xdde8b9822c410484!2sMegasantiago!5e0!3m2!1ses!2sec!4v1768868170004!5m2!1ses!2sec"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '20px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            <div className={styles.mapInfo}>
                                <h3>Visítanos en nuestra tienda</h3>
                                <p>En Megasantiago encontrarás todo lo que necesitas en papelería, útiles escolares y suministros de oficina. ¡Te esperamos!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
