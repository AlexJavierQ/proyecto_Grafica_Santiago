import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...')

    // Limpiar datos existentes
    await prisma.inventoryMovement.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.address.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Base de datos limpiada')

    // Crear usuarios
    const hashedPassword = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'admin@graficasantiago.com',
            password: hashedPassword,
            name: 'Administrador',
            phone: '0987654321',
            role: 'ADMIN',
            status: 'ACTIVE',
        },
    })

    const warehouse = await prisma.user.create({
        data: {
            email: 'bodega@graficasantiago.com',
            password: hashedPassword,
            name: 'Carlos Bodeguero',
            phone: '0923456789',
            role: 'WAREHOUSE',
            status: 'ACTIVE',
        },
    })

    const customer = await prisma.user.create({
        data: {
            email: 'cliente@email.com',
            password: hashedPassword,
            name: 'María García',
            phone: '0912345678',
            role: 'CUSTOMER',
            status: 'ACTIVE',
        },
    })

    const wholesale = await prisma.user.create({
        data: {
            email: 'mayorista@empresa.com',
            password: hashedPassword,
            name: 'Juan Empresario',
            phone: '0934567890',
            role: 'WHOLESALE',
            status: 'ACTIVE',
            companyName: 'Distribuidora El Sol',
            ruc: '1234567890001',
        },
    })

    console.log('👥 Usuarios creados')

    // Imágenes de Categorías (Realistas de Papelería)
    const catImg = {
        papeleria: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&auto=format&fit=crop', // Papelería variada
        oficina: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop', // Oficina limpia
        escolar: 'https://images.unsplash.com/photo-1459342274691-753bc4c71ef9?q=80&w=800&auto=format&fit=crop', // Útiles escolares
        tecnologia: 'https://images.unsplash.com/photo-1531297461136-82lw85d79118?q=80&w=800&auto=format&fit=crop', // Gadgets oficina
        arte: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop' // Material de arte
    }

    // Crear categorías con imágenes
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Papelería General',
                description: 'Cuadernos, libretas, hojas y todo tipo de papel.',
                image: catImg.papeleria,
                order: 1,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Artículos de Oficina',
                description: 'Organización, grapadoras, archivadores y accesorios.',
                image: catImg.oficina,
                order: 2,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Útiles Escolares',
                description: 'Todo para el regreso a clases: lápices, colores, mochilas.',
                image: catImg.escolar,
                order: 3,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Tecnología y Accesorios',
                description: 'Memorias, calculadoras y periféricos.',
                image: catImg.tecnologia,
                order: 4,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Arte y Diseño',
                description: 'Para los más creativos: pinturas, lienzos y pinceles.',
                image: catImg.arte,
                order: 5,
            },
        }),
    ])

    console.log('📁 Categorías creadas')

    // Imágenes de productos (Específicas)
    const img = {
        cuaderno1: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop',
        cuaderno2: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop',
        resma: 'https://http2.mlstatic.com/D_NQ_NP_965007-MEC46698993211_072021-O.webp', // Placeholder genérico blanco si no carga unsplash
        resma_real: 'https://images.unsplash.com/photo-1626154972771-41710b146429?w=500&auto=format&fit=crop', // Pila de papel
        lapices: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&auto=format&fit=crop',
        boligrafos: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&auto=format&fit=crop', // Bolígrafos variados
        colores: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&auto=format&fit=crop',
        tijeras: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=500&auto=format&fit=crop',
        grapadora: 'https://plus.unsplash.com/premium_photo-1681488107567-c29929acc811?w=500&auto=format&fit=crop',
        calculadora: 'https://images.unsplash.com/photo-1594639962283-e02bf09540c4?w=500&auto=format&fit=crop',
        folder: 'https://images.unsplash.com/photo-1616499615673-924110429962?w=500&auto=format&fit=crop',
        pinturas: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=500&auto=format&fit=crop',
        pinceles: 'https://images.unsplash.com/photo-1572911966276-247594960d70?w=500&auto=format&fit=crop',
        mochila: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop',
        usb: 'https://images.unsplash.com/photo-1623949981881-3815f671e0e5?w=500&auto=format&fit=crop',
    }

    // Crear productos
    const products = [
        // 1. Papelería General
        {
            name: 'Cuaderno Universitario Norma 100 Hojas',
            description: 'Cuaderno universitario de cuadros, tapa dura resistente. Diseños variados. Ideal para estudiantes.',
            price: 2.75, wholesalePrice: 2.10, stock: 200, categoryId: categories[0].id, sku: 'PAP-001',
            images: JSON.stringify([img.cuaderno1])
        },
        {
            name: 'Resma Papel Bond A4 75g (500 hojas)',
            description: 'Papel bond blanco de alta blancura. Ideal para copias e impresiones láser o inyección.',
            price: 5.50, wholesalePrice: 4.50, stock: 500, categoryId: categories[0].id, sku: 'PAP-002',
            images: JSON.stringify([img.resma_real])
        },
        {
            name: 'Libreta de Notas Ejecutiva A5',
            description: 'Libreta elegante con elástico y cinta separadora. Hojas color crema.',
            price: 4.50, wholesalePrice: 3.25, stock: 80, categoryId: categories[0].id, sku: 'PAP-003',
            images: JSON.stringify([img.cuaderno2])
        },
        {
            name: 'Block de Dibujo A3',
            description: 'Cartulina blanca de 180g. Ideal para dibujo técnico y artístico.',
            price: 3.00, wholesalePrice: 2.20, stock: 100, categoryId: categories[0].id, sku: 'PAP-004',
            images: JSON.stringify([img.cuaderno2]) // Reusing generic notebook/paper image
        },

        // 2. Artículos de Oficina
        {
            name: 'Grapadora Metálica Industrial',
            description: 'Grapadora de alto rendimiento, capacidad de hasta 50 hojas. Estructura 100% metálica.',
            price: 8.50, wholesalePrice: 6.50, stock: 40, categoryId: categories[1].id, sku: 'OFI-001',
            images: JSON.stringify([img.grapadora])
        },
        {
            name: 'Archivador A-Z Lomo Ancho',
            description: 'Archivador de palanca con lomo ancho para máxima capacidad. Color negro jaspeado.',
            price: 3.25, wholesalePrice: 2.50, stock: 120, categoryId: categories[1].id, sku: 'OFI-002',
            images: JSON.stringify([img.folder])
        },
        {
            name: 'Set de Tijeras Oficina 8"',
            description: 'Tijeras de acero inoxidable con mango ergonómico soft-grip.',
            price: 2.50, wholesalePrice: 1.80, stock: 60, categoryId: categories[1].id, sku: 'OFI-003',
            images: JSON.stringify([img.tijeras])
        },
        {
            name: 'Perforadora 2 Huecos Grande',
            description: 'Perforadora metálica resistente con guía de papel.',
            price: 6.00, wholesalePrice: 4.50, stock: 45, categoryId: categories[1].id, sku: 'OFI-004',
            images: JSON.stringify([img.grapadora]) // Similar category image
        },

        // 3. Útiles Escolares
        {
            name: 'Caja de Colores Norma x24',
            description: 'Colores de madera premium, minas resistentes de 4mm. Colores vivos y mezclables.',
            price: 6.50, wholesalePrice: 5.00, stock: 150, categoryId: categories[2].id, sku: 'ESC-001',
            images: JSON.stringify([img.colores])
        },
        {
            name: 'Juego Geométrico Flexible',
            description: 'Regla, escuadras y graduador en material flexible irrompible. Ideal para niños.',
            price: 2.00, wholesalePrice: 1.40, stock: 200, categoryId: categories[2].id, sku: 'ESC-002',
            images: JSON.stringify([img.tijeras]) // Placeholder geometry
        },
        {
            name: 'Mochila Escolar Básica',
            description: 'Mochila resistente de poliéster, doble compartimento y bolsillo para botella.',
            price: 18.00, wholesalePrice: 14.00, stock: 30, categoryId: categories[2].id, sku: 'ESC-003',
            images: JSON.stringify([img.mochila])
        },
        {
            name: 'Caja de Lápices HB x12',
            description: 'Lápices de grafito hexagonal tradicionales. Escritura suave y negro intenso.',
            price: 2.50, wholesalePrice: 1.80, stock: 300, categoryId: categories[2].id, sku: 'ESC-004',
            images: JSON.stringify([img.lapices])
        },

        // 4. Tecnología
        {
            name: 'Calculadora Científica Casio-Style',
            description: '240 funciones, pantalla de 2 líneas. Ideal para estudiantes de secundaria y universidad.',
            price: 15.00, wholesalePrice: 12.00, stock: 50, categoryId: categories[3].id, sku: 'TEC-001',
            images: JSON.stringify([img.calculadora])
        },
        {
            name: 'Memoria USB 32GB Metal',
            description: 'Pendrive metálico resistente al agua y golpes. Velocidad 2.0.',
            price: 8.00, wholesalePrice: 6.00, stock: 80, categoryId: categories[3].id, sku: 'TEC-002',
            images: JSON.stringify([img.usb])
        },

        // 5. Arte
        {
            name: 'Set de Pinturas Acrílicas x12',
            description: 'Tubos de 12ml con colores brillantes y alta cobertura.',
            price: 9.00, wholesalePrice: 7.00, stock: 60, categoryId: categories[4].id, sku: 'ART-001',
            images: JSON.stringify([img.pinturas])
        },
        {
            name: 'Set de Pinceles Profesionales',
            description: '10 pinceles de diferentes puntas (plana, redonda, lengua de gato). Pelo sintético.',
            price: 7.50, wholesalePrice: 5.50, stock: 50, categoryId: categories[4].id, sku: 'ART-002',
            images: JSON.stringify([img.pinceles])
        },
    ]

    for (const product of products) {
        await prisma.product.create({ data: product })
    }

    console.log(`📦 ${products.length} productos creados con imágenes realistas`)

    // Crear dirección para cliente
    await prisma.address.create({
        data: {
            userId: customer.id,
            name: 'María García',
            phone: '0912345678',
            address: 'Av. 10 de Agosto N25-45',
            city: 'Quito',
            province: 'Pichincha',
            postalCode: '170150',
            isDefault: true,
        },
    })

    console.log('📍 Direcciones creadas')

    // Resumen
    console.log('\n✅ Seed completado exitosamente!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   🔑 Admin: admin@graficasantiago.com / password123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
    .catch((e) => {
        console.error('❌ Error en el seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
