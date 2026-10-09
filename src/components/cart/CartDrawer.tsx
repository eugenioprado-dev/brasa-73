import { useState } from 'react';
import { FiShoppingBag, FiTrash2, FiCopy } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { site } from '../../config/site';
import { currency, extrasFor, lineTotal, orderMessage, orderTotal, productFor, whatsappUrl } from '../../utils/order';
import { Overlay } from '../ui/Overlay';
import { Quantity } from '../ui/Quantity';
export function CartDrawer({ onClose }: {
    onClose: () => void;
}) {
    const { items, setQuantity, remove, storageError } = useCart();
    const [review, setReview] = useState(false);
    const [feedback, setFeedback] = useState('');
    const message = orderMessage(items);
    const configured = whatsappUrl(site.whatsappNumber, items);
    async function copy() {
        try {
            await navigator.clipboard.writeText(message);
            setFeedback('Mensagem copiada!');
        }
        catch {
            setFeedback('Não foi possível copiar automaticamente. Selecione e copie a mensagem abaixo.');
        }
    }
    return <Overlay title="Meu pedido" onClose={onClose} drawer>
    {!items.length ? <div className="empty-cart"><FiShoppingBag /><h2>Seu pedido ainda está vazio.</h2><p>A próxima boa escolha começa na brasa.</p><a className="button primary" href="#cardapio" onClick={onClose}>Explorar cardápio</a></div> : <><div className="cart-items">{items.map(item => <article className="cart-item" key={item.key}><div className="cart-item-heading"><h3>{productFor(item).name}</h3><button className="icon-button" aria-label={`Remover ${productFor(item).name}`} onClick={() => remove(item.key)}><FiTrash2 /></button></div>{extrasFor(item).map(extra => <p key={extra.id}>+ {extra.name} ({currency(extra.price)})</p>)}{item.note && <p className="cart-note">Obs: {item.note}</p>}<div className="cart-item-bottom"><Quantity name={productFor(item).name} value={item.quantity} onChange={q => setQuantity(item.key, q)}/><strong>{currency(lineTotal(item))}</strong></div></article>)}</div><div className="cart-summary"><div className="total"><span>Total</span><strong>{currency(orderTotal(items))}</strong></div><p>Valores dos itens. Entrega e disponibilidade a combinar.</p>{storageError && <p role="status">Seu navegador não permitiu salvar o pedido. Ele ficará disponível apenas nesta visita.</p>}<button className="button primary full" onClick={() => setReview(true)}><FaWhatsapp /> Finalizar pelo WhatsApp</button><small>Você poderá revisar a mensagem antes de enviar.</small>
    {review && <div className="order-review"><h3>{configured ? 'Revise seu pedido' : 'Pedido demonstrativo'}</h3><p>{configured ? 'Confira os itens antes de abrir o WhatsApp.' : 'Este é um negócio fictício, sem número conectado. Você pode copiar a mensagem do pedido.'}</p><label htmlFor="order-message">Mensagem do pedido</label><textarea id="order-message" readOnly value={message} rows={10}/><button className="button secondary full" onClick={copy}><FiCopy /> Copiar mensagem</button>{configured && <a className="button primary full" href={configured} target="_blank" rel="noopener noreferrer">Abrir WhatsApp <FaWhatsapp /></a>}<p role="status">{feedback}</p></div>}
    </div></>}
  </Overlay>;
}
