import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'

// GET - Listar todos los usuarios
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')?.toLowerCase()
        const role = searchParams.get('role')
        const status = searchParams.get('status')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = {}

        // SQLite compatible query (no 'mode: insensitive')
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ]
        }

        if (role) where.role = role
        if (status) where.status = status

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    companyName: true,
                    ruc: true,
                    wholesaleRequested: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count({ where })
        ])

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, name, phone, role, status, companyName, ruc } = body

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

        // Verificar email único
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
                role: role || 'CUSTOMER',
                status: status || 'ACTIVE',
                companyName: companyName || null,
                ruc: ruc || null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        console.error('Error al crear usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
