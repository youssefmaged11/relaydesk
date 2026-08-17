import { useCallback, useState } from 'react';
export function useAsyncOperation() { const [isSaving, setSaving] = useState(false); const run = useCallback(async <T,>(fn: () => Promise<T>) => { setSaving(true); try { return await fn(); } finally { setSaving(false); } }, []); return { isSaving, run }; }
