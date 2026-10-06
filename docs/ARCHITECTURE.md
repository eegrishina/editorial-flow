# Architecture

Editorial Flow follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD) on top of the Next.js App Router.

> **Next.js 16 note.** This version has breaking changes compared to older Next.js. Before writing routing, data-fetching, caching or font code, read the bundled docs in `node_modules/next/dist/docs/`.

## Layers

```
app → widgets → features → entities → shared
```

| Layer      | Responsibility                                                        | Examples                                   |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------ |
| `app`      | Routes (`page.tsx`, `layout.tsx`), providers, global styles. Composes widgets. | `app/page.tsx`, `app/providers.tsx` |
| `widgets`  | Self-contained page blocks that combine features and entities.        | `kanban-board`, `masthead`, `book-drawer`  |
| `features` | One user interaction each, with its own UI and logic.                 | `filter-books`, `move-book`                |
| `entities` | Domain objects: types, schemas, mocks, API, presentational UI.        | `book`, `stage`, `editor`                  |
| `shared`   | Code with no domain knowledge: UI kit, helpers, API client base.      | `Button`, `cn`, `formatDate`               |

Next.js's `app/` directory doubles as the FSD `app` layer. FSD's `pages` layer isn't used: route files in `app/` compose widgets directly.

### Import rules

1. A layer imports **only from layers below it**. `shared` imports nothing from the project, and `entities` never imports from `features`.
2. Slices on the same layer don't import each other. For example, `features/filter-books` must not import from `features/search-books`. Shared logic moves down a layer.
3. Code outside a slice imports it **only through its public API** (`index.ts`):
   ```ts
   import { BookCard, type Book } from "@/entities/book";       // ✅
   import { BookCard } from "@/entities/book/ui/BookCard";      // ❌
   ```
4. `shared` segments may expose their own `index.ts` (`@/shared/ui`, `@/shared/lib`).
5. Nothing imports from `design-reference/`.

### Segments

Inside a slice, code is grouped by purpose:

| Segment  | Contents                                                 |
| -------- | -------------------------------------------------------- |
| `ui/`    | React components                                         |
| `model/` | Types, zod schemas, mocks, stores                        |
| `api/`   | Data access functions, React Query options and hooks     |
| `lib/`   | Pure helpers specific to the slice                       |

### Code conventions

- Component files in PascalCase (`BookCard.tsx`), named exports (`export const BookCard = …`).
- Props interface named `<Component>Props`. Accept `className` and merge it with `cn()`.
- Add `"use client"` only to components that use hooks, event handlers or browser APIs.
- Styles use Tailwind classes built on design tokens. No inline hex colors and no `style={{}}` for static values. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
- Path alias `@/*` points to `src/*`.

## Slice map

### Current

```
src/
  app/            layout.tsx (fonts, metadata), page.tsx (card preview), globals.css (tokens)
  entities/book/  model/types.ts, ui/BookCard.tsx
  shared/ui/      EditorChip, ProgressBar
  shared/lib/     cn, formatDate, formatWords
  shared/api/     mockData.ts   ← violates FSD (imports entities); to be moved
```

### Target (MVP)

```
src/
  app/
    layout.tsx, page.tsx, providers.tsx (QueryClient + MobX store), loading.tsx, error.tsx
    api/books/…                     (MVP-2: Route Handlers)
  widgets/
    masthead/        logo, title, search, actions, editor avatars, tabs
    kanban-board/    BoardColumn, legend, horizontal scroll
    book-drawer/     detail panel
    page-footer/
    stats-bento/     (post-MVP) StatBlock, MiniBars, DeadlineDots, EditorWorkload
  features/
    filter-books/    tabs All / Mine / Urgent
    search-books/    search input
    select-book/     card selection → drawer
    advance-stage/   "Advance stage" button
    move-book/       drag & drop (dnd-kit)
  entities/
    book/            model (Book, bookSchema, mocks), api (booksApi, queries), lib (groupByStage, filterBooks), ui (BookCard)
    stage/           Stage type + STAGES metadata
    editor/          Editor type, mocks, (EditorChip)
  shared/
    ui/              Dashed, Button, IconButton, Kicker, Counter, Tag, SearchInput, AvatarStack, ProgressBar, EditorChip
    lib/             cn, formatDate, formatWords
    api/             (MVP-2) db client
```

