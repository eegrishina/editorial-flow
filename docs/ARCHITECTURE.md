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
   **Exception: entities.** Domain entities reference each other (a book has a stage and an editor), so FSD allows cross-imports on the `entities` layer through an explicit **`@x` API**. The slice that is imported publishes a dedicated file per consumer:
   ```ts
   // entities/stage/@x/book.ts — what stage exposes to book
   export { STAGE_IDS, stageSchema } from "../model/stage";

   // entities/book/model/book.ts
   import { stageSchema } from "@/entities/stage/@x/book";
   ```
   Current links: `book → stage`, `book → editor`. Keep them one-directional (no cycles). Features and widgets never cross-import; a higher layer composes them.
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
| `@x/`    | Cross-import API for another entity (`@x/<consumer>.ts`) |

### Code conventions

- Component files in PascalCase (`BookCard.tsx`), named exports (`export const BookCard = …`).
- Props interface named `<Component>Props`. Accept `className` and merge it with `cn()`.
- Add `"use client"` only to components that use hooks, event handlers or browser APIs.
- Styles use Tailwind classes built on design tokens. No inline hex colors and no `style={{}}` for static values. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
- Path alias `@/*` points to `src/*`.
- Domain models are **zod schemas**; TypeScript types are inferred with `z.infer`, never written by hand next to a schema. Plain interfaces are fine for internal types (component props, store state).

### Tests

- [Vitest](https://vitest.dev/): `npm test` (watch) or `npm run test:run` (single run). Config: `vitest.config.mts`.
- Test files sit next to the code they test: `filterBooks.ts` → `filterBooks.test.ts`.
- Test data comes from factories (`makeBook.fixture.ts`), not from mocks, so tests don't break when mock content changes. Mocks get their own test that validates them against the schema.
- Environment is `jsdom`. Components are tested with React Testing Library: query by role, label or text (`getByRole("button", { name: "Close" })`), the way a user finds them. jest-dom adds matchers like `toBeInTheDocument` and `toHaveClass`. Setup lives in `vitest.setup.ts`.
- Tests check behavior and markup, not looks. Check visuals on the `/kit` page; for tricky CSS (e.g. which rule wins), inspect the built CSS.

## Slice map

### Current

```
src/
  app/              layout.tsx (fonts, metadata), page.tsx (card preview), globals.css (tokens),
                    kit/ (style guide page)
  entities/
    stage/          model/stage.ts (STAGE_IDS, stageSchema, STAGES), @x/book.ts
    editor/         model/editor.ts (editorSchema), model/mocks.ts, @x/book.ts
    book/           model/book.ts (bookSchema), model/mocks.ts,
                    lib/ (isUrgent, groupByStage, filterBooks), ui/BookCard.tsx
  shared/
    lib/            cn, formatDate, formatWords
    ui/             Button, IconButton, SearchInput, Kicker, Counter, Dashed,
                    ProgressBar, EditorChip, AvatarStack
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
    book/            model (bookSchema, mocks), api (booksApi, queries), lib (groupByStage, filterBooks), ui (BookCard)
    stage/           stageSchema + STAGES metadata
    editor/          editorSchema, mocks, (EditorChip)
  shared/
    ui/              Dashed, Button, IconButton, Kicker, Counter, SearchInput, AvatarStack, ProgressBar, EditorChip
    lib/             cn, formatDate, formatWords
    api/             (MVP-2) db client
```

## Data model

**One stage = one board column.** The book's `status` is the column it sits in.

`Stage` (`entities/stage`), in board order:

| `Stage`         | Column label         | Subtitle              |
| --------------- | -------------------- | --------------------- |
| `acquisition`   | Acquisition          | Submitted manuscripts |
| `developmental` | Developmental Edit   | Structural revision   |
| `copyedit`      | Copy Edit            | Line & consistency    |
| `design`        | Design & Typesetting | Cover & interior      |
| `proof`         | Final Proof          | Pre-press review      |
| `press`         | To Press             | Cleared for print     |

`Book` (`bookSchema` in `entities/book/model/book.ts`; the type is inferred with `z.infer`):

| Field        | Schema                        | Notes                                   |
| ------------ | ----------------------------- | --------------------------------------- |
| `id`         | non-empty string              | Manuscript ID, e.g. `MS-2041`           |
| `title`      | non-empty string              |                                         |
| `author`     | non-empty string              |                                         |
| `status`     | `Stage`                       | Column on the board                     |
| `position`   | integer ≥ 0                   | Order within the column (drag & drop)   |
| `genre`      | non-empty string              |                                         |
| `wordCount`  | integer ≥ 0                   |                                         |
| `chapters`   | integer ≥ 0                   |                                         |
| `submitted`  | ISO date `YYYY-MM-DD`         |                                         |
| `deadline`   | ISO date `YYYY-MM-DD`         |                                         |
| `progress`   | integer 0–100                 |                                         |
| `urgent`     | boolean                       | Deadline pressure; read it through `isUrgent` |
| `awaiting`   | boolean                       | Waiting for someone else's decision (committee, author, sign-off) |
| `note`       | string                        | Latest note (may be empty)              |
| `editor`     | `Editor`                      | Optional, embedded `{ id, name, avatarUrl? }` |
| `coverImage` | URL                           | Optional                                |

**Stage vs flags.** `status` says where a book is in the pipeline (its column). The flags mark what needs attention on top of that, in any column, and are independent: a book can be urgent and awaiting at once. "Awaiting" is not a stage; the work is paused until someone decides. `isUrgent` is the only place that decides urgency, so it can later become deadline-based without touching filters or UI.

The current user for the "Assigned to Me" tab is `MOCK_CURRENT_EDITOR_ID` (`entities/editor`) until there is auth.

In MVP-2 the source of truth for this shape will likely move to the Drizzle table, with zod schemas generated from it by `drizzle-zod`.

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

Before merging, each stage must pass `npm run lint`, `npx tsc --noEmit`, `npm run test:run` and `npm run build`.

A stage branch collects small commits as the work goes, and the PR to `develop` opens only when the whole stage is done.
