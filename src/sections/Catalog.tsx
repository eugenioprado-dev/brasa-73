import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { categories, menu } from '../data/menu';
import type { Category, MenuItem } from '../types/menu';
import { ProductCard } from '../components/menu/ProductCard';
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function Catalog({ onSelect }: {
    onSelect: (product: MenuItem) => void;
}) {
    const [category, setCategory] = useState<Category | 'Todos'>('Todos');
    const [search, setSearch] = useState('');
    const results = menu.filter(p => (category === 'Todos' || p.category === category) && normalize(`${p.name} ${p.description}`).includes(normalize(search.trim())));
    return <section id="cardapio" className="catalog section"><div className="container"><div className="section-heading"><div><span className="eyebrow">ESCOLHA. COMBINE. APROVEITE.</span><h2>O seu próximo favorito.</h2><p>Da primeira mordida ao último gole. Monte seu pedido.</p></div><label className="search"><FiSearch aria-hidden="true"/><span className="sr-only">Buscar no cardápio</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="O que vai ser hoje?"/></label></div><div className="filters" role="group" aria-label="Categorias do cardápio">{(['Todos', ...categories] as const).map(c => <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>{c}</button>)}</div><p className="result-count" role="status">{results.length} {results.length === 1 ? 'opção encontrada' : 'opções encontradas'}</p>{results.length ? <div className="product-grid">{results.map(product => <ProductCard key={product.id} product={product} onSelect={onSelect}/>)}</div> : <div className="no-results"><h3>Nada por aqui, por enquanto.</h3><p>Tente outro ingrediente, nome ou categoria.</p><button className="button secondary" onClick={() => { setSearch(''); setCategory('Todos'); }}>Limpar busca e filtros</button></div>}</div></section>;
}
