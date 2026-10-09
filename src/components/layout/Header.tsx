import { useState } from 'react';
import { FiMenu, FiShoppingBag, FiX } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
export function Brand() { return <span className="brand">BRASA<span className="brand-number">73</span><small>BURGER & GRILL</small></span>; }
export function Header({ onCart }: {
    onCart: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { items } = useCart();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return <header className="site-header"><div className="container header-inner"><a href="#inicio" aria-label="BRASA 73, início"><Brand /></a><nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Principal" onKeyDown={e => { if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
    } }}>
    {[['inicio', 'Início'], ['cardapio', 'Cardápio'], ['sobre', 'Sobre'], ['localizacao', 'Localização']].map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}</a>)}
  </nav><div className="header-actions"><button className="button order-button" onClick={() => { setOpen(false); onCart(); }}><FiShoppingBag aria-hidden="true"/><span>Ver pedido</span>{count > 0 && <span className="count" aria-label={`${count} itens`}>{count}</span>}</button><button id="menu-toggle" className="icon-button mobile-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button></div></div></header>;
}
