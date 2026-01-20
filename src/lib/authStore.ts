import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: string
    email: string
    name: string
    role: 'cliente' | 'mayorista' | 'admin'
}

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    login: (user: User) => void
    logout: () => void
    isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (user) => {
                set({ user, isAuthenticated: true })
            },

            logout: () => {
                set({ user: null, isAuthenticated: false })
            },

            isAdmin: () => {
                return get().user?.role === 'admin'
            },
        }),
        {
            name: 'grafica-santiago-auth',
        }
    )
)
