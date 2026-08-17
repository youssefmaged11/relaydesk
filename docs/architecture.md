# RelayDesk architecture

RelayDesk intentionally uses ordinary React boundaries rather than a single global state container. This makes ownership visible and gives each workflow several legitimate coordination points.

## State flow

```text
SessionProvider ─────── permissions, preference identity
WorkspaceProvider ──── active tenant boundary
        │
        ├── useIncidents ── query page + authoritative inventory
        │       ├── useIncidentSelection
        │       ├── useIncidentMutations ── optimistic records + toast actions
        │       └── IncidentDrawer ── detailed entity + independent activity
        │
        └── useAlerts ── server snapshots + optimistic acknowledgements
```

The backend owns canonical entities and versions. Hooks own request lifecycle and optimistic overlays. Components own ephemeral UI identity such as open menus, confirmation targets, and focus return points.

## Core invariants

1. State from workspace A must never modify workspace B.
2. Entity identity is a stable ID, never a position in rendered data.
3. Visibility does not determine selection membership; authoritative inventory does.
4. An obsolete response cannot become authoritative.
5. Failure of operation X cannot roll back a newer operation Y.
6. Authorization is checked at action time, including an already-open confirmation.
7. Dynamic UI transitions restore focus to a meaningful surviving target.
8. Compact and detailed entities merge by field presence and version, not arrival time alone.

## Backend scheduler

Every API call passes through `scheduler.wait(label)`. Automatic mode uses short deterministic latency. Manual mode exposes pending request IDs to tests so a task can express chronology directly. The backend never uses random failure; failure operations are explicitly labeled.

## Testing philosophy

Baseline tests assert the healthy product surface. A Minerva task should add one focused regression test describing user-visible chronology, then repair the relevant ownership boundaries. Tests should avoid asserting request counters, hook internals, or implementation-specific flags.
