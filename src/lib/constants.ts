// Roles de usuario
export const ROLES = {
    CUSTOMER: 'CUSTOMER',
    WHOLESALE: 'WHOLESALE',
    WAREHOUSE: 'WAREHOUSE',
    ADMIN: 'ADMIN',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

// Estados de usuario
export const USER_STATUS = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    REJECTED: 'REJECTED',
} as const

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS]

// Estados de orden
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
} as const

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

// Estados de pago
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
} as const

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]

// Tipos de movimiento de inventario
export const MOVEMENT_TYPES = {
    ENTRY: 'ENTRY',
    EXIT: 'EXIT',
    ADJUSTMENT: 'ADJUSTMENT',
    SALE: 'SALE',
    RETURN: 'RETURN',
} as const

export type MovementType = typeof MOVEMENT_TYPES[keyof typeof MOVEMENT_TYPES]

// Labels en español
export const ROLE_LABELS: Record<Role, string> = {
    CUSTOMER: 'Cliente',
    WHOLESALE: 'Mayorista',
    WAREHOUSE: 'Bodeguero',
    ADMIN: 'Administrador',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
    PENDING: 'Pendiente',
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    REJECTED: 'Rechazado',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    FAILED: 'Fallido',
    REFUNDED: 'Reembolsado',
}

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
    ENTRY: 'Entrada',
    EXIT: 'Salida',
    ADJUSTMENT: 'Ajuste',
    SALE: 'Venta',
    RETURN: 'Devolución',
}
