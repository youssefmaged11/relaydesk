import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';
export function Drawer({ title, children, onClose, openerRef }: { title: string; children: ReactNode; onClose: () => void; openerRef?: RefObject<HTMLElement | null> }) {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => { panel.current?.focus(); const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); document.addEventListener('keydown', onKey); return () => { document.removeEventListener('keydown', onKey); openerRef?.current?.focus(); }; }, [onClose, openerRef]);
  return <div className="drawer-layer"><button className="drawer-scrim" onClick={onClose} aria-label="Close drawer"/><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1} ref={panel}><header><div><span className="eyebrow">Incident details</span><h2 id="drawer-title">{title}</h2></div><button className="icon-btn" aria-label="Close" onClick={onClose}><X/></button></header>{children}</aside></div>;
}
