import { useCallback, useRef } from 'react';
import { backend } from '../../api/backend';
import { useToast } from '../../components/ToastProvider';
import type { Incident, Severity } from '../../types';

export function useIncidentMutations(updateLocal: (id: string, update: (incident: Incident) => Incident) => void, removeLocal: (id: string) => void) {
  const { push } = useToast();
  const operation = useRef(0);
  const lastUndo = useRef<(() => void) | null>(null);
  const mutate = useCallback(async (id: string, patch: Partial<Pick<Incident, 'assigneeId' | 'severity' | 'status'>>) => {
    const operationId = `op-${++operation.current}`;
    let previous: Incident | undefined;
    updateLocal(id, current => { previous = current; return { ...current, ...patch, updatedAt: Date.now() }; });
    try { const saved = await backend.updateIncident(id, patch, operationId); updateLocal(id, () => saved); lastUndo.current = () => previous && void mutate(id, { severity: previous.severity, status: previous.status, assigneeId: previous.assigneeId }); push({ tone: 'success', message: 'Incident updated', action: { label: 'Undo', onClick: () => lastUndo.current?.() } }); return saved; }
    catch (reason) { if (previous) updateLocal(id, () => previous!); push({ tone: 'danger', message: reason instanceof Error ? reason.message : 'Change failed' }); throw reason; }
  }, [push, updateLocal]);
  const bulkSeverity = useCallback(async (ids: string[], severity: Severity) => {
    const previous = new Map<string, Incident>();
    ids.forEach(id => updateLocal(id, current => { previous.set(id, current); return { ...current, severity, updatedAt: Date.now() }; }));
    const results = await backend.bulkSeverity(ids, severity);
    results.forEach(result => { if (!result.ok) { const prior = previous.get(result.id); if (prior) updateLocal(result.id, () => prior); } else updateLocal(result.id, () => result.incident); });
    const failed = results.filter(r => !r.ok).length;
    push({ tone: failed ? 'info' : 'success', message: failed ? `${ids.length - failed} updated, ${failed} failed` : `${ids.length} incidents updated` });
  }, [push, updateLocal]);
  const deleteIncident = useCallback(async (id: string) => { await backend.deleteIncident(id); removeLocal(id); push({ tone: 'success', message: 'Incident deleted' }); }, [push, removeLocal]);
  return { mutate, bulkSeverity, deleteIncident };
}
