import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { IncidentsPage } from '../features/incidents/IncidentsPage';
import { AlertsPanel } from '../features/alerts/AlertsPanel';
import { TeamPage } from '../features/team/TeamPage';
function Placeholder({ title }: { title: string }) { return <div className="panel-page"><header className="page-header"><div><span className="eyebrow">RelayDesk</span><h1>{title}</h1><p>This workspace module is ready for the next operational workflow.</p></div></header><div className="placeholder card"><span>◫</span><h2>{title} is connected</h2><p>Incident data and workspace context are available here.</p></div></div>; }
export function Router() { return <Routes><Route element={<AppShell/>}><Route index element={<Navigate to="/incidents" replace/>}/><Route path="incidents" element={<IncidentsPage/>}/><Route path="alerts" element={<AlertsPanel/>}/><Route path="team" element={<TeamPage/>}/><Route path="overview" element={<Placeholder title="Overview"/>}/><Route path="activity" element={<Placeholder title="Workspace activity"/>}/><Route path="customers" element={<Placeholder title="Customers"/>}/><Route path="settings" element={<Placeholder title="Settings"/>}/></Route><Route path="*" element={<Navigate to="/incidents" replace/>}/></Routes>; }
