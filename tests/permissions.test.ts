import { describe, expect, it } from 'vitest';
import { hasPermission, type Permission } from '../src/features/team/permissions';
import type { Role } from '../src/types';
const matrix: Array<[Role, Permission, boolean]> = [
  ['admin','team:view',true],['admin','team:edit',true],['admin','team:remove',true],['admin','incident:edit',true],['admin','incident:delete',true],
  ['operator','team:view',true],['operator','team:edit',false],['operator','team:remove',false],['operator','incident:edit',true],['operator','incident:delete',false],
  ['viewer','team:view',true],['viewer','team:edit',false],['viewer','team:remove',false],['viewer','incident:edit',false],['viewer','incident:delete',false],
];
describe('permission matrix', () => { it.each(matrix)('%s / %s -> %s', (role, permission, expected) => expect(hasPermission(role, permission)).toBe(expected)); });
