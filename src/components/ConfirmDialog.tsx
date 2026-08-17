import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose, dangerous = true }: { title: string; body: string; confirmLabel: string; onConfirm: () => void; onClose: () => void; dangerous?: boolean }) {
  return <Modal title={title} onClose={onClose}><div className="confirm-body"><div className="confirm-icon"><AlertTriangle/></div><p>{body}</p></div><footer className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className={`button ${dangerous ? 'danger' : 'primary'}`} onClick={onConfirm} autoFocus>{confirmLabel}</button></footer></Modal>;
}
