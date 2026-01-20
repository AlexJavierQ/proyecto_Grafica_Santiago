import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

interface ProductRow {
    name: string
    sku: string
    description?: string
    price: number
    wholesalePrice?: number
    stock: number
    minStock?: number
    categoryName?: string
    images?: string
    isActive?: boolean
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
        }

        const text = await file.text()
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
            return NextResponse.json({ error: 'El archivo está vacío o no tiene datos' }, { status: 400 })
        }

        // Parse header
        const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))

        // Required columns
        const requiredColumns = ['name', 'sku', 'price', 'stock']
        const missingColumns = requiredColumns.filter(col => !header.includes(col))

        if (missingColumns.length > 0) {
            return NextResponse.json({
                error: `Columnas requeridas faltantes: ${missingColumns.join(', ')}`
            }, { status: 400 })
        }

        // Get all categories for mapping
        const categories = await prisma.category.findMany({
            select: { id: true, name: true }
        })
        const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]))

        // Default category (create or find)
        let defaultCategoryId = categories[0]?.id
        if (!defaultCategoryId) {
            const defaultCat = await prisma.category.create({
                data: { name: 'Sin Categoría', order: 999, isActive: true }
            })
            defaultCategoryId = defaultCat.id
        }

        const results = {
            success: 0,
            errors: [] as { row: number; error: string; data?: string }[],
            skipped: 0
        }

        // Process each row
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseCSVLine(lines[i])

                if (values.length < header.length) {
                    results.errors.push({ row: i + 1, error: 'Número de columnas incorrecto' })
                    continue
                }

                const rowData: Record<string, string> = {}
                header.forEach((col, idx) => {
                    rowData[col] = values[idx]?.trim() || ''
                })

                // Validate required fields
                if (!rowData.name || !rowData.sku || !rowData.price || !rowData.stock) {
                    results.errors.push({
                        row: i + 1,
                        error: 'Campos requeridos vacíos',
                        data: rowData.name || rowData.sku
                    })
                    continue
                }

                // Check if SKU already exists
                const existingProduct = await prisma.product.findFirst({
                    where: { sku: rowData.sku }
                })

                if (existingProduct) {
                    // Update existing product
                    await prisma.product.update({
                        where: { id: existingProduct.id },
                        data: {
                            name: rowData.name,
                            description: rowData.description || existingProduct.description,
                            price: parseFloat(rowData.price) || existingProduct.price,
                            wholesalePrice: rowData.wholesaleprice ? parseFloat(rowData.wholesaleprice) : existingProduct.wholesalePrice,
                            stock: parseInt(rowData.stock) ?? existingProduct.stock,
                            minStock: rowData.minstock ? parseInt(rowData.minstock) : existingProduct.minStock,
                            images: rowData.images || existingProduct.images,
                            isActive: rowData.isactive ? rowData.isactive.toLowerCase() === 'true' : existingProduct.isActive
                        }
                    })
                    results.success++
                } else {
                    // Find or use default category
                    let categoryId = defaultCategoryId
                    if (rowData.categoryname || rowData.category) {
                        const catName = (rowData.categoryname || rowData.category).toLowerCase()
                        categoryId = categoryMap.get(catName) || defaultCategoryId
                    }

                    // Create new product
                    await prisma.product.create({
                        data: {
                            name: rowData.name,
                            sku: rowData.sku,
                            description: rowData.description || '',
                            price: parseFloat(rowData.price) || 0,
                            wholesalePrice: rowData.wholesaleprice ? parseFloat(rowData.wholesaleprice) : null,
                            stock: parseInt(rowData.stock) || 0,
                            minStock: parseInt(rowData.minstock) || 5,
                            categoryId: categoryId,
                            images: rowData.images || '[]',
                            isActive: rowData.isactive ? rowData.isactive.toLowerCase() === 'true' : true
                        }
                    })
                    results.success++
                }
            } catch (err: any) {
                results.errors.push({
                    row: i + 1,
                    error: err.message || 'Error desconocido'
                })
            }
        }

        return NextResponse.json({
            message: `Importación completada: ${results.success} productos procesados`,
            results
        })
    } catch (error: any) {
        console.error('Import error:', error)
        return NextResponse.json({ error: error.message || 'Error al importar' }, { status: 500 })
    }
}

// Helper function to parse CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
        } else {
            current += char
        }
    }

    result.push(current.trim())
    return result
}

// GET - Get template info
export async function GET() {
    return NextResponse.json({
        template: {
            columns: ['name', 'sku', 'description', 'price', 'wholesalePrice', 'stock', 'minStock', 'categoryName', 'images', 'isActive'],
            required: ['name', 'sku', 'price', 'stock'],
            example: 'Cuaderno Universitario,PAP-001,Cuaderno de 100 hojas,2500,2000,50,10,Papelería,,true'
        }
    })
}
