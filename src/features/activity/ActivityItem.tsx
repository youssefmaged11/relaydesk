import { MessageSquare, RefreshCw, UserRound } from 'lucide-react';
import type { ActivityEvent } from '../../types';
import { relativeTime } from '../../utils/time';
export function ActivityItem({ event }: { event: ActivityEvent }) { const Icon = event.kind === 'comment' ? MessageSquare : event.kind === 'assignment' ? UserRound : RefreshCw; return <li className="activity-item"><span className={`activity-icon ${event.kind}`}><Icon/></span><div><p><strong>{event.actor}</strong> {event.message}</p><time>{relativeTime(event.createdAt)}</time></div></li>; }
