import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { User } from '../../types';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { usePermissions } from './usePermissions';
export function MemberMenu({ member, onRemove }: { member: User; onRemove: () => void }) { const can = usePermissions(); const [confirming, setConfirming] = useState(false); return <>{can('team:remove') && <details className="row-menu"><summary className="icon-btn" aria-label={`Actions for ${member.name}`}><MoreHorizontal/></summary><div className="popover compact"><button>View activity</button><button>Reset sessions</button><button className="danger-text" onClick={() => setConfirming(true)}>Remove from workspace</button></div></details>}{confirming && <ConfirmDialog title="Remove team member?" body={`${member.name} will immediately lose access to this workspace. Their historical activity will remain.`} confirmLabel="Remove member" onClose={() => setConfirming(false)} onConfirm={() => { onRemove(); setConfirming(false); }}/>}</>; }
