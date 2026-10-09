import { useState, type ReactNode } from 'react';
import type { CartItem } from '../types/menu';
import { site } from '../config/site';
import { restoreCart } from '../utils/order';
import { CartContext, type CartContextValue } from '../hooks/useCart';
export function CartProvider({ children }: {
    children: ReactNode;
}) {
    const [storageError, setStorageError] = useState(false);
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            return restoreCart(localStorage.getItem(site.storageKey));
        }
        catch {
            return [];
        }
    });
    function update(next: CartItem[]) {
        setItems(next);
        try {
            localStorage.setItem(site.storageKey, JSON.stringify(next));
            setStorageError(false);
        }
        catch {
            setStorageError(true);
        }
    }
    const add: CartContextValue['add'] = item => update([...items, { ...item, key: crypto.randomUUID() }]);
    const setQuantity = (key: string, quantity: number) => update(items.map(item => item.key === key ? { ...item, quantity: Math.min(99, Math.max(1, quantity)) } : item));
    const remove = (key: string) => update(items.filter(item => item.key !== key));
    return <CartContext.Provider value={{ items, storageError, add, setQuantity, remove }}>{children}</CartContext.Provider>;
}
