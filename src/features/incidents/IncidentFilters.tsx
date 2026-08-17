import { Filter, X } from 'lucide-react';
import type { Filters, IncidentStatus, Severity } from '../../types';
import { SearchInput } from '../../components/SearchInput';
import { Select } from '../../components/Select';

const statusOptions: IncidentStatus[] = ['open','investigating','monitoring','resolved'];
const severityOptions: Severity[] = ['critical','high','medium','low'];
export function IncidentFilters({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  const toggle = <T extends string,>(key: 'statuses' | 'severities', value: T) => { const values = filters[key] as T[]; onChange({ ...filters, [key]: values.includes(value) ? values.filter(item => item !== value) : [...values, value], page: 1 }); };
  const active = filters.statuses.length + filters.severities.length + (filters.assignee ? 1 : 0);
  return <div className="filter-bar"><SearchInput value={filters.search} onChange={search => onChange({ ...filters, search, page: 1 })}/><details className="filter-menu"><summary className="button secondary"><Filter/> Filters {active > 0 && <span className="filter-count">{active}</span>}</summary><div className="popover"><h4>Status</h4>{statusOptions.map(value => <label key={value}><input type="checkbox" checked={filters.statuses.includes(value)} onChange={() => toggle('statuses', value)}/><span className={`status-dot ${value}`}/>{value}</label>)}<h4>Severity</h4>{severityOptions.map(value => <label key={value}><input type="checkbox" checked={filters.severities.includes(value)} onChange={() => toggle('severities', value)}/><span className={`severity-mark ${value}`}/>{value}</label>)}</div></details><Select aria-label="Sort incidents" value={filters.sort} onChange={e => onChange({ ...filters, sort: e.target.value as Filters['sort'], page: 1 })}><option value="updated-desc">Recently updated</option><option value="updated-asc">Oldest updated</option><option value="severity">Highest severity</option></Select>{active > 0 && <button className="button ghost" onClick={() => onChange({ ...filters, statuses: [], severities: [], assignee: '', page: 1 })}><X/> Clear</button>}</div>;
}
