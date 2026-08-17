import { Check, Clock3 } from 'lucide-react';
import type { Alert } from '../../types';
import { relativeTime } from '../../utils/time';
export function AlertRow({ alert, onAcknowledge }: { alert: Alert; onAcknowledge: () => void }) { return <li className={alert.acknowledged ? 'alert-row acknowledged' : 'alert-row'}><span className={`alert-indicator ${alert.severity}`}/><div><strong>{alert.title}</strong><span>{alert.source} · {relativeTime(alert.createdAt)}</span></div>{alert.acknowledged ? <span className="ack-label"><Check/> Acknowledged</span> : <button className="button secondary small" onClick={onAcknowledge}><Clock3/> Acknowledge</button>}</li>; }
