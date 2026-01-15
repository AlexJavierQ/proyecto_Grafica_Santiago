import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Validar campos
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            )
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Verificar contraseña
        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Verificar estado del usuario
        if (user.status === 'INACTIVE') {
            return NextResponse.json(
                { error: 'Tu cuenta está desactivada. Contacta al administrador.' },
                { status: 403 }
            )
        }

        if (user.status === 'PENDING') {
            return NextResponse.json(
                { error: 'Tu cuenta está pendiente de aprobación.' },
                { status: 403 }
            )
        }

        if (user.status === 'REJECTED') {
            return NextResponse.json(
                { error: 'Tu solicitud fue rechazada. Contacta al administrador.' },
                { status: 403 }
            )
        }

        // Actualizar último login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        })

        // Generar token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Respuesta con cookie
        const response = NextResponse.json({
            message: 'Login exitoso',
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
            maxAge: 60 * 60 * 24 * 7, // 7 días
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Error en login:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
