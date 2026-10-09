import { createContext, useContext } from 'react';
import type { CartItem } from '../types/menu';
export interface CartContextValue {
    items: CartItem[];
    storageError: boolean;
    add: (item: Omit<CartItem, 'key'>) => void;
    setQuantity: (key: string, quantity: number) => void;
    remove: (key: string) => void;
}
export const CartContext = createContext<CartContextValue | null>(null);
export function useCart() {
    const context = useContext(CartContext);
    if (!context)
        throw new Error('CartProvider ausente');
    return context;
}
