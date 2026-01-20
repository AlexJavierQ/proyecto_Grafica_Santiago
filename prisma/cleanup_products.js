const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clean() {
    const allowedSkus = [
        'PEN-001', 'NOTE-001', 'PENC-001', 'OFF-001',
        'ART-001', 'PAP-001', 'ART-002', 'OFF-002'
    ]

    const deleted = await prisma.product.deleteMany({
        where: {
            sku: {
                notIn: allowedSkus
            }
        }
    })

    console.log(`🧹 Limpieza: Se eliminaron ${deleted.count} productos antiguos.`)
}

clean()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
