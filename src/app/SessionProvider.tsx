import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { users } from '../data/users';
import type { User } from '../types';

type SessionValue = { user: User; setUser: (user: User) => void; refreshRole: (role: User['role']) => void };
const SessionContext = createContext<SessionValue | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(users[0]);
  const value = useMemo(() => ({ user, setUser, refreshRole: (role: User['role']) => setUser(current => ({ ...current, role })) }), [user]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
export function useSession() { const context = useContext(SessionContext); if (!context) throw new Error('SessionProvider missing'); return context; }
