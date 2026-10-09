import { useState } from 'react';
import type { MenuItem } from '../../types/menu';
import { useCart } from '../../hooks/useCart';
import { currency } from '../../utils/order';
import { Overlay } from '../ui/Overlay';
import { Quantity } from '../ui/Quantity';
import { ProductImage } from './ProductImage';
export function ProductDetails({ product, onClose, onAdded }: {
    product: MenuItem;
    onClose: () => void;
    onAdded: (name: string) => void;
}) {
    const [extraIds, setExtraIds] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');
    const { add } = useCart();
    const total = (product.price + product.extras.filter(e => extraIds.includes(e.id)).reduce((sum, e) => sum + e.price, 0)) * quantity;
    return <Overlay title="Do seu jeito" onClose={onClose} className="product-modal"><div className="details-grid"><ProductImage product={product} eager/><div className="details-content"><span className="eyebrow">{product.category}</span><h2>{product.name}</h2><p>{product.description}</p><strong className="base-price">{currency(product.price)}</strong>
    {product.extras.length > 0 && <fieldset><legend>Um toque a mais <span>Opcional</span></legend>{product.extras.map(extra => <label className="extra" key={extra.id}><input type="checkbox" checked={extraIds.includes(extra.id)} onChange={e => setExtraIds(current => e.target.checked ? [...current, extra.id] : current.filter(id => id !== extra.id))}/><span>{extra.name}</span><strong>+ {currency(extra.price)}</strong></label>)}</fieldset>}
    <label className="note-label" htmlFor="product-note">Alguma observação? <span>Opcional</span></label><textarea id="product-note" placeholder="Ex.: sem cebola" maxLength={300} value={note} onChange={e => setNote(e.target.value)}/><small>{note.length}/300 caracteres</small>
    <div className="add-row"><Quantity name={product.name} value={quantity} onChange={setQuantity}/><strong aria-live="polite">{currency(total)}</strong></div><button className="button primary full" onClick={() => { add({ productId: product.id, extraIds, quantity, note: note.trim() }); onClose(); onAdded(product.name); }}>Adicionar ao pedido</button>
  </div></div></Overlay>;
}
