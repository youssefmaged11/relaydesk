import { incidents as seedIncidents } from '../data/incidents';
import { alerts as seedAlerts } from '../data/alerts';
import { users as seedUsers } from '../data/users';
import type { ActivityEvent, Alert, Filters, Incident, Role, Severity } from '../types';
import { applyFilters, sortIncidents } from '../utils/filtering';
import { scheduler } from './scheduler';

let incidents = structuredClone(seedIncidents);
let alerts = structuredClone(seedAlerts);
let users = structuredClone(seedUsers);
let activities: ActivityEvent[] = incidents.slice(0, 90).flatMap((incident, i) => [
  { id: `event-${i * 2 + 1}`, incidentId: incident.id, kind: 'status' as const, actor: 'RelayDesk', message: 'Incident created from customer escalation', createdAt: incident.createdAt },
  { id: `event-${i * 2 + 2}`, incidentId: incident.id, kind: 'assignment' as const, actor: 'Maya Chen', message: 'Assigned to the operations queue', createdAt: incident.createdAt + 120000 },
]);
let eventSequence = activities.length;

const clone = <T,>(value: T): T => structuredClone(value);

export type IncidentPage = { rows: Incident[]; inventory: string[]; total: number; pageCount: number; workspaceId: string };

export const backend = {
  reset() { incidents = clone(seedIncidents); alerts = clone(seedAlerts); users = clone(seedUsers); },
  async listIncidents(workspaceId: string, filters: Filters): Promise<IncidentPage> {
    await scheduler.wait(`incidents:${workspaceId}:${filters.search}`, filters.search ? 180 : 90);
    const inventory = incidents.filter(i => i.workspaceId === workspaceId).map(i => i.id);
    const filtered = sortIncidents(applyFilters(incidents.filter(i => i.workspaceId === workspaceId), filters), filters.sort);
    const pageCount = Math.max(1, Math.ceil(filtered.length / filters.pageSize));
    const start = (filters.page - 1) * filters.pageSize;
    return clone({ rows: filtered.slice(start, start + filters.pageSize), inventory, total: filtered.length, pageCount, workspaceId });
  },
  async getIncident(id: string) { await scheduler.wait(`incident:${id}`, 120); const found = incidents.find(i => i.id === id); if (!found) throw new Error('Incident not found'); return clone(found); },
  async updateIncident(id: string, patch: Partial<Pick<Incident, 'assigneeId' | 'severity' | 'status'>>, operationId: string) {
    await scheduler.wait(`mutation:${id}:${operationId}`, 160);
    if (operationId.includes('fail')) throw new Error('Relay could not save the change');
    const current = incidents.find(i => i.id === id); if (!current) throw new Error('Incident not found');
    Object.assign(current, patch, { updatedAt: Date.now(), version: current.version + 1 });
    activities.unshift({ id: `event-${++eventSequence}`, incidentId: id, kind: patch.assigneeId !== undefined ? 'assignment' : patch.status ? 'status' : 'priority', actor: 'Maya Chen', message: `Updated ${Object.keys(patch)[0]}`, createdAt: Date.now(), clientId: operationId });
    return clone(current);
  },
  async bulkSeverity(ids: string[], severity: Severity) {
    await scheduler.wait(`bulk:${ids.join(',')}`, 200);
    return Promise.all(ids.map(async (id, index) => index % 5 === 1 ? { id, ok: false as const } : { id, ok: true as const, incident: await backend.updateIncident(id, { severity }, `bulk-${id}`) }));
  },
  async deleteIncident(id: string) { await scheduler.wait(`delete:${id}`, 120); incidents = incidents.filter(i => i.id !== id); return id; },
  async listAlerts(workspaceId: string) { await scheduler.wait(`alerts:${workspaceId}`, 110); return clone(alerts.filter(a => a.workspaceId === workspaceId)); },
  async acknowledgeAlert(id: string, operationId: string) { await scheduler.wait(`ack:${id}:${operationId}`, 140); if (operationId.includes('fail')) throw new Error('Acknowledgement failed'); const alert = alerts.find(a => a.id === id); if (!alert) throw new Error('Alert not found'); alert.acknowledged = true; alert.version += 1; return clone(alert); },
  async listUsers(workspaceId: string) { await scheduler.wait(`users:${workspaceId}`, 70); return clone(users.filter(user => user.workspaceIds.includes(workspaceId))); },
  async updateRole(id: string, role: Role) { await scheduler.wait(`role:${id}`, 100); const user = users.find(u => u.id === id); if (!user) throw new Error('User not found'); user.role = role; return clone(user); },
  async removeMember(id: string, workspaceId: string) { await scheduler.wait(`remove:${id}`, 120); const user = users.find(u => u.id === id); if (!user) throw new Error('User not found'); user.workspaceIds = user.workspaceIds.filter(w => w !== workspaceId); return id; },
  async activity(incidentId: string, cursor = 0) { await scheduler.wait(`activity:${incidentId}:${cursor}`, 130); return clone(activities.filter(a => a.incidentId === incidentId).slice(cursor, cursor + 20)); },
  async comment(incidentId: string, message: string, clientId: string) { await scheduler.wait(`comment:${incidentId}`, 100); const event: ActivityEvent = { id: `event-${++eventSequence}`, incidentId, kind: 'comment', actor: 'Maya Chen', message, createdAt: Date.now(), clientId }; activities.unshift(event); return clone(event); },
};
