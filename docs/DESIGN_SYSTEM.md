# Design System

The visual language comes from a Claude Design prototype (`design-reference/`): a printed production ledger. It uses a warm paper background, white cards with dashed hairlines, near-black ink and **one** accent color, a dark "ink red" for urgency.

The prototype is written with inline styles (`style={{ color: T.ink50 }}`). In this app every value comes from Tailwind classes built on the tokens in [`src/app/globals.css`](../src/app/globals.css).

## Color tokens

| Prototype `TOKENS` | Value                  | `@theme` variable | Tailwind classes                          | Use for                                 |
| ------------------ | ---------------------- | ----------------- | ----------------------------------------- | --------------------------------------- |
| `ground`           | `#F5F4F0`              | `--color-ground`  | `bg-ground`                               | Page background, column body            |
| `card`             | `#FFFFFF`              | `--color-card`    | `bg-card`                                 | Cards, panels, stat blocks, drawer      |
| `ink`              | `#1A1715`              | `--color-ink`     | `text-ink`, `bg-ink`, `outline-ink`       | Primary text, solid button, progress    |
| `ink70`            | `#3A3530`              | `--color-ink-70`  | `text-ink-70`                             | Secondary emphasis (rare)               |
| `ink50`            | `#6B655C`              | `--color-ink-50`  | `text-ink-50`                             | Labels, meta text, inactive tabs        |
| `ink30`            | `#9A9489`              | `--color-ink-30`  | `text-ink-30`                             | IDs, subtitles, footer, faint counters  |
| `rule`             | `#1A1715` @ 20%        | `--color-rule`    | `border-rule`                             | All dashed borders                      |
| `accent`           | `#8B0000`              | `--color-accent`  | `text-accent`, `bg-accent`, `border-l-accent` | Urgent state, current stage, primary CTA |

Hex + alpha in the prototype maps to Tailwind opacity modifiers:

| Prototype                    | Tailwind              |
| ---------------------------- | --------------------- |
| `${T.ink}14` (≈8%) progress track | `bg-ink/8`       |
| `${T.ink}33` (20%) inactive bar   | `bg-ink/20`      |
| `${T.ink}55` (≈33%) dashed chip   | `border-ink/33`  |
| `hover:bg-[#FAF9F6]` on ghost buttons | `hover:bg-ground/50` (no token for `#FAF9F6`) |
| `hover:bg-[#F5F4F0]`         | `hover:bg-ground`     |
| `color: "#fff"` on accent button | `text-card`       |

**Rule:** no hex values in components. If a color is missing, add a token to `@theme` first.

## Typography

Three families, each with a fixed role. They're loaded with `next/font` in `src/app/layout.tsx` and exposed as `--font-*` tokens.

| Token         | Family (current)   | Role                                                         |
| ------------- | ------------------ | ------------------------------------------------------------ |
| `font-serif`  | Lora (Playfair Display until stage 3) | Titles: masthead, section, column, card, drawer |
| `font-sans`   | Inter              | UI: labels, buttons, tabs, authors, notes                    |
| `font-mono`   | JetBrains Mono     | Data: manuscript IDs, dates, counters, percentages, word counts |

**Decision:** the serif is **Lora**, the prototype's default (it also offered Playfair Display, EB Garamond and DM Serif Display). The switch happens in stage 3 together with the font wiring fix, see [ROADMAP.md](ROADMAP.md).

### Type scale used in the prototype

| Element               | Classes                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| Masthead title        | `font-serif text-[48px] font-medium leading-none tracking-[-0.015em]`     |
| Stat value            | `font-sans text-[44px] font-medium leading-none tracking-[-0.02em] tabular-nums` |
| Drawer title          | `font-serif text-[28px] font-medium leading-[1.1] text-pretty`            |
| Section title         | `font-serif text-2xl font-medium`                                         |
| Card title            | `font-serif text-[19px] font-medium leading-[1.15] text-pretty`           |
| Column title          | `font-serif text-[17px] font-medium`                                      |
| Tab label             | `font-sans text-[13px] font-medium` (active: `font-semibold text-ink`)    |
| Body / note           | `font-sans text-[13px] leading-relaxed text-pretty`                       |
| Author / list text    | `font-sans text-xs` (12px)                                                |
| Column subtitle       | `font-sans text-[11px] text-ink-30`                                       |
| Kicker / label        | `font-sans text-[10px] uppercase tracking-[0.22em] text-ink-50`           |
| Mono data             | `font-mono text-[10px] tabular-nums`                                      |
| Micro flag / dl term  | `font-sans text-[9px] font-medium uppercase tracking-[0.2em]`             |

Letter-spacing on uppercase labels ranges from `0.14em` to `0.28em`. Use `0.22em` for kickers, `0.18em` for buttons and `0.2em` for flags.

## Recurring patterns

### Surfaces

