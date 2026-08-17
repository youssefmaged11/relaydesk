# Curator task matrix

This document is for repository curators. Each row is independently reproducible from the baseline; no task requires another task to be fixed first.

| Task family | Main invariant | Primary path | Likely source span | Plausible incomplete fixes |
|---|---|---|---|---|
| Previous workspace refresh contaminates active rows | workspace / async | start refresh, switch workspace, resolve new then old | provider, incident hook, selection, shell count | guard only table state; clear all state; abort only foreground request |
| Filtering drops hidden selection | selection | select across pages, apply status filter | selection hook, incident query, bulk bar | preserve everything forever; reconcile to current page; clear on every query |
| Old inventory resurrects a deleted selected ID | async / identity | overlap inventory refreshes around delete | scheduler, incident hook, selection | request ID on rows only; dedupe visible rows; clear selection after delete only |
| Failed assignment overwrites a newer success | mutation | assign Bob, assign Carol, resolve Carol, reject Bob | drawer, mutation hook, backend, toast | rollback snapshots; global lock; ignore all old failures |
| Partial bulk failure corrupts successful records | mutation | bulk update with mixed response and intervening refresh | bulk UI, mutation hook, backend, activity | rollback whole batch; retry whole batch; trust arrival order |
| Saved view restores an impossible page | derived state | save page six, reduce results, reload view | saved views, page, pagination, selection | always page one; silently discard view; clear all selection |
| Debounced search leaks across saved views | async identity | type in view A, load view B before debounce fires | input, debounce hook, saved picker, incident hook | request ID after debounce only; clear input only; disable picker |
| Permission downgrade leaves confirmation executable | permission | open remove flow as admin, downgrade, keyboard-confirm | session, permission hook, menu, dialog, role editor | hide menu; disable only mouse button; capture role at open time |
| Reordered table changes confirmation target | entity identity | open delete, refresh/sort, then confirm | row, table, page, mutation hook, dialog | freeze table; store another index; close every dialog on refresh |
| Drawer subsections show different incidents | async scope | open A, B, C and resolve details/activity out of order | drawer, activity hook, incident hook, panel | abort main request only; key header only; blank all detail while loading |
| Closing drawer loses focus after filtering opener away | accessibility | open row, filter it out, close drawer | drawer, row, table, page | optional-chain focus; focus body; keep hidden row mounted |
| Alert count disagrees with optimistic rows | optimistic authority | acknowledge twice, fail one, resolve stale polling snapshot | alerts hook, count hook, panel, backend | mutate count separately; pause polling; blindly prefer optimistic state |
| Optimistic timestamp destabilizes sorted rows | derived state | edit priority under updated-desc, reject or accept different server time | mutation hook, sorting, table, backend | never resort; retain client time; snapshot whole array |
| Account preferences leak through broad persistence keys | persistence identity | sign out and enter same workspace as another user | persistent hook, session, workspace, page | namespace workspace only; clear all localStorage; update key without resetting memory |
| Earlier toast undoes the latest mutation | mutation identity | edit A, edit B, click Undo on A toast | toast provider, mutation hook, row, backend | single global last mutation; dismiss earlier toast; serialize all edits |
| Overlapping activity windows duplicate events | entity identity | refresh overlapping windows; reconcile optimistic comment with server event | activity hook, panel, backend | dedupe timestamp; dedupe message; remove all optimistic events |

## Task acceptance profile

Each extracted issue should use 4–8 user or scheduler transitions, span roughly 3–6 relevant files, and have one coherent user-visible outcome. A golden patch may be small, but it should repair ownership rather than mask the sequence in the UI.
