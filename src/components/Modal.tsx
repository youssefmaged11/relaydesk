import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Modal({ title, children, onClose, width = 520 }: { title: string; children: ReactNode; onClose: () => void; width?: number }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { panel.current?.focus(); const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler); }, [onClose]);
  return <div className="overlay" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{ maxWidth: width }} tabIndex={-1} ref={panel}><header><h2 id="modal-title">{title}</h2><button className="icon-btn" aria-label="Close" onClick={onClose}><X/></button></header>{children}</div></div>;
}
