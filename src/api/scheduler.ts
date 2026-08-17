export type PendingRequest = { id: number; label: string; resolve: () => void; reject: (error: Error) => void };

let sequence = 0;
let manual = false;
const pending: PendingRequest[] = [];

export const scheduler = {
  setManual(value: boolean) { manual = value; },
  reset() { manual = false; pending.splice(0); sequence = 0; },
  pending() { return pending.map(({ id, label }) => ({ id, label })); },
  resolve(id: number) { pending.find(item => item.id === id)?.resolve(); },
  reject(id: number, message = 'Request failed') { pending.find(item => item.id === id)?.reject(new Error(message)); },
  async wait(label: string, delay = 80): Promise<void> {
    const id = ++sequence;
    if (!manual) return new Promise(resolve => window.setTimeout(resolve, delay + (id % 3) * 25));
    return new Promise((resolve, reject) => pending.push({ id, label, resolve: () => { pending.splice(pending.findIndex(p => p.id === id), 1); resolve(); }, reject: error => { pending.splice(pending.findIndex(p => p.id === id), 1); reject(error); } }));
  },
};
