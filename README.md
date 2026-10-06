# Editorial Flow

A production board for a book publishing house. Every manuscript moves through six stages, from **Acquisition** to **To Press**. Editors follow deadlines, progress and workload on a kanban board styled like a printed ledger.

> Status: early development. The UI is being ported from a Claude Design prototype (`design-reference/`) to Next.js + Tailwind, following Feature-Sliced Design. See the [roadmap](docs/ROADMAP.md).

## Features (planned for MVP)

- **Kanban board** with six production stages and manuscript cards
- **Masthead** with search (title, author, manuscript ID) and tabs: All / Assigned to me / Urgent
- **Detail drawer** with metadata, progress, latest note, stage timeline and an "Advance stage" action
- **Drag & drop** between and within columns, with optimistic updates
- Later: stats bento, create/edit forms, list and calendar views

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script          | What it does                                   |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start the dev server                           |
| `npm run build` | Production build                               |
| `npm run start` | Serve the production build                     |
| `npm run lint`  | ESLint (flat config, Next.js core-web-vitals)  |
| `npm test`      | Vitest in watch mode                           |
| `npm run test:run` | Vitest, single run                          |

A pre-commit hook (husky + lint-staged) runs `eslint --fix` on staged `*.ts` / `*.tsx` files.

## Tech stack

| Area          | Library                                            | Status      |
| ------------- | -------------------------------------------------- | ----------- |
| Framework     | Next.js 16 (App Router, React Compiler), React 19  | in use      |
| Styling       | Tailwind CSS v4 (`@theme` tokens), `clsx` + `tailwind-merge` | in use |
| Icons         | `lucide-react`                                     | in use      |
| Fonts         | `next/font`: Inter, Lora, JetBrains Mono           | in use      |
| Validation    | `zod` (domain schemas, types via `z.infer`)        | in use      |
| Tests         | Vitest, React Testing Library, jest-dom, jsdom     | in use      |
| Server state  | `@tanstack/react-query`                            | planned     |
| UI state      | `mobx` + `mobx-react-lite`                         | planned     |
| Drag & drop   | `@dnd-kit/core`, `@dnd-kit/sortable`               | planned     |
| Animation     | `framer-motion`                                    | planned     |
| Forms         | `react-hook-form` + `@hookform/resolvers` (zod)    | planned     |
| Database      | SQLite via Drizzle ORM (Turso in production)       | planned (MVP-2) |
| Tooling       | TypeScript (strict), ESLint 9, husky, lint-staged  | in use      |

## Project structure

```
src/
  app/        # Next.js routes, root layout, providers, global styles
  widgets/    # composite page blocks (board, masthead, drawer, …)
  features/   # user interactions (filter, search, move book, …)
  entities/   # domain: book, stage, editor
  shared/     # ui kit, lib helpers, api base
design-reference/   # Claude Design prototype (reference only, not built)
docs/               # project documentation
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md): FSD layers, import rules, data model, data flow, git workflow
- [Design system](docs/DESIGN_SYSTEM.md): tokens, typography, recurring patterns, prototype → Tailwind cheat sheet
- [Roadmap](docs/ROADMAP.md): stages, component porting status, known issues
