import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Info de la empresa */}
                    <div className={styles.column}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/img/logo.png"
                                alt="Gráfica Santiago"
                                width={160}
                                height={50}
                                className={styles.logoImg}
                            />
                        </Link>
                        <p className={styles.description}>
                            Tu tienda de papelería, suministros de oficina y material escolar de confianza.
                            Calidad y variedad al mejor precio.
                        </p>
                        <div className={styles.social}>
                            <a href="#" className={styles.socialLink} aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Enlaces</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/productos">Productos</Link></li>
                            <li><Link href="/categorias">Categorías</Link></li>
                            <li><Link href="/productos">Ofertas</Link></li>
                            <li><Link href="/">Nosotros</Link></li>
                        </ul>
                    </div>

                    {/* Cuenta */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Mi Cuenta</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/login">Iniciar Sesión</Link></li>
                            <li><Link href="/registro">Registrarse</Link></li>
                            <li><Link href="/perfil">Mis Pedidos</Link></li>
                            <li><Link href="/carrito">Mi Carrito</Link></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>Contacto</h3>
                        <ul className={styles.contactList}>
                            <li>
                                <MapPin size={18} />
                                <span>Av. Principal 123, Quito</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>(02) 234-5678</span>
                            </li>
                            <li>
                                <Mail size={18} />
                                <span>info@graficasantiago.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Gráfica Santiago. Todos los derechos reservados.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/">Política de Privacidad</Link>
                        <Link href="/">Términos y Condiciones</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
