const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const allowedSkus = [
        'PEN-001', 'NOTE-001', 'PENC-001', 'OFF-001',
        'ART-001', 'PAP-001', 'ART-002', 'OFF-002'
    ]

    const updated = await prisma.product.updateMany({
        where: {
            sku: {
                notIn: allowedSkus
            }
        },
        data: {
            isActive: false
        }
    })

    console.log(`✅ Actualización: Se desactivaron ${updated.count} productos no relacionados con papelería.`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
