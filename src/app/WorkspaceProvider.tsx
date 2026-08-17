import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { workspaces } from '../data/workspaces';
import type { Workspace } from '../types';

type WorkspaceValue = { workspace: Workspace; workspaces: Workspace[]; setWorkspaceId: (id: string) => void };
const WorkspaceContext = createContext<WorkspaceValue | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState(workspaces[0].id);
  const value = useMemo(() => ({ workspace: workspaces.find(w => w.id === workspaceId) ?? workspaces[0], workspaces, setWorkspaceId }), [workspaceId]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() { const context = useContext(WorkspaceContext); if (!context) throw new Error('WorkspaceProvider missing'); return context; }
