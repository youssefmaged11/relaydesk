export const byId = <T extends { id: string }>(items: T[]) => new Map(items.map(item => [item.id, item]));
