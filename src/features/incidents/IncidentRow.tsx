import { useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Incident } from '../../types';
import { users } from '../../data/users';
import { relativeTime } from '../../utils/time';

export function IncidentRow({ incident, selected, onSelect, onOpen, onDelete }: { incident: Incident; selected: boolean; onSelect: () => void; onOpen: (opener: HTMLButtonElement) => void; onDelete: () => void }) {
  const openRef = useRef<HTMLButtonElement>(null); const assignee = users.find(user => user.id === incident.assigneeId);
  return <tr className={selected ? 'selected-row' : ''}><td className="check-cell"><input aria-label={`Select incident ${incident.number}`} type="checkbox" checked={selected} onChange={onSelect}/></td><td><button className="incident-link" ref={openRef} onClick={() => openRef.current && onOpen(openRef.current)}><span>INC-{incident.number}</span><strong>{incident.title}</strong></button></td><td><div className="customer"><strong>{incident.customer}</strong><span>{incident.customerTier}</span></div></td><td><span className={`severity-pill ${incident.severity}`}><i/>{incident.severity}</span></td><td><span className={`status-pill ${incident.status}`}><i/>{incident.status}</span></td><td>{assignee ? <span className="assignee"><i>{assignee.avatar}</i>{assignee.name}</span> : <span className="unassigned">Unassigned</span>}</td><td><time>{relativeTime(incident.updatedAt)}</time></td><td><details className="row-menu"><summary className="icon-btn" aria-label={`Actions for incident ${incident.number}`}><MoreHorizontal/></summary><div className="popover compact"><button onClick={() => openRef.current && onOpen(openRef.current)}>View details</button><button>Duplicate</button><button className="danger-text" onClick={onDelete}>Delete incident</button></div></details></td></tr>;
}
