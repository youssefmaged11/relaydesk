import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
type Toast = { id: string; tone?: 'success' | 'danger' | 'info'; message: string; action?: { label: string; onClick: () => void } };
const ToastContext = createContext<{ push: (toast: Omit<Toast, 'id'>) => string } | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: string) => setToasts(items => items.filter(t => t.id !== id)), []);
  const push = useCallback((toast: Omit<Toast, 'id'>) => { const id = crypto.randomUUID(); setToasts(items => [...items, { ...toast, id }]); window.setTimeout(() => dismiss(id), 6500); return id; }, [dismiss]);
  return <ToastContext.Provider value={{ push }}>{children}<div className="toast-stack" aria-live="polite">{toasts.map(toast => <div className={`toast ${toast.tone ?? 'info'}`} key={toast.id}>{toast.tone === 'danger' ? <XCircle/> : toast.tone === 'success' ? <CheckCircle2/> : <Info/>}<span>{toast.message}</span>{toast.action && <button onClick={() => { toast.action?.onClick(); dismiss(toast.id); }}>{toast.action.label}</button>}<button className="icon-btn" onClick={() => dismiss(toast.id)} aria-label="Dismiss"><X/></button></div>)}</div></ToastContext.Provider>;
}
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error('ToastProvider missing'); return context; }
