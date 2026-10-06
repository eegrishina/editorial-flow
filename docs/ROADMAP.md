# Roadmap

The work is split into two MVPs:
- **MVP-1:** the full UI working on an in-memory mock API.
- **MVP-2:** the same UI on a real Next.js backend (Route Handlers + SQLite), deployed.

Each stage gets its own branch from `develop` and must pass `npm run lint`, `npx tsc --noEmit` and `npm run build` before merging. See [ARCHITECTURE.md](ARCHITECTURE.md#git-workflow).

## Stages

### Stage 0 — Repository setup ✅
- [x] Commit the book entity work on `feat/book-entity-setup`
- [x] Create `develop` from `main`
- [x] Move the prototype to `design-reference/`, exclude it from ESLint and TypeScript
- [ ] Merge `feat/book-entity-setup` into `develop`

### Stage 1 — Documentation ✅
- [x] README, ARCHITECTURE, DESIGN_SYSTEM, ROADMAP, project conventions in AGENTS.md
- Keep updating the docs as each stage lands

### MVP-1: UI on mocks

#### Stage 2 — Clean-up and domain model
- [ ] Fix the small issues in [known issues](#known-issues) (1–6)
- [ ] Settle font wiring and the default serif (Lora vs Playfair Display)
- [ ] `entities/stage`: `Stage` type (6 values) + `STAGES` metadata
- [ ] `entities/book`: `status: Stage`, add `note`, `submitted`, `position`; `bookSchema` (zod) as the source of truth
- [ ] `entities/editor`: `Editor` type and mocks
- [ ] Move mocks from `shared/api/mockData.ts` into `entities/*/model/mocks.ts`
- [ ] `entities/book/lib`: `groupByStage`, `filterBooks`, `isUrgent`
- [ ] (optional) Vitest for `shared/lib` and `entities/book/lib`

#### Stage 3 — UI kit (`shared/ui`)
- [ ] `Dashed`, `Button` (ghost / solid / accent), `IconButton`, `Kicker`, `Counter`, `Tag`, `SearchInput`, `AvatarStack`

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
- **Tests:** Testing Library, Playwright e2e ("drag a card → reload → it stays")

## Component porting status

| Prototype (`design-reference/`)  | Destination                        | Status |
| -------------------------------- | ---------------------------------- | ------ |
| `TOKENS`                         | `@theme` in `app/globals.css`      | ✅     |
| `cls`, `fmtWords`                | `shared/lib`: `cn`, `formatWords`  | ✅     |
| `ManuscriptCard`                 | `entities/book/ui/BookCard`        | ✅     |
| `EditorChip`                     | `shared/ui/EditorChip`             | ✅     |
| `ProgressBar`                    | `shared/ui/ProgressBar`            | ✅     |
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
3. **FSD violation.** `shared/api/mockData.ts` imports from `@/entities/book`. Mocks and `COLUMNS` belong in `entities`.
4. **Status model mismatch.** `BookStatus` has 5 values but the board has 6 columns, and Developmental and Copy Edit both map to `editing`. `note` and `submitted` are missing. See [ARCHITECTURE.md](ARCHITECTURE.md#data-model).
5. **Unneeded `"use client"`.** `ProgressBar` uses no hooks or handlers.
6. **Word count suffix missing.** The card shows `92.4k`, the prototype `92.4k w`.
7. **Font wiring doesn't follow the Next.js recipe.** `@theme` hardcodes the family names, while `next/font` sets same-named `--font-*` variables on `<body>`, so `<html>`-level styles (Preflight) never see the loaded fonts. The recipe in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (Tailwind v4 section) is: give each font its own variable (`variable: "--font-inter"`), put the classes on `<html>`, and map them in CSS with `@theme inline { --font-sans: var(--font-inter); }`.
8. **Many arbitrary values.** Font sizes (`text-[10px]`, …) and letter-spacing (`tracking-[0.22em]`, …) repeat everywhere. Consider adding `--text-*` and `--tracking-*` tokens to `@theme`, or covering them with `Kicker` / `Counter` components.
9. **Unused dependencies until their stage:** dnd-kit, React Query, MobX, framer-motion, react-hook-form, zod, @hookform/resolvers.
