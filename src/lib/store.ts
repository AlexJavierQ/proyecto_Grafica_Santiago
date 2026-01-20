import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    maxStock: number
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === newItem.id)

                    if (existingItem) {
                        // Si ya existe, actualizamos cantidad sin pasar el stock máximo
                        const newQuantity = Math.min(
                            existingItem.quantity + newItem.quantity,
                            newItem.maxStock
                        )
                        return {
                            items: state.items.map((item) =>
                                item.id === newItem.id
                                    ? { ...item, quantity: newQuantity }
                                    : item
                            ),
                        }
                    }

                    return { items: [...state.items, newItem] }
                })
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }))
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                }))
            },

            clearCart: () => {
                set({ items: [] })
            },

            totalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },

            totalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },
        }),
        {
            name: 'grafica-santiago-cart', // nombre para localStorage
        }
    )
)
