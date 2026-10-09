import { FiMinus, FiPlus } from 'react-icons/fi';
export function Quantity({ value, onChange, name }: {
    value: number;
    onChange: (value: number) => void;
    name: string;
}) {
    return <div className="quantity" role="group" aria-label={`Quantidade de ${name}`}>
    <button aria-label={`Diminuir quantidade de ${name}`} disabled={value <= 1} onClick={() => onChange(value - 1)}><FiMinus /></button>
    <output aria-live="polite">{value}</output>
    <button aria-label={`Aumentar quantidade de ${name}`} disabled={value >= 99} onClick={() => onChange(value + 1)}><FiPlus /></button>
  </div>;
}
