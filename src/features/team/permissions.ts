import type { Role } from '../../types';
export type Permission = 'team:view' | 'team:edit' | 'team:remove' | 'incident:edit' | 'incident:delete';
const grants: Record<Role, Permission[]> = { admin: ['team:view','team:edit','team:remove','incident:edit','incident:delete'], operator: ['team:view','incident:edit'], viewer: ['team:view'] };
export const hasPermission = (role: Role, permission: Permission) => grants[role].includes(permission);
