import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, name, phone, isWholesale, companyName, ruc } = body

        // Validaciones
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Nombre, email y contraseña son requeridos' },
                { status: 400 }
            )
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 8 caracteres' },
                { status: 400 }
            )
        }

        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 409 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = await hashPassword(password)

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                phone: phone || null,
                role: 'CUSTOMER',
                status: isWholesale ? 'PENDING' : 'ACTIVE',
                wholesaleRequested: isWholesale || false,
                companyName: isWholesale ? companyName : null,
                ruc: isWholesale ? ruc : null,
            },
        })

        // Si es mayorista, no hacer login automático
        if (isWholesale) {
            return NextResponse.json({
                message: 'Registro exitoso. Tu solicitud de cuenta mayorista está pendiente de aprobación.',
                requiresApproval: true,
            })
        }

        // Generar token para login automático
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        const response = NextResponse.json({
            message: 'Registro exitoso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })

        // Establecer cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Error en registro:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
