import { useState } from 'react';
import { Send } from 'lucide-react';
import { useActivity } from './useActivity';
import { ActivityItem } from './ActivityItem';
export function ActivityPanel({ incidentId }: { incidentId: string }) { const { events, loading, addComment } = useActivity(incidentId); const [comment, setComment] = useState(''); return <section className="activity-panel"><h3>Activity</h3><form className="comment-box" onSubmit={e => { e.preventDefault(); const value = comment.trim(); if (!value) return; setComment(''); void addComment(value); }}><textarea aria-label="Add a comment" placeholder="Add an internal comment…" value={comment} onChange={e => setComment(e.target.value)}/><button className="button primary" disabled={!comment.trim()}><Send/> Comment</button></form>{loading && !events.length ? <div className="activity-skeleton">Loading activity…</div> : <ol>{events.map(event => <ActivityItem key={event.id} event={event}/>)}</ol>}</section>; }
