import { describe, expect, it } from 'vitest';
import { applyFilters, sortIncidents } from '../src/utils/filtering';
import { incidents } from '../src/data/incidents';
import type { Filters, IncidentStatus, Severity } from '../src/types';
const base: Filters = { search: '', statuses: [], severities: [], assignee: '', sort: 'updated-desc', page: 1, pageSize: 12 };

describe('incident filtering', () => {
  it.each([
    ['title', 'payment', (row: typeof incidents[number]) => row.title.toLowerCase().includes('payment')],
    ['customer', 'acme', (row: typeof incidents[number]) => row.customer.toLowerCase().includes('acme')],
    ['incident number', '4100', (row: typeof incidents[number]) => String(row.number).includes('4100')],
  ])('searches by %s', (_, search, predicate) => { const rows = applyFilters(incidents, { ...base, search }); expect(rows.length).toBeGreaterThan(0); expect(rows.every(predicate)).toBe(true); });
  it.each(['open','investigating','monitoring','resolved'] as IncidentStatus[])('filters %s status', status => { const rows = applyFilters(incidents, { ...base, statuses: [status] }); expect(rows.every(row => row.status === status)).toBe(true); });
  it.each(['critical','high','medium','low'] as Severity[])('filters %s severity', severity => { const rows = applyFilters(incidents, { ...base, severities: [severity] }); expect(rows.every(row => row.severity === severity)).toBe(true); });
  it.each(['user-1','user-2','user-3','user-4'])('filters assignee %s', assignee => { const rows = applyFilters(incidents, { ...base, assignee }); expect(rows.every(row => row.assigneeId === assignee)).toBe(true); });
  it('combines filters with AND semantics', () => { const rows = applyFilters(incidents, { ...base, statuses: ['open'], severities: ['critical'] }); expect(rows.every(row => row.status === 'open' && row.severity === 'critical')).toBe(true); });
  it('treats status selections with OR semantics', () => { const rows = applyFilters(incidents, { ...base, statuses: ['open','resolved'] }); expect(rows.every(row => ['open','resolved'].includes(row.status))).toBe(true); });
  it('returns all rows for an empty query', () => expect(applyFilters(incidents, base)).toHaveLength(incidents.length));
  it('is case insensitive', () => expect(applyFilters(incidents, { ...base, search: 'PAYMENT' })).toEqual(applyFilters(incidents, { ...base, search: 'payment' })));
});

describe('incident sorting', () => {
  it('sorts newest first', () => { const rows = sortIncidents(incidents, 'updated-desc'); expect(rows[0].updatedAt).toBeGreaterThanOrEqual(rows[1].updatedAt); });
  it('sorts oldest first', () => { const rows = sortIncidents(incidents, 'updated-asc'); expect(rows[0].updatedAt).toBeLessThanOrEqual(rows[1].updatedAt); });
  it('sorts critical severity first', () => expect(sortIncidents(incidents, 'severity')[0].severity).toBe('critical'));
  it('does not mutate the input', () => { const original = incidents.map(row => row.id); sortIncidents(incidents, 'updated-asc'); expect(incidents.map(row => row.id)).toEqual(original); });
  it('uses updated time as severity tie breaker', () => { const rows = sortIncidents(incidents.filter(row => row.severity === 'high'), 'severity'); expect(rows[0].updatedAt).toBeGreaterThanOrEqual(rows[1].updatedAt); });
});
