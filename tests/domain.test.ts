import { describe, expect, it } from 'vitest';
import { incidents } from '../src/data/incidents';
import { users } from '../src/data/users';
import { workspaces } from '../src/data/workspaces';
import { alerts } from '../src/data/alerts';

describe('deterministic fixtures', () => {
  it('has three workspaces', () => expect(workspaces).toHaveLength(3));
  it('has more than 200 incidents', () => expect(incidents.length).toBeGreaterThanOrEqual(200));
  it('has more than 20 users', () => expect(users.length).toBeGreaterThan(20));
  it('gives every incident a stable unique ID', () => expect(new Set(incidents.map(row => row.id)).size).toBe(incidents.length));
  it('gives every alert a stable unique ID', () => expect(new Set(alerts.map(row => row.id)).size).toBe(alerts.length));
  it.each(workspaces)('%s owns incident inventory', workspace => expect(incidents.filter(row => row.workspaceId === workspace.id).length).toBeGreaterThan(50));
  it.each(['critical','high','medium','low'])('contains %s incidents', severity => expect(incidents.some(row => row.severity === severity)).toBe(true));
  it.each(['open','investigating','monitoring','resolved'])('contains %s incidents', status => expect(incidents.some(row => row.status === status)).toBe(true));
  it('contains assigned and unassigned incidents', () => { expect(incidents.some(row => row.assigneeId)).toBe(true); expect(incidents.some(row => !row.assigneeId)).toBe(true); });
  it('references known workspaces', () => expect(incidents.every(row => workspaces.some(workspace => workspace.id === row.workspaceId))).toBe(true));
});
