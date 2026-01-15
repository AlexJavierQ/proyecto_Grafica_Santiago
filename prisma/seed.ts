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

    const pendingWholesale = await prisma.user.create({
        data: {
            email: 'pendiente@empresa.com',
            password: hashedPassword,
            name: 'Pedro Solicitante',
            phone: '0945678901',
            role: 'CUSTOMER',
            status: 'PENDING',
            wholesaleRequested: true,
            companyName: 'Papelería La Luna',
            ruc: '0987654321001',
        },
    })

    console.log('👥 Usuarios creados')

    // Crear categorías
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Papelería',
                description: 'Artículos de papelería general: cuadernos, hojas, carpetas y más',
                order: 1,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Oficina',
                description: 'Suministros para oficina: grapadoras, perforadoras, clips',
                order: 2,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Escolar',
                description: 'Material escolar: colores, crayones, temperas, marcadores',
                order: 3,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Tecnología',
                description: 'Accesorios tecnológicos: calculadoras, USB, audífonos',
                order: 4,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Arte y Manualidades',
                description: 'Materiales para arte: lienzos, pinceles, pinturas acrílicas',
                order: 5,
            },
        }),
    ])

    console.log('📁 Categorías creadas')

    // Crear productos
    const products = [
        // Papelería
        { name: 'Cuaderno Universitario 100 hojas', description: 'Cuaderno universitario cuadriculado de 100 hojas, tapa dura', price: 2.50, wholesalePrice: 1.80, stock: 150, minStock: 20, categoryId: categories[0].id, sku: 'PAP-CU100', barcode: '7501234567890' },
        { name: 'Cuaderno Universitario 200 hojas', description: 'Cuaderno universitario cuadriculado de 200 hojas, tapa dura', price: 4.00, wholesalePrice: 3.00, stock: 100, minStock: 15, categoryId: categories[0].id, sku: 'PAP-CU200', barcode: '7501234567891' },
        { name: 'Resma de Papel A4 500 hojas', description: 'Resma de papel bond A4, 75g/m², ideal para impresión', price: 5.50, wholesalePrice: 4.20, stock: 200, minStock: 30, categoryId: categories[0].id, sku: 'PAP-RES500', barcode: '7501234567892' },
        { name: 'Folder Manila A4', description: 'Folder manila tamaño A4, paquete de 25 unidades', price: 3.00, wholesalePrice: 2.20, stock: 80, minStock: 10, categoryId: categories[0].id, sku: 'PAP-FOL25', barcode: '7501234567893' },
        { name: 'Sobre Manila Oficio', description: 'Sobre manila tamaño oficio, paquete de 50 unidades', price: 4.50, wholesalePrice: 3.50, stock: 60, minStock: 10, categoryId: categories[0].id, sku: 'PAP-SOB50', barcode: '7501234567894' },
        { name: 'Agenda 2024 Ejecutiva', description: 'Agenda ejecutiva 2024, tapa de cuero sintético', price: 12.00, wholesalePrice: 9.00, stock: 45, minStock: 10, categoryId: categories[0].id, sku: 'PAP-AGE24', barcode: '7501234567895' },
        { name: 'Libreta de Notas A5', description: 'Libreta de notas rayada, 80 hojas, tapa blanda', price: 1.50, wholesalePrice: 1.00, stock: 120, minStock: 20, categoryId: categories[0].id, sku: 'PAP-LIB80', barcode: '7501234567896' },
        { name: 'Post-it Colores Neon', description: 'Block de notas adhesivas, 100 hojas, colores neón', price: 2.00, wholesalePrice: 1.50, stock: 90, minStock: 15, categoryId: categories[0].id, sku: 'PAP-POST', barcode: '7501234567897' },

        // Oficina
        { name: 'Grapadora Metálica', description: 'Grapadora de metal resistente, capacidad 25 hojas', price: 6.00, wholesalePrice: 4.50, stock: 40, minStock: 8, categoryId: categories[1].id, sku: 'OFI-GRAP', barcode: '7502234567890' },
        { name: 'Perforadora 2 Huecos', description: 'Perforadora de 2 huecos, capacidad 20 hojas', price: 5.00, wholesalePrice: 3.80, stock: 35, minStock: 8, categoryId: categories[1].id, sku: 'OFI-PERF', barcode: '7502234567891' },
        { name: 'Caja de Clips Metálicos', description: 'Caja de 100 clips metálicos tamaño estándar', price: 1.00, wholesalePrice: 0.70, stock: 150, minStock: 25, categoryId: categories[1].id, sku: 'OFI-CLIP', barcode: '7502234567892' },
        { name: 'Cinta Adhesiva Transparente', description: 'Cinta adhesiva transparente 18mm x 50m', price: 1.20, wholesalePrice: 0.85, stock: 100, minStock: 20, categoryId: categories[1].id, sku: 'OFI-CINT', barcode: '7502234567893' },
        { name: 'Tijeras de Oficina', description: 'Tijeras de acero inoxidable, mango ergonómico', price: 3.50, wholesalePrice: 2.50, stock: 55, minStock: 10, categoryId: categories[1].id, sku: 'OFI-TIJ', barcode: '7502234567894' },
        { name: 'Dispensador de Cinta', description: 'Dispensador de cinta adhesiva de escritorio', price: 4.00, wholesalePrice: 3.00, stock: 30, minStock: 5, categoryId: categories[1].id, sku: 'OFI-DISP', barcode: '7502234567895' },
        { name: 'Organizador de Escritorio', description: 'Organizador de plástico con 5 compartimentos', price: 8.00, wholesalePrice: 6.00, stock: 25, minStock: 5, categoryId: categories[1].id, sku: 'OFI-ORG', barcode: '7502234567896' },
        { name: 'Sacagrapas Metálico', description: 'Sacagrapas de metal resistente', price: 1.50, wholesalePrice: 1.00, stock: 70, minStock: 15, categoryId: categories[1].id, sku: 'OFI-SACA', barcode: '7502234567897' },

        // Escolar
        { name: 'Caja de Colores x12', description: 'Caja de 12 colores de madera de alta calidad', price: 3.00, wholesalePrice: 2.20, stock: 80, minStock: 15, categoryId: categories[2].id, sku: 'ESC-COL12', barcode: '7503234567890' },
        { name: 'Caja de Colores x24', description: 'Caja de 24 colores de madera profesionales', price: 5.50, wholesalePrice: 4.00, stock: 60, minStock: 12, categoryId: categories[2].id, sku: 'ESC-COL24', barcode: '7503234567891' },
        { name: 'Crayones x12', description: 'Caja de 12 crayones de cera no tóxicos', price: 2.00, wholesalePrice: 1.40, stock: 100, minStock: 20, categoryId: categories[2].id, sku: 'ESC-CRAY', barcode: '7503234567892' },
        { name: 'Témperas x6', description: 'Set de 6 témperas lavables, colores básicos', price: 4.00, wholesalePrice: 3.00, stock: 50, minStock: 10, categoryId: categories[2].id, sku: 'ESC-TEMP', barcode: '7503234567893' },
        { name: 'Marcadores Punta Fina x10', description: 'Set de 10 marcadores punta fina, colores variados', price: 4.50, wholesalePrice: 3.30, stock: 65, minStock: 12, categoryId: categories[2].id, sku: 'ESC-MARC', barcode: '7503234567894' },
        { name: 'Lápiz HB Caja x12', description: 'Caja de 12 lápices HB con borrador', price: 2.50, wholesalePrice: 1.80, stock: 120, minStock: 25, categoryId: categories[2].id, sku: 'ESC-LAP12', barcode: '7503234567895' },
        { name: 'Borrador Blanco Grande', description: 'Borrador de goma blanca, no mancha', price: 0.50, wholesalePrice: 0.30, stock: 200, minStock: 40, categoryId: categories[2].id, sku: 'ESC-BOR', barcode: '7503234567896' },
        { name: 'Sacapuntas Metálico', description: 'Sacapuntas de metal con depósito', price: 0.75, wholesalePrice: 0.50, stock: 150, minStock: 30, categoryId: categories[2].id, sku: 'ESC-SAC', barcode: '7503234567897' },

        // Tecnología
        { name: 'Calculadora Científica', description: 'Calculadora científica 240 funciones', price: 15.00, wholesalePrice: 11.00, stock: 30, minStock: 5, categoryId: categories[3].id, sku: 'TEC-CALC', barcode: '7504234567890' },
        { name: 'Calculadora Básica', description: 'Calculadora de escritorio 12 dígitos', price: 8.00, wholesalePrice: 6.00, stock: 45, minStock: 8, categoryId: categories[3].id, sku: 'TEC-CALB', barcode: '7504234567891' },
        { name: 'Memoria USB 16GB', description: 'Memoria USB 2.0 de 16GB', price: 7.00, wholesalePrice: 5.00, stock: 50, minStock: 10, categoryId: categories[3].id, sku: 'TEC-USB16', barcode: '7504234567892' },
        { name: 'Memoria USB 32GB', description: 'Memoria USB 3.0 de 32GB', price: 10.00, wholesalePrice: 7.50, stock: 40, minStock: 8, categoryId: categories[3].id, sku: 'TEC-USB32', barcode: '7504234567893' },
        { name: 'Mouse Óptico USB', description: 'Mouse óptico USB, 1000 DPI', price: 6.00, wholesalePrice: 4.50, stock: 35, minStock: 7, categoryId: categories[3].id, sku: 'TEC-MOUS', barcode: '7504234567894' },
        { name: 'Teclado USB Español', description: 'Teclado USB layout español, silencioso', price: 12.00, wholesalePrice: 9.00, stock: 25, minStock: 5, categoryId: categories[3].id, sku: 'TEC-TECL', barcode: '7504234567895' },
        { name: 'Audífonos Básicos', description: 'Audífonos con micrófono, cable 1.5m', price: 5.00, wholesalePrice: 3.50, stock: 55, minStock: 10, categoryId: categories[3].id, sku: 'TEC-AUD', barcode: '7504234567896' },
        { name: 'Pad Mouse con Gel', description: 'Pad para mouse con reposamuñecas de gel', price: 8.00, wholesalePrice: 6.00, stock: 30, minStock: 5, categoryId: categories[3].id, sku: 'TEC-PAD', barcode: '7504234567897' },

        // Arte y Manualidades
        { name: 'Lienzo 30x40cm', description: 'Lienzo para pintura acrílica/óleo 30x40cm', price: 6.00, wholesalePrice: 4.50, stock: 40, minStock: 8, categoryId: categories[4].id, sku: 'ART-LIE30', barcode: '7505234567890' },
        { name: 'Lienzo 50x60cm', description: 'Lienzo para pintura acrílica/óleo 50x60cm', price: 10.00, wholesalePrice: 7.50, stock: 25, minStock: 5, categoryId: categories[4].id, sku: 'ART-LIE50', barcode: '7505234567891' },
        { name: 'Set Pinceles x10', description: 'Set de 10 pinceles variados para acrílico', price: 8.00, wholesalePrice: 6.00, stock: 35, minStock: 7, categoryId: categories[4].id, sku: 'ART-PINC', barcode: '7505234567892' },
        { name: 'Pintura Acrílica Set x6', description: 'Set de 6 pinturas acrílicas colores básicos', price: 12.00, wholesalePrice: 9.00, stock: 30, minStock: 6, categoryId: categories[4].id, sku: 'ART-ACRI', barcode: '7505234567893' },
        { name: 'Paleta de Mezcla', description: 'Paleta de plástico para mezclar pinturas', price: 3.00, wholesalePrice: 2.00, stock: 45, minStock: 8, categoryId: categories[4].id, sku: 'ART-PAL', barcode: '7505234567894' },
        { name: 'Goma Eva Colores x10', description: 'Pack de 10 láminas de goma eva, colores surtidos', price: 4.00, wholesalePrice: 3.00, stock: 60, minStock: 12, categoryId: categories[4].id, sku: 'ART-GOMA', barcode: '7505234567895' },
        { name: 'Silicona Líquida 250ml', description: 'Silicona líquida para manualidades', price: 3.50, wholesalePrice: 2.50, stock: 50, minStock: 10, categoryId: categories[4].id, sku: 'ART-SILI', barcode: '7505234567896' },
        { name: 'Escarcha Set x6', description: 'Set de 6 frascos de escarcha, colores variados', price: 5.00, wholesalePrice: 3.80, stock: 40, minStock: 8, categoryId: categories[4].id, sku: 'ART-ESC', barcode: '7505234567897' },
    ]

    for (const product of products) {
        await prisma.product.create({ data: product })
    }

    console.log(`📦 ${products.length} productos creados`)

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
    console.log('📊 Resumen de datos creados:')
    console.log(`   👥 Usuarios: 5`)
    console.log(`   📁 Categorías: ${categories.length}`)
    console.log(`   📦 Productos: ${products.length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🔑 Credenciales de acceso:')
    console.log('   Admin:     admin@graficasantiago.com / password123')
    console.log('   Bodeguero: bodega@graficasantiago.com / password123')
    console.log('   Cliente:   cliente@email.com / password123')
    console.log('   Mayorista: mayorista@empresa.com / password123')
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
