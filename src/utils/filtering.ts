import type { Filters, Incident, Severity } from '../types';

export function applyFilters(rows: Incident[], filters: Filters) {
  const needle = filters.search.trim().toLowerCase();
  return rows.filter(row => (!needle || `${row.title} ${row.customer} ${row.number}`.toLowerCase().includes(needle)) && (!filters.statuses.length || filters.statuses.includes(row.status)) && (!filters.severities.length || filters.severities.includes(row.severity)) && (!filters.assignee || row.assigneeId === filters.assignee));
}

const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
export function sortIncidents(rows: Incident[], sort: Filters['sort']) {
  return [...rows].sort((a, b) => sort === 'severity' ? severityOrder[a.severity] - severityOrder[b.severity] || b.updatedAt - a.updatedAt : sort === 'updated-asc' ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt);
}
