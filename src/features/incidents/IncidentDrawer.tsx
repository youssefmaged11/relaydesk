import { useEffect, useRef, useState, type RefObject } from 'react';
import { Calendar, ExternalLink, Tag, UserRound } from 'lucide-react';
import { backend } from '../../api/backend';
import { users } from '../../data/users';
import type { Incident, Severity } from '../../types';
import { Drawer } from '../../components/Drawer';
import { Select } from '../../components/Select';
import { ActivityPanel } from '../activity/ActivityPanel';

export function IncidentDrawer({ incident, openerRef, onClose, onMutate }: { incident: Incident; openerRef: RefObject<HTMLElement | null>; onClose: () => void; onMutate: (id: string, patch: Partial<Incident>) => Promise<unknown> }) {
  const [details, setDetails] = useState(incident); const [saving, setSaving] = useState(false); const initialId = useRef(incident.id);
  useEffect(() => { void backend.getIncident(incident.id).then(setDetails); }, [incident.id]);
  return <Drawer title={`INC-${incident.number}`} openerRef={openerRef} onClose={onClose}><div className="drawer-content"><div className="drawer-title"><span className={`severity-pill ${details.severity}`}><i/>{details.severity}</span><h1>{incident.title}</h1><p>{details.summary}</p></div><div className="detail-grid"><label><span><UserRound/> Assignee</span><Select value={details.assigneeId ?? ''} disabled={saving} onChange={async e => { const assigneeId = e.target.value || null; setDetails(current => ({ ...current, assigneeId })); setSaving(true); await onMutate(initialId.current, { assigneeId }); setSaving(false); }}><option value="">Unassigned</option>{users.slice(0,8).map(user => <option value={user.id} key={user.id}>{user.name}</option>)}</Select></label><label><span><Tag/> Severity</span><Select value={details.severity} disabled={saving} onChange={async e => { const severity = e.target.value as Severity; setDetails(current => ({ ...current, severity })); setSaving(true); await onMutate(initialId.current, { severity }); setSaving(false); }}><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></Select></label><div><span><Calendar/> Created</span><strong>{new Date(details.createdAt).toLocaleString()}</strong></div><div><span><ExternalLink/> Customer</span><strong>{details.customer}</strong></div></div><div className="tag-list">{details.tags.map(tag => <span key={tag}>{tag}</span>)}</div><ActivityPanel incidentId={incident.id}/></div></Drawer>;
}
