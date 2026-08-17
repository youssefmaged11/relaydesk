import { useMemo } from 'react';
import type { Alert } from '../../types';
export const useAlertCounts = (alerts: Alert[]) => useMemo(() => ({ unread: alerts.filter(alert => !alert.acknowledged).length, critical: alerts.filter(alert => !alert.acknowledged && alert.severity === 'critical').length }), [alerts]);
