import type { Incident } from '../../types';
import { IncidentRow } from './IncidentRow';
export function IncidentTable({ rows, selected, onToggle, onTogglePage, onOpen, onDelete }: { rows: Incident[]; selected: Set<string>; onToggle: (id: string) => void; onTogglePage: () => void; onOpen: (incident: Incident, opener: HTMLButtonElement) => void; onDelete: (index: number) => void }) {
  const all = rows.length > 0 && rows.every(row => selected.has(row.id));
  return <div className="table-wrap" tabIndex={-1}><table><thead><tr><th className="check-cell"><input aria-label="Select this page" type="checkbox" checked={all} onChange={onTogglePage}/></th><th>Incident</th><th>Customer</th><th>Severity</th><th>Status</th><th>Assignee</th><th>Updated</th><th/></tr></thead><tbody>{rows.map((row, index) => <IncidentRow key={row.id} incident={row} selected={selected.has(row.id)} onSelect={() => onToggle(row.id)} onOpen={opener => onOpen(row, opener)} onDelete={() => onDelete(index)}/>)}</tbody></table>{!rows.length && <div className="empty-state"><span>⌕</span><h3>No incidents found</h3><p>Try adjusting your search or filters.</p></div>}</div>;
}
