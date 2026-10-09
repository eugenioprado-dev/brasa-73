export type Category = 'Burgers' | 'Combos' | 'Porções' | 'Bebidas' | 'Sobremesas';
export interface Extra {
    id: string;
    name: string;
    price: number;
}
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image: string;
    badges: string[];
    featured: boolean;
    extras: Extra[];
}
export interface CartItem {
    key: string;
    productId: string;
    extraIds: string[];
    quantity: number;
    note: string;
}