## Data model

**One stage = one board column.** The book's `status` is the column it sits in.

| Stage (target `status`) | Column label         | Subtitle              | Current `BookStatus` |
| ----------------------- | -------------------- | --------------------- | -------------------- |
| `acquisition`           | Acquisition          | Submitted manuscripts | `manuscript`         |
| `developmental`         | Developmental Edit   | Structural revision   | `editing`            |
| `copyedit`              | Copy Edit            | Line & consistency    | `editing`            |
| `design`                | Design & Typesetting | Cover & interior      | `design`             |
| `proof`                 | Final Proof          | Pre-press review      | `proofreading`       |
| `press`                 | To Press             | Cleared for print     | `ready`              |

Currently both edit columns map to `editing`, which is why the model has to change.

Target `Book` (zod schema `bookSchema` in `entities/book/model`, types inferred with `z.infer`):

| Field        | Type                              | Notes                                   |
| ------------ | --------------------------------- | --------------------------------------- |
| `id`         | `string`                          | Manuscript ID, e.g. `MS-2041`           |
| `title`      | `string`                          |                                         |
| `author`     | `string`                          |                                         |
| `status`     | `Stage`                           | Column on the board                     |
| `position`   | `number`                          | Order within the column (drag & drop)   |
| `genre`      | `string`                          |                                         |
| `wordCount`  | `number`                          |                                         |
| `chapters`   | `number`                          |                                         |
| `submitted`  | `string` (ISO date)               | New, from the prototype                 |
| `deadline`   | `string` (ISO date)               |                                         |
| `progress`   | `number` (0–100)                  |                                         |
| `flag`       | `"urgent" \| "review" \| "none"`  | Optional                                |
| `note`       | `string`                          | Latest note, new, from the prototype    |
| `editor`     | `Editor`                          | Optional                                |

## Data flow

Server data and UI state are kept strictly apart.

```
           ┌──────────── UI state (MobX) ─────────────┐
           │ BoardUiStore: filter, query, selectedId  │
           └──────────────────────────────────────────┘
widgets / features
           │ useBooks(), useUpdateBook()
           ▼
   React Query cache  ── optimistic update + rollback on error
           │ queryFn / mutationFn
           ▼
   entities/book/api/booksApi.ts
           │
           ├─ MVP-1: in-memory mock API (async, artificial delay)
           └─ MVP-2: fetch("/api/books") → Route Handlers → Drizzle → SQLite (Turso in prod)
```

- **React Query** owns everything that comes from the "server": the book list and mutations (move, advance stage).
- **MobX** owns UI state only. Never copy server data into a MobX store; derive filtered lists from the query data plus the store's filter.
- `booksApi.ts` is the seam: going from MVP-1 to MVP-2 changes only its implementation, never the hooks or components.
- MVP-2 also prefetches on the server: `page.tsx` (Server Component) calls `prefetchQuery`, and the client hydrates through `HydrationBoundary`.
- Post-MVP forms will use **Server Actions**, so the project shows both mutation styles.

## Git workflow

| Branch    | Purpose                                                   |
| --------- | --------------------------------------------------------- |
| `main`    | Releases (MVP-1, MVP-2, …)                                |
| `develop` | Integration branch; all work merges here                  |
| `feat/*`  | A feature or roadmap stage, branched from `develop`       |
| `docs/*`  | Documentation-only changes, branched from `develop`       |
| `fix/*`   | Bug fixes, branched from `develop`                        |

Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

Before merging, each stage must pass `npm run lint`, `npx tsc --noEmit` and `npm run build`.
