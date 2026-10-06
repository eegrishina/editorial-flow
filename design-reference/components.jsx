// Editorial Flow — UI atoms (v2: clean + high-contrast)

const { useState, useMemo, useEffect, useRef } = React;
const L = window.lucide;

// ---------- design tokens ----------
const TOKENS = {
  ground:   "#F5F4F0",  // app background — soft warm-gray
  card:     "#FFFFFF",
  ink:      "#1a1715",
  ink70:    "#3a3530",
  ink50:    "#6b655c",
  ink30:    "#9a9489",
  rule:     "#1a171533", // dashed border color
  accent:   "#8B0000",   // single ink-red accent
};

// ---------- helpers ----------
const cls = (...xs) => xs.filter(Boolean).join(" ");
const fmtWords = (n) =>
  n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k" : String(n);

// ---------- dashed hairline ----------
function Dashed({ vertical, className = "", style = {} }) {
  return (
    <div
      aria-hidden
      className={cls(
        "shrink-0",
        vertical ? "w-px self-stretch" : "h-px w-full",
        className,
      )}
      style={{
        backgroundImage: vertical
          ? `repeating-linear-gradient(to bottom, ${TOKENS.ink} 0 4px, transparent 4px 8px)`
          : `repeating-linear-gradient(to right, ${TOKENS.ink} 0 4px, transparent 4px 8px)`,
        opacity: 0.18,
        ...style,
      }}
    />
  );
}

// ---------- Editor monogram — unified neutral chip ----------
function EditorChip({ editor, size = 22, mono = true }) {
  if (!editor) return null;
  return (
    <span
      className={cls(
        "inline-flex items-center justify-center rounded-full",
        mono ? "font-mono" : "font-sans",
        "text-[10px] tracking-[0.04em]",
      )}
      style={{
        width: size,
        height: size,
        background: "transparent",
        color: TOKENS.ink,
        border: `1px dashed ${TOKENS.ink}55`,
      }}
      title={editor.name}
    >
      {editor.initials}
    </span>
  );
}

// ---------- Genre tag (used on hover / drawer only) ----------
function GenreTag({ children }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.14em]"
      style={{ color: TOKENS.ink50 }}
    >
      {children}
    </span>
  );
}

