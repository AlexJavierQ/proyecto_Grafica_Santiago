import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react'
import styles from './page.module.css'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 8,
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

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Todo lo que necesitas para tu
              <span className={styles.heroHighlight}> oficina y escuela</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Encuentra la mejor variedad de productos de papelería, suministros de oficina
              y material escolar con los mejores precios del mercado.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/productos" className={styles.primaryButton}>
                Ver Catálogo
                <ArrowRight size={20} />
              </Link>
              <Link href="/registro" className={styles.secondaryButton}>
                Registrarse como Mayorista
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600"
              alt="Suministros de oficina"
            />
          </div>
        </section>

        {/* Features */}
        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.featureGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Truck />
                </div>
                <h3>Envío Rápido</h3>
                <p>Entrega a domicilio en 24-48 horas</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Shield />
                </div>
                <h3>Calidad Garantizada</h3>
                <p>Productos de las mejores marcas</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <CreditCard />
                </div>
                <h3>Pago Seguro</h3>
                <p>Múltiples métodos de pago</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Headphones />
                </div>
                <h3>Soporte 24/7</h3>
                <p>Atención al cliente todo el día</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className={styles.categories}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Explora por Categoría</h2>
              <Link href="/categorias" className={styles.seeAllLink}>
                Ver todas <ArrowRight size={18} />
              </Link>
            </div>
            <div className={styles.categoryGrid}>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${category.id}`}
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryIcon}>
                    📦
                  </div>
                  <h3>{category.name}</h3>
                  <span>{category._count.products} productos</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Productos Destacados */}
        <section className={styles.products}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Productos Destacados</h2>
              <Link href="/productos" className={styles.seeAllLink}>
                Ver todos <ArrowRight size={18} />
              </Link>
            </div>
            <div className={styles.productGrid}>
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

        {/* CTA Mayoristas */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2>¿Eres comerciante o distribuidor?</h2>
              <p>
                Regístrate como cliente mayorista y accede a precios especiales,
                descuentos por volumen y atención personalizada.
              </p>
              <Link href="/registro?tipo=mayorista" className={styles.ctaButton}>
                Solicitar cuenta mayorista
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
