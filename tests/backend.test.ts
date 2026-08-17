import { describe, expect, it } from 'vitest';
import { backend } from '../src/api/backend';
import { scheduler } from '../src/api/scheduler';
import type { Filters } from '../src/types';
const filters: Filters = { search: '', statuses: [], severities: [], assignee: '', sort: 'updated-desc', page: 1, pageSize: 12 };

describe('in-memory backend', () => {
  it.each(['ws-northstar','ws-atlas','ws-orbit'])('scopes incident results to %s', async workspaceId => { const page = await backend.listIncidents(workspaceId, filters); expect(page.rows.every(row => row.workspaceId === workspaceId)).toBe(true); });
  it('paginates results', async () => { const first = await backend.listIncidents('ws-northstar', filters); const second = await backend.listIncidents('ws-northstar', { ...filters, page: 2 }); expect(first.rows).toHaveLength(12); expect(second.rows[0].id).not.toBe(first.rows[0].id); });
  it('returns authoritative inventory beyond the page', async () => { const page = await backend.listIncidents('ws-northstar', filters); expect(page.inventory.length).toBeGreaterThan(page.rows.length); });
  it('updates an incident with a newer version', async () => { const page = await backend.listIncidents('ws-northstar', filters); const before = page.rows[0]; const saved = await backend.updateIncident(before.id, { severity: 'low' }, 'test-op'); expect(saved.severity).toBe('low'); expect(saved.version).toBe(before.version + 1); });
  it('deletes an incident from inventory', async () => { const page = await backend.listIncidents('ws-northstar', filters); await backend.deleteIncident(page.rows[0].id); const after = await backend.listIncidents('ws-northstar', filters); expect(after.inventory).not.toContain(page.rows[0].id); });
  it('acknowledges an alert', async () => { const list = await backend.listAlerts('ws-northstar'); const target = list.find(alert => !alert.acknowledged)!; expect((await backend.acknowledgeAlert(target.id, 'test-ack')).acknowledged).toBe(true); });
  it('supports comments with client identity', async () => { const page = await backend.listIncidents('ws-northstar', filters); const event = await backend.comment(page.rows[0].id, 'Investigating a trace', 'client-1'); expect(event.clientId).toBe('client-1'); expect(event.message).toContain('trace'); });
  it('supports explicit request ordering', async () => { scheduler.setManual(true); const first = backend.listIncidents('ws-northstar', filters); const second = backend.listIncidents('ws-atlas', filters); const requests = scheduler.pending(); scheduler.resolve(requests[1].id); const atlas = await second; scheduler.resolve(requests[0].id); const northstar = await first; expect(atlas.workspaceId).toBe('ws-atlas'); expect(northstar.workspaceId).toBe('ws-northstar'); });
});
