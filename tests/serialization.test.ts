import { describe, expect, it } from 'vitest';
import { clampPage } from '../src/utils/pagination';
import { deserializeFilters, serializeFilters } from '../src/features/savedViews/viewSerialization';
import type { Filters } from '../src/types';
const defaults: Filters = { search: '', statuses: [], severities: [], assignee: '', sort: 'updated-desc', page: 1, pageSize: 12 };
describe('saved view serialization', () => {
  it('round trips complete filters', () => expect(deserializeFilters(serializeFilters({ ...defaults, search: 'billing' }), defaults).search).toBe('billing'));
  it('restores missing arrays', () => expect(deserializeFilters({ search: 'api' }, defaults).statuses).toEqual([]));
  it('preserves valid saved pages', () => expect(deserializeFilters({ page: 4 }, defaults).page).toBe(4));
  it('copies status arrays', () => { const source: Filters = { ...defaults, statuses: ['open'] }; const saved = serializeFilters(source); expect(saved.statuses).not.toBe(source.statuses); });
});
describe('pagination clamping', () => {
  it.each([[1,5,1],[4,5,4],[9,5,5],[0,5,1],[-4,5,1],[3,0,1]])('clamps page %s of %s to %s', (page, count, expected) => expect(clampPage(page, count)).toBe(expected));
});
