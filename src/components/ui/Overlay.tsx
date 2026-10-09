import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
export function Overlay({ title, onClose, children, drawer = false, className = '' }: {
    title: string;
    onClose: () => void;
    children: ReactNode;
    drawer?: boolean;
    className?: string;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
        if (event.key !== 'Tab') return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
        )).filter(element => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }
    useEffect(() => {
        const trigger = document.activeElement as HTMLElement | null;
        const dialog = ref.current!;
        const overflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        return () => { dialog.close(); document.body.style.overflow = overflow; trigger?.focus(); };
    }, []);
    return <dialog ref={ref} className={`overlay ${drawer ? 'drawer' : ''} ${className}`} aria-label={title} onKeyDown={keepFocusInside} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="overlay-header"><span className="eyebrow">{title}</span><button className="icon-button" autoFocus onClick={onClose} aria-label="Fechar"><FiX /></button></header>
    {children}
  </dialog>;
}
