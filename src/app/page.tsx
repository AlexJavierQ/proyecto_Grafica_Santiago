import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import HeroSlider from '@/components/home/HeroSlider'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react'
import styles from './page.module.css'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { products: true } }
    }
  })
  return categories
}

// Imágenes para categorías
const categoryImages: Record<string, string> = {
  'papeleria': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
  'oficina': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'escolar': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
  'tecnologia': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'arte': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  'escritura': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80'
}

const getCategoryImage = (name: string) => {
  const term = name.toLowerCase()
  if (term.includes('arte') || term.includes('manualidad')) return categoryImages.arte
  if (term.includes('escolar') || term.includes('escuela')) return categoryImages.escolar
  if (term.includes('oficina') || term.includes('negocio')) return categoryImages.oficina
  if (term.includes('escritura') || term.includes('lapiz') || term.includes('boligrafo')) return categoryImages.escritura
  if (term.includes('tecnologia') || term.includes('computo') || term.includes('accessorio')) return categoryImages.tecnologia
  if (term.includes('papel') || term.includes('cuaderno')) return categoryImages.papeleria
  return categoryImages['default']
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <>
      <Navbar />
      <main className={`${styles.main} home-main`}>
        {/* HERO - Dynamic Slider */}
        <HeroSlider />

        {/* CATEGORIES - Bento Grid Style */}
        <section className={styles.categories}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionLabel}>Categorías</span>
              <h2 className={styles.sectionTitle}>
                Encuentra lo que <br />necesitas
              </h2>
            </div>

            <div className={styles.bentoGrid}>
              {categories.slice(0, 5).map((category, index) => (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${category.id}`}
                  className={`${styles.bentoCard} ${styles[`bento${index + 1}`]}`}
                >
                  <img
                    src={getCategoryImage(category.name)}
                    alt={category.name}
                    className={styles.bentoImage}
                  />
                  <div className={styles.bentoOverlay}></div>
                  <div className={styles.bentoContent}>
                    <span className={styles.bentoCount}>{category._count.products} productos</span>
                    <h3 className={styles.bentoTitle}>{category.name}</h3>
                    <div className={styles.bentoArrow}>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className={styles.featured}>
          <div className={styles.container}>
            <div className={styles.featuredHeader}>
              <div>
                <span className={styles.sectionLabel}>Novedades</span>
                <h2 className={styles.sectionTitle}>Productos destacados</h2>
              </div>
              <Link href="/productos" className={styles.viewAll}>
                Ver todos
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  wholesalePrice={product.wholesalePrice}
                  images={product.images}
                  category={product.category.name}
                  stock={product.stock}
                />
              ))}
            </div>
          </div>
        </section>

        {/* PROMO BANNER */}
        <section className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <div className={styles.promoText}>
              <span className={styles.promoLabel}>Oferta especial</span>
              <h2 className={styles.promoTitle}>
                15% OFF para mayoristas
              </h2>
              <p className={styles.promoDescription}>
                Regístrate como cliente mayorista y accede a precios exclusivos
                en todo nuestro catálogo.
              </p>
              <Link href="/registro?tipo=mayorista" className={styles.promoBtn}>
                Solicitar cuenta
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className={styles.promoVisual}>
              <div className={styles.promoCircle}>
                <span className={styles.promoPercent}>15%</span>
                <span className={styles.promoOff}>OFF</span>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className={styles.whyUs}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionLabel}>¿Por qué elegirnos?</span>
              <h2 className={styles.sectionTitle}>
                La mejor experiencia <br />de compra
              </h2>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Truck size={28} />
                </div>
                <h3>Envío Express</h3>
                <p>Entrega en 24-48 horas a cualquier parte del país. Seguimiento en tiempo real.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Shield size={28} />
                </div>
                <h3>Garantía Total</h3>
                <p>Todos nuestros productos tienen garantía. Si no estás satisfecho, te devolvemos tu dinero.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Star size={28} />
                </div>
                <h3>Calidad Premium</h3>
                <p>Trabajamos solo con las mejores marcas del mercado para ofrecerte productos duraderos.</p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Zap size={28} />
                </div>
                <h3>Precios Justos</h3>
                <p>Precios competitivos sin sacrificar calidad. Descuentos especiales para mayoristas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2>¿Listo para comenzar?</h2>
            <p>Explora nuestro catálogo completo y encuentra todo lo que necesitas</p>
            <Link href="/productos" className={styles.finalCtaBtn}>
              Ver productos
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
