import { useCallback, useEffect, useState } from 'react';
import { backend, type IncidentPage } from '../../api/backend';
import type { Filters, Incident } from '../../types';

const empty: IncidentPage = { rows: [], inventory: [], total: 0, pageCount: 1, workspaceId: '' };
export function useIncidents(workspaceId: string, filters: Filters) {
  const [data, setData] = useState<IncidentPage>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    try { const result = await backend.listIncidents(workspaceId, filters); setData(result); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not load incidents'); }
    finally { setLoading(false); }
  }, [workspaceId, filters]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { const timer = window.setInterval(() => void load(true), 30_000); return () => window.clearInterval(timer); }, [load]);
  const updateLocal = useCallback((id: string, update: (current: Incident) => Incident) => setData(current => ({ ...current, rows: current.rows.map(row => row.id === id ? update(row) : row) })), []);
  const removeLocal = useCallback((id: string) => setData(current => ({ ...current, rows: current.rows.filter(row => row.id !== id), inventory: current.inventory.filter(item => item !== id), total: Math.max(0, current.total - 1) })), []);
  return { ...data, loading, error, refresh: () => load(false), updateLocal, removeLocal };
}
