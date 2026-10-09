import { FiArrowUpRight } from 'react-icons/fi';
import type { MenuItem } from '../../types/menu';
import { currency } from '../../utils/order';
import { ProductImage } from './ProductImage';
export function ProductCard({ product, onSelect }: {
    product: MenuItem;
    onSelect: (item: MenuItem) => void;
}) {
    return <article className="product-card"><div className="card-visual"><ProductImage product={product}/>{product.badges.map(badge => <span className="badge" key={badge}>{badge}</span>)}</div><div className="card-body"><h3>{product.name}</h3><p>{product.description}</p><div className="card-bottom"><strong>{currency(product.price)}</strong><button onClick={() => onSelect(product)} aria-label={`Ver detalhes de ${product.name}`}>Ver detalhes <FiArrowUpRight aria-hidden="true"/></button></div></div></article>;
}
