---
name: port-component
description: Port a component from the Claude Design prototype in design-reference/ into Editorial Flow. Converts inline styles to Tailwind classes on design tokens, places it in the right FSD layer, adapts it to the current domain model, adds a test and a /kit entry. Use whenever the user asks to port, move, recreate or implement a prototype piece (Column, DetailDrawer, masthead, footer, legend, StatBlock, MiniBars, DeadlineDots…), or to build a widget or feature whose look comes from design-reference, even if they don't say "port".
argument-hint: "<PrototypeComponent> [target slice]"
---

# Port a prototype component

`design-reference/` is a JSX prototype with inline styles (`style={{ color: T.ink50 }}`). The app rebuilds it with Tailwind on `@theme` tokens, FSD layers and zod-based domain types. The goal is the same look with the project's structure. Read the prototype, never import from it.

## 1. Read the source

- Find the component in `design-reference/components.jsx` or `app.jsx`, plus whatever it uses: `TOKENS`, `cls`, helpers, data shapes from `data.jsx`.
- Note every visual state (urgent, awaiting, selected, hover, empty, current stage) and every interaction.

## 2. Decide where it goes

Check the porting table in `docs/ROADMAP.md` first; it usually names the destination. Otherwise use the layer rules in `docs/ARCHITECTURE.md`:

| It… | Layer |
| --- | --- |
| knows nothing about the domain | `shared/ui` |
| renders a domain object | `entities/<x>/ui` |
| is one user interaction (filter, select, move) | `features/<x>` |
| is a page block composing several of the above | `widgets/<x>` |

Before writing markup, check `src/shared/ui` (`Button`, `IconButton`, `SearchInput`, `Kicker`, `Counter`, `Dashed`, `ProgressBar`, `EditorChip`, `AvatarStack`) and `entities/book` (`BookCard`, `groupByStage`, `filterBooks`, `isUrgent`). Reuse them instead of re-creating their classes; that's what keeps the kit consistent.

If the component needs Next.js APIs (`Link`, `Image`, fonts, server vs client boundaries, data fetching), read the matching guide in `node_modules/next/dist/docs/` first. Next 16 differs from older versions.

## 3. Translate the styles

`docs/DESIGN_SYSTEM.md` has the mappings: color tokens, the type scale, recurring patterns (surfaces, counters, status indicators, hover reveal) and the "Prototype → Tailwind" cheat sheet. Follow it, and keep these points in mind:

- No hex colors and no `style={{}}` for static values. If a color has no token, add one to `@theme` in `src/app/globals.css` first. Inline `style` is fine for truly dynamic values (a width computed from data).
- The accent means urgency and the current stage only. Hover states stay neutral (`ink/40` borders, `bg-ground`).
- Tailwind v4 spacing: 1 unit = 4px (`width: 22` → `size-5.5`).
- Use `Dashed` for standalone dividers and `border-dashed border-rule` for box borders. They look different on purpose.
- Arbitrary font sizes and tracking are acceptable when they match the type scale table. If a new value keeps repeating, mention known issue 8 rather than inventing tokens on your own.

## 4. Adapt to the domain model

Prototype data doesn't match the app's model. Use the real types through public APIs (`import { type Book, isUrgent } from "@/entities/book"`):

- `card.flag` → two booleans, `urgent` and `awaiting`. Read urgency through `isUrgent`.
- Columns → `Stage` and `STAGES` from `@/entities/stage`; the book's column is `status` and its order is `position`.
- Server data comes from `useBooks` / `useUpdateBook`. UI state (filter, query, selected book) goes to the MobX store from stage 6. Don't copy query data into `useState` or MobX.

## 5. Write the component

- PascalCase file, named export (`export const BoardColumn = …`), a `<Name>Props` interface, a `className` prop merged last with `cn()`.
- `"use client"` only if it uses hooks, event handlers or browser APIs. Keep it as low in the tree as possible.
- Export it from the slice's `index.ts` (create one for a new slice).
- Comments only for non-obvious mechanics (why a CSS rule order matters), never to describe the look.

## 6. Test it

A colocated `<Name>.test.tsx` (Vitest, jsdom, React Testing Library):

- Query by role, label or text, the way a user finds things.
- Build data with factories (`makeBook` from `entities/book/lib/makeBook.fixture.ts`), not with `MOCK_BOOKS`, so tests survive mock edits.
- Check behavior and markup (what renders for each state, what a click calls), not looks. `it.each` works well for variants; see `src/shared/ui/Counter.test.tsx`.

## 7. Add it to /kit

Add a `Section` to `src/app/kit/page.tsx` that shows every state side by side, so the user can compare it with the prototype. Demos that need state go into a sibling client file, like `src/app/kit/SearchDemo.tsx`.

## 8. Verify and update docs

- `npx tsc --noEmit`, `npm run lint`, `npx vitest run <path to the new test>`.
- Ask the user to compare `/kit` with the prototype, and name the states to look at.
- Update the porting table in `docs/ROADMAP.md`. For `shared/ui` components also update the components table in `docs/DESIGN_SYSTEM.md`, and for a new slice the "Current" slice map in `docs/ARCHITECTURE.md`. Docs are in English.

## 9. Report

Say what was created where, what was reused, and every deliberate deviation from the prototype with its reason (a missing token, a model difference, accessibility).
