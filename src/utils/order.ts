import { menu } from '../data/menu';
import { DELIVERY_ESTIMATE } from '../config/site';
import type { CartItem } from '../types/menu';
export const currency = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const productFor = (item: CartItem) => menu.find(p => p.id === item.productId)!;
export const extrasFor = (item: CartItem) => productFor(item).extras.filter(e => item.extraIds.includes(e.id));
export const lineTotal = (item: CartItem) => (productFor(item).price + extrasFor(item).reduce((sum, e) => sum + e.price, 0)) * item.quantity;
export const orderTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + lineTotal(item), 0);
export const whatsappUrl = (number: string, items: CartItem[]) => /^\d{10,15}$/.test(number) && items.length > 0
    ? `https://wa.me/${number}?text=${encodeURIComponent(orderMessage(items))}`
    : null;
export const orderMessage = (items: CartItem[]) => `Olá! Gostaria de fazer este pedido na BRASA 73:\n\n${items.map(item => [
    `${item.quantity}x ${productFor(item).name}`,
    ...extrasFor(item).map(e => `- ${e.name}`),
    ...(item.note ? [`Obs: ${item.note}`] : []), currency(lineTotal(item)),
].join('\n')).join('\n\n')}\n\n----------------\nTotal: ${currency(orderTotal(items))}\n\n${DELIVERY_ESTIMATE}`;
export function restoreCart(raw: string | null): CartItem[] {
    try {
        const value: unknown = JSON.parse(raw ?? '[]');
        if (!Array.isArray(value))
            return [];
        return value.slice(0, 100).flatMap((entry: unknown) => {
            if (!entry || typeof entry !== 'object')
                return [];
            const e = entry as Record<string, unknown>;
            const product = menu.find(p => p.id === e.productId);
            if (!product || typeof e.key !== 'string' || typeof e.note !== 'string' || !Number.isInteger(e.quantity) || Number(e.quantity) < 1 || Number(e.quantity) > 99 || !Array.isArray(e.extraIds))
                return [];
            return [{ key: e.key, productId: product.id, note: e.note.slice(0, 300), quantity: Number(e.quantity), extraIds: product.extras.filter(extra => (e.extraIds as unknown[]).includes(extra.id)).map(extra => extra.id) }];
        }).filter((item, index, items) => items.findIndex(i => i.key === item.key) === index);
    }
    catch {
        return [];
    }
}