// ---------- subtle linear progress bar ----------
function ProgressBar({ value, accent }) {
  const color = accent || TOKENS.ink;
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="relative h-[3px] flex-1"
        style={{ background: `${TOKENS.ink}14` }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${value}%`,
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span
        className="font-mono text-[10px] tabular-nums"
        style={{ color: TOKENS.ink50, minWidth: 26, textAlign: "right" }}
      >
        {value.toString().padStart(2, "0")}%
      </span>
    </div>
  );
}

// ---------- Stat block (white card) ----------
function StatBlock({ kicker, value, unit, foot, icon, accent, children, valueMono }) {
  const Icon = icon;
  const valueColor = accent || TOKENS.ink;
  return (
    <div
      className="relative flex h-full flex-col justify-between p-5"
      style={{
        background: TOKENS.card,
        border: `1px dashed ${TOKENS.rule}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon size={13} strokeWidth={1.5} style={{ color: accent || TOKENS.ink50 }} />
          ) : null}
          <span
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: TOKENS.ink50, fontFamily: "Inter, sans-serif" }}
          >
            {kicker}
          </span>
        </div>
        {foot ? (
          <span
            className="font-mono text-[10px] tracking-[0.12em]"
            style={{ color: TOKENS.ink30 }}
          >
            {foot}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span
            className={cls("leading-none tabular-nums", valueMono ? "font-mono" : "font-sans")}
            style={{
              fontSize: 44,
              color: valueColor,
              fontWeight: valueMono ? 500 : 500,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </span>
          {unit ? (
            <span
              className="text-[11px] uppercase tracking-[0.16em]"
              style={{ color: TOKENS.ink50, fontFamily: "Inter, sans-serif" }}
            >
              {unit}
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

// ---------- mini bars ----------
function MiniBars({ data, accent }) {
  const color = accent || TOKENS.ink;
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-[36px] items-end gap-[3px] justify-end">
      {data.map((v, i) => (
        <span
          key={i}
          className="block w-[5px]"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}33`,
          }}
        />
      ))}
    </div>
  );
}

// ---------- deadline dots ----------
function DeadlineDots({ items }) {
  return (
    <div className="flex items-end gap-[8px] justify-end">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <span
            className="block"
            style={{
              width: 7,
              height: 7,
              borderRadius: 9999,
              background: it.urgent ? TOKENS.accent : TOKENS.ink,
              opacity: it.count === 0 ? 0.12 : 1,
            }}
          />
          <span
            className="font-mono text-[9px]"
            style={{ color: TOKENS.ink30, letterSpacing: "0.06em" }}
          >
            {it.day}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------- Card (clean — Title / Author / Deadline / progress; rest on hover) ----------
function ManuscriptCard({ card, editors, selected, onSelect }) {
  const editor = editors[card.editor];
  const urgent = card.flag === "urgent";
  const review = card.flag === "review";

  return (
    <article
      onClick={onSelect}
      className={cls(
        "group relative cursor-pointer overflow-hidden transition-colors",
        "px-4 pt-3.5 pb-3",
      )}
      style={{
        background: TOKENS.card,
        border: `1px dashed ${TOKENS.rule}`,
        borderLeft: urgent ? `2px solid ${TOKENS.accent}` : `1px dashed ${TOKENS.rule}`,
        outline: selected ? `1px solid ${TOKENS.ink}` : "none",
        outlineOffset: selected ? "-1px" : "0",
      }}
    >
      {/* top row: id + flag + editor */}
      <header className="flex items-center justify-between">
        <span
          className="font-mono text-[10px] tracking-[0.14em]"
          style={{ color: TOKENS.ink30 }}
        >
          № {card.id}
        </span>
        <div className="flex items-center gap-2">
          {urgent && (
            <span
              className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em]"
              style={{ color: TOKENS.accent, fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: TOKENS.accent }} />
              urgent
            </span>
          )}
          {review && (
            <span
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ color: TOKENS.ink50, fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              ◌ review
            </span>
          )}
          <EditorChip editor={editor} />
        </div>
      </header>

      {/* title (serif) */}
      <h3
        className="mt-3 font-serif leading-[1.15]"
        style={{
          fontSize: 19,
          color: TOKENS.ink,
          fontWeight: 500,
          textWrap: "pretty",
        }}
      >
        {card.title}
      </h3>

      {/* author (sans) */}
      <div
        className="mt-1 text-[12px]"
        style={{ color: TOKENS.ink50, fontFamily: "Inter, sans-serif" }}
      >
        {card.author}
      </div>

      {/* footer: deadline + progress */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex items-center gap-1.5"
          style={{ color: urgent ? TOKENS.accent : TOKENS.ink50 }}
        >
          <L.Calendar size={11} strokeWidth={1.6} />
          <span className="font-mono text-[10px] tracking-[0.1em]">
            {card.due}
          </span>
        </div>
        <div className="flex-1">
          <ProgressBar value={card.progress} accent={urgent ? TOKENS.accent : TOKENS.ink} />
        </div>
      </div>

      {/* hover reveal: extra metadata */}
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: "0fr",
          marginTop: 0,
        }}
        data-hover-reveal
      >
        <div className="overflow-hidden">
          <div
            className="mt-3 pt-3 flex items-center justify-between"
            style={{ borderTop: `1px dashed ${TOKENS.rule}` }}
          >
            <GenreTag>{card.genre}</GenreTag>
            <div
              className="flex items-center gap-3 font-mono text-[10px]"
              style={{ color: TOKENS.ink50 }}
            >
              <span className="flex items-center gap-1">
                <L.FileText size={10} strokeWidth={1.5} />
                {fmtWords(card.words)} w
              </span>
              <span className="flex items-center gap-1">
                <L.BookOpen size={10} strokeWidth={1.5} />
                {card.chapters} ch
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        article.group:hover [data-hover-reveal] { grid-template-rows: 1fr !important; }
      `}</style>
    </article>
  );
}

// ---------- Column ----------
function Column({ col, cards, editors, selectedId, onSelect }) {
  const urgentCount = cards.filter((c) => c.flag === "urgent").length;
  return (
    <section className="flex flex-col" style={{ width: 300, minWidth: 280 }}>
      <header
        className="px-4 pt-4 pb-3"
        style={{
          background: TOKENS.card,
          border: `1px dashed ${TOKENS.rule}`,
          borderBottom: "none",
        }}
      >
        <div className="flex items-baseline justify-between">
          <h2
            className="font-serif"
            style={{ fontSize: 17, color: TOKENS.ink, fontWeight: 500 }}
          >
            {col.label}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tabular-nums"
              style={{ color: TOKENS.ink50 }}
            >
              {cards.length.toString().padStart(2, "0")}
            </span>
            {urgentCount > 0 && (
              <span
                className="font-mono text-[10px]"
                style={{ color: TOKENS.accent }}
              >
                · {urgentCount}!
              </span>
            )}
          </div>
        </div>
        <div
          className="mt-0.5 text-[11px]"
          style={{ color: TOKENS.ink30, fontFamily: "Inter, sans-serif" }}
        >
          {col.sub}
        </div>
      </header>

      <div
        className="flex flex-col gap-2.5 px-2.5 pt-2.5 pb-3"
        style={{
          background: `${TOKENS.ground}`,
          border: `1px dashed ${TOKENS.rule}`,
          borderTop: "none",
          minHeight: 220,
        }}
      >
        {cards.map((c) => (
          <ManuscriptCard
            key={c.id}
            card={c}
            editors={editors}
            selected={selectedId === c.id}
            onSelect={() => onSelect(c.id)}
          />
        ))}
        <button
          className="flex items-center justify-center gap-1.5 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-white"
          style={{
            color: TOKENS.ink50,
            border: `1px dashed ${TOKENS.rule}`,
            background: "transparent",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          }}
        >
          <L.Plus size={11} strokeWidth={1.6} />
          add
        </button>
      </div>
    </section>
  );
}

Object.assign(window, {
  TOKENS,
  Dashed, EditorChip, GenreTag, ProgressBar,
  StatBlock, MiniBars, DeadlineDots,
  ManuscriptCard, Column,
  cls, fmtWords,
});
