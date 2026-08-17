import type { Filters } from '../../types';
export const serializeFilters = (filters: Filters) => ({ ...filters, statuses: [...filters.statuses], severities: [...filters.severities] });
export const deserializeFilters = (value: Partial<Filters>, fallback: Filters): Filters => ({ ...fallback, ...value, statuses: value.statuses ?? [], severities: value.severities ?? [] });
