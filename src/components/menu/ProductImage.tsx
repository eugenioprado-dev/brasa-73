import { useState } from 'react';
import type { MenuItem } from '../../types/menu';
import { illustrationFor } from '../../data/menu';
import { GiFlame } from 'react-icons/gi';
export function ProductImage({ product, eager = false, illustrationOnly = false }: {
    product: MenuItem;
    eager?: boolean;
    illustrationOnly?: boolean;
}) {
    const [failedSource, setFailedSource] = useState('');
    const fallback = illustrationFor(product.category);
    const source = illustrationOnly || failedSource === product.image ? fallback : product.image;
    const illustration = source.endsWith('.svg');
    return (
        <div className={`product-image ${illustration ? 'is-illustration' : 'is-photo'}`}>
            {failedSource === fallback ? (
                <div className="image-unavailable" role="img" aria-label={`Imagem indisponível: ${product.name}`}>
                    <GiFlame aria-hidden="true" />
                    <span>BRASA 73</span>
                </div>
            ) : (
                <img
                    src={source}
                    alt={illustration ? `Ilustração demonstrativa: ${product.category}` : product.name}
                    loading={eager ? 'eager' : 'lazy'}
                    onError={() => setFailedSource(source)}
                />
            )}
            {illustration && <span className="image-caption" aria-hidden="true">Ilustração demonstrativa</span>}
        </div>
    );
}
