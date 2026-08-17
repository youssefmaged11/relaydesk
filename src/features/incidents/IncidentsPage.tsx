import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useWorkspace } from '../../app/WorkspaceProvider';
import { useSession } from '../../app/SessionProvider';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { Filters, Incident } from '../../types';
import { Pagination } from '../../components/Pagination';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useIncidents } from './useIncidents';
import { useIncidentSelection } from './useIncidentSelection';
import { useIncidentMutations } from './useIncidentMutations';
import { IncidentFilters } from './IncidentFilters';
import { IncidentToolbar } from './IncidentToolbar';
import { IncidentTable } from './IncidentTable';
import { IncidentDrawer } from './IncidentDrawer';
import { BulkActions } from './BulkActions';
import { SavedViewPicker } from '../savedViews/SavedViewPicker';

const defaults: Filters = { search: '', statuses: [], severities: [], assignee: '', sort: 'updated-desc', page: 1, pageSize: 12 };
function fromParams(params: URLSearchParams): Filters { return { ...defaults, search: params.get('q') ?? '', statuses: (params.get('status')?.split(',').filter(Boolean) ?? []) as Filters['statuses'], severities: (params.get('severity')?.split(',').filter(Boolean) ?? []) as Filters['severities'], sort: (params.get('sort') as Filters['sort']) ?? defaults.sort, page: Number(params.get('page') || 1) }; }
function toParams(filters: Filters) { const params = new URLSearchParams(); if (filters.search) params.set('q', filters.search); if (filters.statuses.length) params.set('status', filters.statuses.join(',')); if (filters.severities.length) params.set('severity', filters.severities.join(',')); if (filters.sort !== defaults.sort) params.set('sort', filters.sort); if (filters.page > 1) params.set('page', String(filters.page)); return params; }

export function IncidentsPage() {
  const { workspace } = useWorkspace(); const { user } = useSession(); const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(() => fromParams(params)); const debouncedSearch = useDebouncedValue(filters.search, 350);
  const queryFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [debouncedSearch, filters]);
  const incidents = useIncidents(workspace.id, queryFilters); const selection = useIncidentSelection(incidents.rows.map(row => row.id));
  const mutations = useIncidentMutations(incidents.updateLocal, incidents.removeLocal);
  const [openIncident, setOpenIncident] = useState<Incident | null>(null); const openerRef = useRef<HTMLElement | null>(null); const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  useEffect(() => { const next = fromParams(params); setFilters(current => JSON.stringify(current) === JSON.stringify(next) ? current : next); }, [params]);
  useEffect(() => { setParams(toParams(filters), { replace: true }); }, [filters, setParams]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.shiftKey && event.key.toLowerCase() === 'a' && selection.selectedIds.length) { event.preventDefault(); document.querySelector<HTMLButtonElement>('.bulk-bar button')?.click(); } }; document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler); }, []);
  const loadView = (next: Filters) => setFilters(next);
  return <div className="incidents-page"><header className="page-header"><div><SavedViewPicker workspaceId={workspace.id} ownerId={user.id} filters={filters} onLoad={loadView}/><div className="title-row"><h1>Incidents</h1><span className="total-badge">{incidents.total}</span></div><p>Track, triage, and resolve customer-impacting issues.</p></div><IncidentToolbar onRefresh={incidents.refresh} refreshing={incidents.loading}/></header><section className="card incident-card"><IncidentFilters filters={filters} onChange={setFilters}/>{selection.selected.size > 0 && <BulkActions count={selection.selected.size} onClear={selection.clear} onSeverity={severity => mutations.bulkSeverity(selection.selectedIds, severity)}/>} {incidents.error && <div className="error-banner"><AlertCircle/>{incidents.error}<button onClick={incidents.refresh}>Try again</button></div>}<IncidentTable rows={incidents.rows} selected={selection.selected} onToggle={selection.toggle} onTogglePage={selection.togglePage} onOpen={(incident, opener) => { openerRef.current = opener; setOpenIncident(incident); }} onDelete={setDeleteIndex}/>{incidents.loading && <div className="table-loading"><span/></div>}<footer className="table-footer"><span className="sync-status"><i/> Live updates on</span><Pagination page={filters.page} pageCount={incidents.pageCount} total={incidents.total} pageSize={filters.pageSize} onChange={page => setFilters(current => ({ ...current, page }))}/></footer></section>{openIncident && <IncidentDrawer incident={openIncident} openerRef={openerRef} onClose={() => setOpenIncident(null)} onMutate={mutations.mutate}/>} {deleteIndex !== null && <ConfirmDialog title="Delete incident?" body="This incident and its associated comments will be permanently removed. This action cannot be undone." confirmLabel="Delete incident" onClose={() => setDeleteIndex(null)} onConfirm={() => { const target = incidents.rows[deleteIndex]; if (target) void mutations.deleteIncident(target.id); setDeleteIndex(null); }}/>}</div>;
}
