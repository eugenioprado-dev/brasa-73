import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProductDetails } from './components/menu/ProductDetails';
import { CartDrawer } from './components/cart/CartDrawer';
import { Catalog } from './sections/Catalog';
import { Featured, FinalCta, Hero, Location, Manifesto } from './sections/HomeSections';
import type { MenuItem } from './types/menu';
import './App.css';
export default function App() {
    const [selected, setSelected] = useState<MenuItem | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [notice, setNotice] = useState('');
    useEffect(() => { if (notice) {
        const timer = window.setTimeout(() => setNotice(''), 4000);
        return () => clearTimeout(timer);
    } }, [notice]);
    return <CartProvider><a className="skip-link" href="#cardapio">Pular para o cardápio</a><Header onCart={() => setCartOpen(true)}/><main><Hero onSelect={setSelected}/><Featured onSelect={setSelected}/><Catalog onSelect={setSelected}/><Manifesto /><Location /><FinalCta /></main><Footer />{selected && <ProductDetails key={selected.id} product={selected} onClose={() => setSelected(null)} onAdded={name => setNotice(`${name} adicionado ao pedido.`)}/>} {cartOpen && <CartDrawer onClose={() => setCartOpen(false)}/>}<div className={`toast ${notice ? 'visible' : ''}`} role="status" aria-live="polite">{notice}</div></CartProvider>;
}
