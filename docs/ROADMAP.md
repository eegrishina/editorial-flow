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

#### Stage 3 — UI kit (`feat/ui-kit`)
- [ ] Font wiring per the Next.js recipe ([known issue 7](#known-issues)); serif switches to **Lora**
- [ ] Bring back the early UI work: `shared/lib` (`cn`, `formatDate`, `formatWords`), `EditorChip`, `ProgressBar`, `BookCard` + hover reveal utilities
- [ ] Adapt `BookCard` to the new `Book` model and fix [known issues](#known-issues) 1, 2, 5, 6
- [ ] New kit components: `Dashed`, `Button` (ghost / solid / accent), `IconButton`, `Kicker`, `Counter`, `Tag`, `SearchInput`, `AvatarStack`
- [ ] Component tests: `jsdom` + React Testing Library

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
| `cls`, `fmtWords`                | `shared/lib`: `cn`, `formatWords`  | ⏸ written, returns in stage 3 |
| `ManuscriptCard`                 | `entities/book/ui/BookCard`        | ⏸ written, returns in stage 3 |
| `EditorChip`                     | `shared/ui/EditorChip`             | ⏸ written, returns in stage 3 |
| `ProgressBar`                    | `shared/ui/ProgressBar`            | ⏸ written, returns in stage 3 |
| `Dashed`                         | `shared/ui/Dashed`                 | ⏳ Stage 3 |
| `GenreTag`                       | `shared/ui/Tag`                    | ⏳ Stage 3 (inlined in BookCard for now) |
| `ghostBtn` / `solidBtn` / accent button | `shared/ui/Button`          | ⏳ Stage 3 |
| `Column`                         | `widgets/kanban-board/BoardColumn` | ⏳ Stage 5 |
| Footer                           | `widgets/page-footer`              | ⏳ Stage 5 |
| Masthead, search, tabs           | `widgets/masthead` + features      | ⏳ Stage 6 |
| `DetailDrawer`                   | `widgets/book-drawer`              | ⏳ Stage 7 |
| `StatBlock`, `MiniBars`, `DeadlineDots`, Editor workload | `widgets/stats-bento` | ⏳ post-MVP |
| `TweaksPanel`                    | not ported (design tool)           | ✖      |

## Known issues

1. **`text-wrap-pretty` does nothing.** It isn't a Tailwind v4 class (`BookCard.tsx`). Use `text-pretty`.
2. **The urgent card's left border is dashed, not solid.** `border-dashed` sets every side and Tailwind has no per-side border style. The prototype uses `2px solid accent`. Fix with an arbitrary property, e.g. `[border-left-style:solid]`.
3. ~~**FSD violation.** `shared/api/mockData.ts` imports from `@/entities/book`.~~ Fixed in stage 2: mocks live in entities.
4. ~~**Status model mismatch.** `BookStatus` had 5 values for 6 columns.~~ Fixed in stage 2: `status` is a `Stage`. `BookCard` still has to be adapted in stage 3.
5. **Unneeded `"use client"`.** `ProgressBar` uses no hooks or handlers.
6. **Word count suffix missing.** The card shows `92.4k`, the prototype `92.4k w`.
7. **Font wiring doesn't follow the Next.js recipe.** `@theme` hardcodes the family names, while `next/font` sets same-named `--font-*` variables on `<body>`, so `<html>`-level styles (Preflight) never see the loaded fonts. The recipe in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (Tailwind v4 section) is: give each font its own variable (`variable: "--font-inter"`), put the classes on `<html>`, and map them in CSS with `@theme inline { --font-sans: var(--font-inter); }`.
8. **Many arbitrary values.** Font sizes (`text-[10px]`, …) and letter-spacing (`tracking-[0.22em]`, …) repeat everywhere. Consider adding `--text-*` and `--tracking-*` tokens to `@theme`, or covering them with `Kicker` / `Counter` components.
9. **Unused dependencies until their stage:** dnd-kit, React Query, MobX, framer-motion, react-hook-form, @hookform/resolvers.
10. **`npm audit` warnings in dev tooling.** `brace-expansion` and `baseline-browser-mapping` come in through `eslint`, `eslint-config-next` and `next`. They don't ship to the browser; review with `npm audit` as a separate chore.
