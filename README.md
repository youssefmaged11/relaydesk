# RelayDesk

RelayDesk is a realistic multi-workspace incident and customer-operations dashboard. It is also a deliberately bug-rich Minerva repository: normal workflows are polished and usable, while carefully sequenced interactions expose cross-cutting faults in async authority, entity identity, optimistic updates, permissions, focus, persistence, and derived state.

## Product surface

- Three switchable workspaces with 216 deterministic incidents and 24 team members
- Search, multi-value filters, sorting, pagination, saved views, cross-page selection, and bulk actions
- Incident drawers with assignment, severity, comments, and activity history
- Alert acknowledgement with background refresh and optimistic state
- Team roles, permissions, destructive confirmation flows, and live role changes
- URL-synchronized state, stacked toasts, accessible modals/drawers, and keyboard shortcuts
- A deterministic in-memory backend scheduler capable of resolving requests in any order

## Run locally

Node.js 20+ and npm are required.

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Validation

```bash
npm test
npm run test:e2e
npm run build
```

The repository contains 77 Vitest checks and three Playwright workflows. Tests cover stable baseline behavior; they intentionally do not encode the golden fixes for the latent Minerva tasks.

## Deterministic async testing

`src/api/scheduler.ts` supports automatic and manual modes. In manual mode, tests can start multiple backend operations and resolve or reject each request by ID, reproducing sequences such as `B succeeds → A fails` without timers or randomness.

```ts
scheduler.setManual(true);
const first = backend.listIncidents('ws-northstar', filters);
const second = backend.listIncidents('ws-atlas', filters);

const [a, b] = scheduler.pending();
scheduler.resolve(b.id);
await second;
scheduler.resolve(a.id);
await first;
```

See [docs/architecture.md](docs/architecture.md) for state ownership and [docs/minerva-task-matrix.md](docs/minerva-task-matrix.md) for the curator-facing issue portfolio.
