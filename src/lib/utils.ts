// Formatear precio en USD
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
    }).format(price)
}

// Formatear fecha
export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

// Formatear fecha y hora
export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

// Generar SKU único
export function generateSKU(categoryPrefix: string): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `${categoryPrefix}-${timestamp}-${random}`
}

// Generar número de orden
export function generateOrderNumber(): string {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `GS-${year}${month}${day}-${random}`
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

// Slug para URLs amigables
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

// Parsear imágenes JSON
export function parseImages(imagesJson: string): string[] {
    try {
        return JSON.parse(imagesJson)
    } catch {
        return []
    }
}

// Stringify imágenes a JSON
export function stringifyImages(images: string[]): string {
    return JSON.stringify(images)
}

// Calcular descuento porcentual
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

// Validar email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Generar colores para gráficos
export function getChartColors(): string[] {
    return [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // amber
        '#ef4444', // red
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#84cc16', // lime
    ]
}
