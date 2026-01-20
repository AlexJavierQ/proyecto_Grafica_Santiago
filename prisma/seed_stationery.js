const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seed: Iniciando actualización de datos de papelería...')

    // Limpiar productos existentes (opcional, pero mejor actualizar)
    // await prisma.product.deleteMany({})
    // await prisma.category.deleteMany({})

    // 1. Crear/Actualizar Categorías
    const categories = [
        { name: 'Escritura', description: 'Bolígrafos, lápices, correctores y más', order: 1 },
        { name: 'Papel y Cuadernos', description: 'Cuadernos, resmas de papel, notas adhesivas', order: 2 },
        { name: 'Oficina', description: 'Grapadoras, clips, organizadores y accesorios', order: 3 },
        { name: 'Arte y Escolar', description: 'Colores, témperas, pinceles y blocks', order: 4 },
        { name: 'Tecnología', description: 'Memorias USB, cables, periféricos básicos', order: 5 },
    ]

    const createdCategories = {}
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: cat,
            create: cat,
        })
        createdCategories[cat.name] = category.id
    }

    // 2. Definir Productos de Papelería
    const products = [
        {
            sku: 'PEN-001',
            name: 'Caja de Bolígrafos Kilométrico Azul (12 und)',
            description: 'Bolígrafos de punto medio, escritura suave y duradera.',
            price: 15000,
            wholesalePrice: 12500,
            stock: 100,
            categoryId: createdCategories['Escritura'],
            images: JSON.stringify(['/img/products/boligrafos.png'])
        },
        {
            sku: 'NOTE-001',
            name: 'Cuaderno Norma Click Cuadros 100 Hojas',
            description: 'Cuaderno argollado de alta calidad con carátula resistente.',
            price: 8500,
            wholesalePrice: 6800,
            stock: 250,
            categoryId: createdCategories['Papel y Cuadernos'],
            images: JSON.stringify(['/img/products/cuaderno.png'])
        },
        {
            sku: 'PENC-001',
            name: 'Caja Lápices Faber-Castell N2 (12 und)',
            description: 'Lápices de grafito de alta calidad, ideales para dibujo y escritura.',
            price: 12000,
            wholesalePrice: 9500,
            stock: 150,
            categoryId: createdCategories['Escritura'],
            images: JSON.stringify(['/img/products/boligrafos.png']) // Reusing boligrafos as generic writing if needed
        },
        {
            sku: 'OFF-001',
            name: 'Grapadora de Metal Oficio',
            description: 'Grapadora robusta para uso rudo en oficina, capacidad 25 hojas.',
            price: 25000,
            wholesalePrice: 19000,
            stock: 50,
            categoryId: createdCategories['Oficina'],
            images: JSON.stringify(['/img/products/resma.png']) // Placeholder while missing stapler
        },
        {
            sku: 'ART-001',
            name: 'Caja de Colores Prismacolor Junior x 24',
            description: 'Colores de mina suave y gran pigmentación para artistas escolares.',
            price: 35000,
            wholesalePrice: 28000,
            stock: 80,
            categoryId: createdCategories['Arte y Escolar'],
            images: JSON.stringify(['/img/products/colores.png'])
        },
        {
            sku: 'PAP-001',
            name: 'Resma de Papel Carta Reprograf (500 hojas)',
            description: 'Papel de alta blancura ideal para impresiones láser e inkjet.',
            price: 22000,
            wholesalePrice: 17500,
            stock: 300,
            categoryId: createdCategories['Papel y Cuadernos'],
            images: JSON.stringify(['/img/products/resma.png'])
        },
        {
            sku: 'ART-002',
            name: 'Kit de Témperas Franco Arte x 6 colores',
            description: 'Témperas no tóxicas con colores vibrantes para trabajos escolares.',
            price: 12000,
            wholesalePrice: 9000,
            stock: 120,
            categoryId: createdCategories['Arte y Escolar'],
            images: JSON.stringify(['/img/products/colores.png'])
        },
        {
            sku: 'OFF-002',
            name: 'Organizador de Escritorio de Malla Metalica',
            description: 'Organizador con compartimentos para bolígrafos, notas y clips.',
            price: 18000,
            wholesalePrice: 14500,
            stock: 40,
            categoryId: createdCategories['Oficina'],
            images: JSON.stringify(['/img/products/cuaderno.png'])
        }
    ]

    for (const prod of products) {
        await prisma.product.upsert({
            where: { sku: prod.sku },
            update: prod,
            create: prod,
        })
    }

    console.log('✅ Seed completado con éxito.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
