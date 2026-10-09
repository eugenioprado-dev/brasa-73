import type { Category, Extra, MenuItem } from '../types/menu';
export const categories: Category[] = ['Burgers', 'Combos', 'Porções', 'Bebidas', 'Sobremesas'];
// Photos are bundled only when present; missing photographs cause no 404 requests.
const photos = import.meta.glob<string>('../assets/menu/*.{avif,webp,jpg,jpeg,png}', {
    eager: true,
    query: '?url',
    import: 'default',
});
const photoFormats = ['avif', 'webp', 'jpg', 'jpeg', 'png'] as const;
export function photoFor(id: string, available: Record<string, string> = photos): string | undefined {
    return photoFormats.map(format => available[`../assets/menu/${id}.${format}`]).find(Boolean);
}
export const illustrationFor = (category: Category) => `${import.meta.env.BASE_URL}images/${({ Burgers: 'burger', Combos: 'combo', Porções: 'fries', Bebidas: 'drink', Sobremesas: 'dessert' })[category]}.svg`;
const burgerExtras: Extra[] = [
    { id: 'bacon', name: 'Bacon extra', price: 400 },
    { id: 'cheddar', name: 'Cheddar extra', price: 350 },
    { id: 'meat', name: 'Carne extra', price: 900 },
    { id: 'onion', name: 'Cebola caramelizada', price: 300 },
];
const create = (id: string, name: string, description: string, price: number, category: Category, badges: string[] = [], featured = false): MenuItem => ({
    id, name, description, price, category, badges, featured,
    image: photoFor(id) ?? illustrationFor(category),
    extras: category === 'Burgers' || category === 'Combos' ? (id === 'green-fire' ? burgerExtras.filter(e => ['cheddar', 'onion'].includes(e.id)) : burgerExtras) : [],
});
export const menu: MenuItem[] = [
    create('brasa-73', 'Brasa 73', 'Blend bovino de 180 g, queijo prato, cebola caramelizada e maionese da casa no pão brioche.', 3290, 'Burgers', [], true),
    create('smoke-house', 'Smoke House', 'Blend bovino de 180 g, bacon crocante, cheddar e barbecue defumado no brioche.', 3690, 'Burgers', [], true),
    create('bacon-melt', 'Bacon Melt', 'Blend bovino de 180 g, dupla camada de queijo, bacon e maionese de alho.', 3590, 'Burgers'),
    create('duplo-fogo', 'Duplo Fogo', 'Dois blends de 150 g, cheddar, picles e molho levemente picante no brioche.', 4290, 'Burgers', ['Novidade'], true),
    create('bbq-crunch', 'BBQ Crunch', 'Blend bovino de 180 g, onion rings, queijo prato e barbecue da casa.', 3690, 'Burgers'),
    create('cheddar-onion', 'Cheddar & Onion', 'Blend bovino de 180 g, cheddar cremoso e cebola dourada na chapa.', 3390, 'Burgers'),
    create('green-fire', 'Green Fire', 'Burger de grão-de-bico, queijo, folhas, tomate e maionese de ervas no brioche.', 3190, 'Burgers', ['Vegetariano']),
    create('combo-brasa', 'Combo Brasa', 'Brasa 73, fritas individuais e refrigerante de cola em lata de 350 ml.', 4790, 'Combos'),
    create('combo-duplo', 'Combo Duplo', 'Duplo Fogo, fritas individuais e refrigerante de cola em lata de 350 ml.', 5790, 'Combos'),
    create('combo-smoke', 'Combo Smoke', 'Smoke House, fritas individuais e refrigerante de cola em lata de 350 ml.', 5190, 'Combos'),
    create('fritas-casa', 'Fritas da Casa', 'Batatas douradas e crocantes com sal de ervas. Porção individual de 150 g.', 1490, 'Porções'),
    create('fritas-cheddar', 'Fritas Cheddar & Bacon', 'Batatas crocantes cobertas com cheddar cremoso e bacon. Porção de 250 g.', 2490, 'Porções'),
    create('onion-rings', 'Onion Rings', 'Anéis de cebola empanados, acompanhados de barbecue. Porção de 180 g.', 1990, 'Porções'),
    create('refrigerante', 'Refrigerante', 'Refrigerante de cola bem gelado. Lata de 350 ml.', 690, 'Bebidas'),
    create('cha-gelado', 'Chá gelado da casa', 'Chá preto com limão, gelo e um toque de hortelã. Copo de 400 ml.', 990, 'Bebidas'),
    create('limonada', 'Limonada artesanal', 'Limão espremido, água e gelo. Frescor para acompanhar a brasa. Copo de 400 ml.', 1190, 'Bebidas'),
    create('brownie', 'Brownie na Brasa', 'Brownie de chocolate servido quentinho com sorvete de baunilha.', 1890, 'Sobremesas'),
    create('milkshake', 'Milkshake de chocolate', 'Sorvete de chocolate batido com leite e calda de chocolate. Copo de 400 ml.', 1990, 'Sobremesas'),
];
