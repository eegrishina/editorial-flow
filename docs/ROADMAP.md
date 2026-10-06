# Roadmap

The work is split into two MVPs:
- **MVP-1:** the full UI working on an in-memory mock API.
- **MVP-2:** the same UI on a real Next.js backend (Route Handlers + SQLite), deployed.

Each stage gets its own branch from `develop` and must pass `npm run lint`, `npx tsc --noEmit`, `npm run test:run` and `npm run build` before merging. See [ARCHITECTURE.md](ARCHITECTURE.md#git-workflow).

## Stages

### Stage 0 — Repository setup ✅
- [x] Create `develop` from `main`
- [x] Move the prototype to `design-reference/`, exclude it from ESLint and TypeScript
- [x] Early UI work (BookCard, EditorChip, ProgressBar, `shared/lib`) set aside until stage 3; it was written before the domain model

### Stage 1 — Documentation ✅
- [x] README, ARCHITECTURE, DESIGN_SYSTEM, ROADMAP, project conventions in AGENTS.md
- Keep updating the docs as each stage lands

### MVP-1: UI on mocks

#### Stage 2 — Domain model (`feat/domain-model`) ✅
- [x] `entities/stage`: `stageSchema` (6 values) + `STAGES` metadata
- [x] `entities/editor`: `editorSchema`, mocks, mock current editor
- [x] `entities/book`: `bookSchema` (zod) as the source of truth, with `status: Stage`, `position`, `submitted`, `note`
- [x] Mocks moved from `shared/api/mockData.ts` into `entities/*/model/mocks.ts`
- [x] Cross-entity imports through `@x`
- [x] `entities/book/lib`: `isUrgent`, `groupByStage`, `filterBooks`
- [x] Vitest set up; helpers and mocks covered by unit tests

#### Stage 3 — UI kit (`feat/ui-kit`) ✅
- [x] Font wiring per the Next.js recipe ([known issue 7](#known-issues)); serif switched to **Lora**
- [x] Early UI work back: `shared/lib` (`cn`, `formatDate`, `formatWords`), `EditorChip`, `ProgressBar`, `BookCard` + hover reveal utilities
- [x] `BookCard` adapted to the new `Book` model; [known issues](#known-issues) 1, 2, 5, 6 fixed
- [x] `ProgressBar` made domain-agnostic (`accent` / `label` props instead of `isUrgent`)
- [x] New kit components: `Dashed`, `Kicker`, `Counter`, `Button` (ghost / solid / accent / subtle), `IconButton`, `SearchInput`, `AvatarStack`
- [x] Component tests: `jsdom` + React Testing Library + jest-dom
- [x] `/kit` style guide page for visual checks against the prototype
- `Tag` dropped: the prototype uses `GenreTag` in one place only (genre on `BookCard`), so it stays inline

#### Stage 3.5 — Book flags (`refactor/book-flags`)
- [ ] `flag: "urgent" | "review"` → two independent booleans `urgent` and `awaiting`. A stage says where a book is in the pipeline; flags mark what needs attention on top of it, and a book can be both urgent and awaiting a decision
- [ ] `review` renamed to `awaiting`: the book waits for someone else's decision (committee, author, designer sign-off), it is not a stage
- [ ] Mocks flagged from their notes; `isUrgent`, `filterBooks`, `BookCard` and tests updated
- Done before stage 4 so the mock API and the widgets of stages 5–7 are built on the final model shape

#### Stage 4 — Mock API + React Query
- [ ] `entities/book/api/booksApi.ts`: async `getBooks()` / `updateBook(id, patch)` over an in-memory copy of the mocks, with artificial delay and an optional random failure
- [ ] `booksQueryOptions`, `useBooks`, `useUpdateBook` (optimistic update + rollback)
- [ ] `app/providers.tsx` with `QueryClientProvider`

#### Stage 5 — Static board
- [ ] `widgets/kanban-board` (`BoardColumn`, legend, horizontal scroll)
- [ ] `widgets/page-footer`
- [ ] `app/page.tsx` composes the widgets with data from `useBooks`

#### Stage 6 — Masthead, filters, search (MobX)
- [ ] `BoardUiStore` (`filter`, `query`, `selectedId`) provided in `app/providers.tsx`; check MobX `observer` with React Compiler
- [ ] `widgets/masthead`
- [ ] `features/filter-books`, `features/search-books`

#### Stage 7 — Detail drawer
- [ ] `features/select-book`
- [ ] `widgets/book-drawer` (Esc to close, framer-motion slide-in)
- [ ] `features/advance-stage`

#### Stage 8 — Drag & drop → **MVP-1 release**
- [ ] `features/move-book` with dnd-kit: across and within columns, `DragOverlay`, pointer and keyboard sensors
- [ ] Persist `status` + `position` through `useUpdateBook` (optimistic)
- [ ] Polish: empty columns, loading skeletons, responsive board, drawer focus management
- [ ] Merge `develop` → `main`

### MVP-2: Next.js backend

#### Stage 9 — SQLite + Route Handlers
- [ ] Drizzle + `@libsql/client`: `books` and `editors` schema, migrations (`drizzle-kit`), seed from mocks, `DATABASE_URL` in `.env.local`
- [ ] `GET /api/books`, `PATCH /api/books/[id]` validated with `bookSchema`
- [ ] Switch `booksApi.ts` to `fetch`. Hooks and UI stay unchanged
- [ ] Server prefetch + `HydrationBoundary`, `loading.tsx`, `error.tsx`

#### Stage 10 — Deploy
- [ ] Turso + Vercel, env vars, production migrations, demo link in README

### After MVP
- **Stats bento:** `widgets/stats-bento` (`StatBlock`, `MiniBars`, `DeadlineDots`, `EditorWorkload`)
- **Forms:** New Acquisition, column "add", notes. react-hook-form + zod, mutations via Server Actions
- **List and Calendar views** (routes or `?view=` search param)
- **E2E tests:** Playwright ("drag a card → reload → it stays")

## Component porting status

| Prototype (`design-reference/`)  | Destination                        | Status |
| -------------------------------- | ---------------------------------- | ------ |
| `TOKENS`                         | `@theme` in `app/globals.css`      | ✅     |
| `EDITORS`, `COLUMNS`, `CARDS` data | `entities/editor`, `entities/stage`, `entities/book` mocks | ✅ |
| `cls`, `fmtWords`                | `shared/lib`: `cn`, `formatWords`, `formatDate` | ✅ |
| `ManuscriptCard`                 | `entities/book/ui/BookCard`        | ✅     |
| `EditorChip`                     | `shared/ui/EditorChip`             | ✅     |
| `ProgressBar`                    | `shared/ui/ProgressBar`            | ✅     |
| `Dashed`                         | `shared/ui/Dashed`                 | ✅     |
| Kicker labels, padded counters   | `shared/ui/Kicker`, `shared/ui/Counter` | ✅ |
| `ghostBtn` / `solidBtn` / accent / "add" buttons | `shared/ui/Button` | ✅    |
| Drawer close button              | `shared/ui/IconButton`             | ✅     |
| Masthead search box              | `shared/ui/SearchInput`            | ✅     |
| Masthead editor avatars          | `shared/ui/AvatarStack`            | ✅     |
| `GenreTag`                       | inline in `BookCard`               | ✖ not a separate component (used once) |
| `Column`                         | `widgets/kanban-board/BoardColumn` | ⏳ Stage 5 |
| Footer                           | `widgets/page-footer`              | ⏳ Stage 5 |
| Masthead, search, tabs           | `widgets/masthead` + features      | ⏳ Stage 6 |
| `DetailDrawer`                   | `widgets/book-drawer`              | ⏳ Stage 7 |
| `StatBlock`, `MiniBars`, `DeadlineDots`, Editor workload | `widgets/stats-bento` | ⏳ post-MVP |
| `TweaksPanel`                    | not ported (design tool)           | ✖      |

## Known issues

1. ~~**`text-wrap-pretty` does nothing.**~~ Fixed in stage 3: `text-pretty`.
2. ~~**The urgent card's left border is dashed, not solid.**~~ Fixed in stage 3 with `[border-left-style:solid]`, which the built CSS orders after `border-dashed` and `border-l-2`.
3. ~~**FSD violation.** `shared/api/mockData.ts` imports from `@/entities/book`.~~ Fixed in stage 2: mocks live in entities.
4. ~~**Status model mismatch.** `BookStatus` had 5 values for 6 columns.~~ Fixed in stage 2 (model) and stage 3 (`BookCard`).
5. ~~**Unneeded `"use client"` in `ProgressBar`.**~~ Fixed in stage 3.
6. ~~**Word count suffix missing.**~~ Fixed in stage 3: `92.4k w`.
7. ~~**Font wiring doesn't follow the Next.js recipe.**~~ Fixed in stage 3: `--font-inter` / `--font-lora` / `--font-jetbrains-mono` on `<html>`, mapped in `@theme inline` (recipe: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`, Tailwind v4 section).
8. **Many arbitrary values.** Font sizes (`text-[10px]`, …) and letter-spacing (`tracking-[0.22em]`, …) still repeat in `BookCard` and will in the widgets. `Kicker` and `Counter` cover the most common cases; consider `--text-*` / `--tracking-*` tokens in `@theme` if the widgets add more.
9. **Unused dependencies until their stage:** dnd-kit, React Query, MobX, framer-motion, react-hook-form, @hookform/resolvers.
10. **`npm audit` warnings in dev tooling.** `brace-expansion` and `baseline-browser-mapping` come in through `eslint`, `eslint-config-next` and `next`. They don't ship to the browser; review with `npm audit` as a separate chore.
