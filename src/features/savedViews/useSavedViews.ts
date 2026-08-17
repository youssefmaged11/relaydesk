import { useMemo } from 'react';
import { usePersistentState } from '../../hooks/usePersistentState';
import type { Filters, SavedView } from '../../types';
export function useSavedViews(workspaceId: string, ownerId: string) {
  const [allViews, setAllViews] = usePersistentState<SavedView[]>('relaydesk:saved-views', []);
  const views = useMemo(() => allViews.filter(view => view.workspaceId === workspaceId && view.ownerId === ownerId), [allViews, ownerId, workspaceId]);
  const save = (name: string, filters: Filters) => setAllViews(current => [...current, { id: crypto.randomUUID(), workspaceId, ownerId, name, filters }]);
  const remove = (id: string) => setAllViews(current => current.filter(view => view.id !== id));
  return { views, save, remove };
}
