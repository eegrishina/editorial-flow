<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions

Editorial Flow is a kanban board for a book publishing workflow: Next.js 16 App Router, React 19, Tailwind CSS v4, Feature-Sliced Design. Read these before changing code:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): layers, import rules, data model, data flow, git workflow
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): tokens, typography, patterns, prototype → Tailwind mapping
- [docs/ROADMAP.md](docs/ROADMAP.md): current stage and known issues

## Rules

- **FSD layers:** `app → widgets → features → entities → shared`. Import only from lower layers, and only through a slice's `index.ts` (`@/entities/book`, not `@/entities/book/ui/BookCard`). Slices on the same layer don't import each other, except entities through the `@x` cross-import API (`@/entities/stage/@x/book`).
- **Domain models:** zod schemas in `entities/*/model`; types via `z.infer`, not hand-written interfaces.
- **Tests:** Vitest, colocated `*.test.ts`; build test data with factories (`*.fixture.ts`), not mocks.
- **Styling:** Tailwind classes built on `@theme` tokens from `src/app/globals.css` (`bg-card`, `text-ink-50`, `border-rule`, `text-accent`). No hex colors and no inline `style` for static values. Merge classes with `cn()` from `@/shared/lib`. Use `shared/ui` components (`Button`, `Kicker`, `Counter`, …) before writing their classes by hand; check visuals on `/kit`.
- **Components:** PascalCase files, named exports, a `<Name>Props` interface, accept `className`. Add `"use client"` only when hooks, handlers or browser APIs are used.
- **State:** React Query for server data (book list, mutations with optimistic updates). MobX for UI state only (filter, search, selected book). Never copy server data into MobX.
- **Data:** mocks live in `entities/*/model`. Data access goes through `entities/book/api/booksApi.ts`, the single seam between the mock API (MVP-1) and Route Handlers + SQLite (MVP-2).
- **Design reference:** `design-reference/` is the Claude Design prototype. Read it to match the design, but never import from it.
- **Docs:** written in English. Update `docs/ROADMAP.md` (checkboxes, porting status, known issues) when a stage lands.
- **Checks before commit:** `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run build`. Commits follow Conventional Commits.
