import type { Role, User } from '../../types';
import { Select } from '../../components/Select';
export function RoleEditor({ member, disabled, onChange }: { member: User; disabled: boolean; onChange: (role: Role) => void }) { return <Select aria-label={`Role for ${member.name}`} value={member.role} disabled={disabled} onChange={e => onChange(e.target.value as Role)}><option value="admin">Admin</option><option value="operator">Operator</option><option value="viewer">Viewer</option></Select>; }
