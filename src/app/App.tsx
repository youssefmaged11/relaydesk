import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './SessionProvider';
import { WorkspaceProvider } from './WorkspaceProvider';
import { ToastProvider } from '../components/ToastProvider';
import { Router } from './Router';
export function App() { return <BrowserRouter><SessionProvider><WorkspaceProvider><ToastProvider><Router/></ToastProvider></WorkspaceProvider></SessionProvider></BrowserRouter>; }
