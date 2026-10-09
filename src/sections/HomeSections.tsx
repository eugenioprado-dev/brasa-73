import { FiArrowRight, FiArrowUpRight, FiMapPin, FiClock } from 'react-icons/fi';
import { GiFlame } from 'react-icons/gi';
import { menu } from '../data/menu';
import type { MenuItem } from '../types/menu';
import { ProductImage } from '../components/menu/ProductImage';
import { ProductCard } from '../components/menu/ProductCard';
import { currency } from '../utils/order';
export function Hero({ onSelect }: {
    onSelect: (product: MenuItem) => void;
}) {
    return <><section className="hero" id="inicio"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow"><span className="ember-dot"/> FOGO. SABOR. ATITUDE.</span><h1>Burger de verdade.<br /><em>Feito na brasa.</em></h1><p>Pão macio. Brasa no ponto. Combinações que ficam na memória. Seu próximo burger começa aqui.</p><div className="hero-actions"><a className="button primary" href="#cardapio">Ver cardápio <FiArrowRight /></a><a className="text-link" href="#destaques">Montar meu pedido <FiArrowUpRight /></a></div><div className="hero-footnote"><GiFlame /><span>Feito com intenção.<br /><strong>Servido com atitude.</strong></span></div></div><div className="hero-visual"><span className="hero-outline" aria-hidden="true">BRASA</span><ProductImage product={menu[0]} eager illustrationOnly/><div className="round-stamp" aria-hidden="true">FOGO ALTO<br /><GiFlame /><br />SABOR INTENSO</div><button className="hero-product" onClick={() => onSelect(menu[0])}><span><small>CONHEÇA O NOSSO CLÁSSICO</small><strong>Brasa 73 <span>{currency(menu[0].price)}</span></strong></span><FiArrowUpRight /></button></div></div></section><div className="brand-strip" aria-hidden="true"><span>NA BRASA É OUTRA HISTÓRIA</span><GiFlame /><span>INGREDIENTES QUE COMBINAM</span><GiFlame /><span>SEM PRESSA NO SABOR</span></div></>;
}
export function Featured({ onSelect }: {
    onSelect: (product: MenuItem) => void;
}) {
    return <section id="destaques" className="section featured"><div className="container"><div className="section-heading"><div><span className="eyebrow">O FOGO COMEÇA AQUI</span><h2>Três motivos para voltar.</h2></div><a className="text-link" href="#cardapio">Explorar cardápio <FiArrowRight /></a></div><div className="featured-grid">{menu.filter(p => p.featured).map(p => <ProductCard key={p.id} product={p} onSelect={onSelect}/>)}</div></div></section>;
}
export function Manifesto() {
    return <section className="manifesto section" id="sobre"><div className="container manifesto-grid"><div className="fire-poster"><span>O NOSSO<br />INGREDIENTE<br />PRINCIPAL.</span><GiFlame aria-hidden="true"/><small>BRASA 73 — BURGER & GRILL</small></div><div><span className="eyebrow">A NOSSA ESSÊNCIA</span><h2>Não é só burger.<br />É fogo, textura<br />e sabor.</h2><p>O encontro da carne com a brasa. O contraste do pão macio com a crocância. O molho que amarra tudo. É nessa combinação que a BRASA 73 acontece.</p><p>Nossa proposta é simples: ingredientes bem escolhidos, preparo cuidadoso e espaço para você montar o seu favorito.</p><div className="manifesto-signature">Fogo na cozinha. Atitude à mesa.</div></div></div></section>;
}
export function Location() {
    return <section className="section location" id="localizacao"><div className="container location-grid"><div><span className="eyebrow">SEU PONTO DE ENCONTRO</span><h2>A noite pede brasa.</h2><p>Um burger, uma boa conversa e vontade de ficar.</p><div className="address"><FiMapPin /><div><h3>Rua da Brasa, 73</h3><p>São Paulo — SP</p><span className="demo-label">Endereço demonstrativo • negócio fictício</span></div></div></div><div className="hours"><h3><FiClock /> Horários da casa</h3><dl><div><dt>Terça a quinta</dt><dd>18h–23h</dd></div><div><dt>Sexta e sábado</dt><dd>18h–00h</dd></div><div><dt>Domingo</dt><dd>18h–23h</dd></div><div><dt>Segunda</dt><dd>Fechado</dd></div></dl><small>Horários ilustrativos para este projeto.</small></div></div></section>;
}
export function FinalCta() { return <section className="final-cta"><div className="container"><span className="eyebrow">A FOME NÃO ESPERA.</span><h2>Bora de Brasa?</h2><a href="#cardapio" className="button light">Montar meu pedido <FiArrowUpRight /></a></div></section>; }
