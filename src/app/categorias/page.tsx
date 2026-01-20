import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import styles from './page.module.css'
import Image from 'next/image'

// Imágenes reales para cada categoría con keywords
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

async function getCategorias() {
    const categorias = await prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' }
    })
    return categorias
}

export default async function CategoriasPage() {
    const categorias = await getCategorias()

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Explora por Categoría</h1>
                        <p className={styles.subtitle}>
                            Encuentra todo lo que necesitas organizado para tu éxito diario.
                        </p>
                    </header>

                    <div className={styles.grid}>
                        {categorias.map((categoria, index) => (
                            <Link
                                href={`/productos?categoria=${categoria.id}`}
                                key={categoria.id}
                                className={styles.card}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={getCategoryImage(categoria.name)}
                                        alt={categoria.name}
                                        fill
                                        className={styles.image}
                                    />
                                    <div className={styles.overlay} />
                                </div>
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>{categoria.name}</h2>
                                    <div className={styles.meta}>
                                        <span className={styles.productCount}>
                                            {categoria._count.products} productos
                                        </span>
                                        <div className={styles.arrow}>→</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {categorias.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No hay categorías disponibles</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