```txt
Card / panel      bg-card border border-dashed border-rule
Column body       bg-ground border border-dashed border-rule border-t-0
Dashed hairline   <Dashed />   (shared/ui, planned)
```

`Dashed` reproduces the prototype's hairline: a `repeating-linear-gradient` with 4px dashes and 4px gaps in `ink` at 18% opacity. This looks different from the browser's `border-dashed`. Use `Dashed` for standalone dividers and `border-dashed border-rule` for box borders.

### Buttons

```txt
Ghost   flex items-center gap-2 px-3 py-2 bg-card border border-dashed border-rule
        font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink hover:bg-ground/50
Solid   flex items-center gap-2 px-3 py-2 bg-ink text-ground
        font-sans text-[10px] font-medium uppercase tracking-[0.18em]
Accent  flex items-center justify-center gap-2 py-2.5 bg-accent text-card
        font-sans text-[10px] font-semibold uppercase tracking-[0.2em]
Add     (column) flex items-center justify-center gap-1.5 py-2 border border-dashed border-rule
        text-[10px] uppercase tracking-[0.18em] text-ink-50 hover:bg-card
```

These will become `<Button variant="ghost | solid | accent">` in `shared/ui`.

### Counters and numbers

Counters are mono, use `tabular-nums` and are padded to two digits: `03`, `14`, `08%`.

```tsx
<span className="font-mono text-[10px] tabular-nums text-ink-50">
  {String(count).padStart(2, "0")}
</span>
```

Urgent counters in a column header use `text-accent` and read `· 2!`.

### Status indicators

| State        | Markup                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Urgent flag  | dot `inline-block h-1.5 w-1.5 rounded-full bg-accent` + label `text-[9px] font-medium uppercase tracking-[0.2em] text-accent` |
| Review flag  | `◌ review`, same label classes with `text-ink-50`                                               |
| Urgent card  | 2px solid accent left border (see [known issues](ROADMAP.md#known-issues)), deadline in `text-accent`, progress bar in `bg-accent` |
| Selected card| `outline outline-ink -outline-offset-1`                                                         |
| Stage / load square | filled `block h-2 w-2 bg-ink` (current: `bg-accent`), empty `h-2 w-2 border border-dashed border-ink/33` |

### Hover reveal

Card metadata (genre, words, chapters) expands on hover through grid row interpolation. The custom utilities live in `globals.css`:

```tsx
<article className="group …">
  <div className="grid transition-all duration-300 ease-out grid-template-rows-0 group-hover:grid-template-rows-1">
    <div className="overflow-hidden">…</div>
  </div>
</article>
```

This replaces the prototype's `<style>` tag with `[data-hover-reveal]`.

### Icons

`lucide-react`, thin strokes: `strokeWidth={1.5}` (1.4 for the logo, 1.6–1.8 for small action icons). Sizes are 10–13px inline and 20px for the logo.

## Prototype → Tailwind cheat sheet

Taken from porting `ManuscriptCard` to `entities/book/ui/BookCard.tsx`:

| Prototype (inline style)                                   | Tailwind                                  |
| ---------------------------------------------------------- | ----------------------------------------- |
| `style={{ background: T.card }}`                           | `bg-card`                                 |
| `style={{ border: \`1px dashed ${T.rule}\` }}`             | `border border-dashed border-rule`        |
| `style={{ borderTop: \`1px dashed ${T.rule}\` }}`          | `border-t border-dashed border-rule`      |
| `style={{ color: T.ink50 }}`                               | `text-ink-50`                             |
| `fontFamily: "Inter, sans-serif"`                          | `font-sans` (or nothing: body default)    |
| `fontSize: 19, fontWeight: 500`                            | `text-[19px] font-medium`                 |
| `textWrap: "pretty"`                                       | `text-pretty`                             |
| `letterSpacing: "-0.02em"`                                 | `tracking-[-0.02em]`                      |
| `width: 22, height: 22`                                    | `size-5.5` (v4 spacing scale: 1 unit = 4px) |
| `height: 3`                                                | `h-0.75`                                  |
| `minWidth: 26`                                             | `min-w-6.5`                               |
| `outline: 1px solid ink; outlineOffset: -1`                | `outline outline-ink -outline-offset-1`   |
| `gridTemplateColumns: "1.4fr 1.4fr 1fr 1fr 1.3fr"`         | `grid-cols-[1.4fr_1.4fr_1fr_1fr_1.3fr]`   |
| `cls(a, cond && b)`                                        | `cn(a, cond && b)` (`@/shared/lib`)       |
| `window.lucide.Calendar`                                   | `import { Calendar } from "lucide-react"` |

## Not ported

`design-reference/tweaks-panel.jsx` is a Claude Design tool for live font switching, not part of the product. The fonts it offers are listed under [Typography](#typography).

Note: the cheat sheet above was written while `BookCard` lived in the working tree. That code is set aside until stage 3 and isn't in `develop` yet.
