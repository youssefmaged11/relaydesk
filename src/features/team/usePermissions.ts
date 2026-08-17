import { useCallback } from 'react';
import { useSession } from '../../app/SessionProvider';
import { hasPermission, type Permission } from './permissions';
export function usePermissions() { const { user } = useSession(); return useCallback((permission: Permission) => hasPermission(user.role, permission), [user.role]); }
