const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const products = await prisma.product.findMany({ take: 1 });
        console.log('Product example:', products[0]);

        // Test updateMany field availability via reflection-ish check or just try a small update
        console.log('Attempting to check fields via updateMany trial...');
        // We won't actually run it if we are afraid of corruption, but we just want to see if it throws or what it expects.
    } catch (e) {
        console.error('Prisma Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
