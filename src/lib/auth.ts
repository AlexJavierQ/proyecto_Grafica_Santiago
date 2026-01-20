import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'grafica-santiago-secret-key-2024'

export interface JWTPayload {
    userId: string
    email: string
    role: string
}

// Hashear contraseña
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

// Verificar contraseña
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

// Generar token JWT
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch {
        return null
    }
}

// Obtener token de las cookies (para API routes)
export function getTokenFromCookies(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
    }, {} as Record<string, string>)
    return cookies['auth-token'] || null
}

// Obtener usuario actual (Server Components)
export async function getCurrentUser() {
    try {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')?.value

        if (!token) return null

        const payload = verifyToken(token)
        if (!payload) return null

        const prisma = (await import('./prisma')).default
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                wholesaleRequested: true,
                companyName: true,
                ruc: true,
                phone: true
            }
        })

        return user
    } catch (error) {
        console.error('Error in getCurrentUser:', error)
        return null
    }
}
