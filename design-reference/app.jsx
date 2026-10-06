// Editorial Flow — main app (v2: clean + high-contrast)

const { EDITORS, COLUMNS, CARDS } = window.EF_DATA;
const Lr = window.lucide;
const T = window.TOKENS;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "serif": "Lora",
  "mono": "JetBrains Mono",
  "showStats": true
}/*EDITMODE-END*/;

const SERIF_OPTIONS = ["Lora", "Playfair Display", "EB Garamond", "DM Serif Display"];
const MONO_OPTIONS  = ["JetBrains Mono", "IBM Plex Mono", "Space Mono", "Fira Code"];

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const [selectedId, setSelectedId] = React.useState("MS-1908");
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    document.documentElement.style.setProperty("--ef-serif", `"${tweaks.serif}", Georgia, serif`);
    document.documentElement.style.setProperty("--ef-mono",  `"${tweaks.mono}", ui-monospace, monospace`);
  }, [tweaks.serif, tweaks.mono]);

  const cards = React.useMemo(() => {
    return CARDS.filter((c) => {
      if (filter === "urgent" && c.flag !== "urgent") return false;
      if (filter === "mine" && c.editor !== "mr") return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.author.toLowerCase().includes(q) &&
          !c.id.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [filter, query]);

  const byCol = React.useMemo(() => {
    const m = {};
    for (const col of COLUMNS) m[col.id] = [];
    for (const c of cards) m[c.column]?.push(c);
    return m;
  }, [cards]);

  const totalActive = CARDS.filter((c) => c.column !== "press").length;
  const urgentCount = CARDS.filter((c) => c.flag === "urgent").length;
  const reviewCount = CARDS.filter((c) => c.flag === "review").length;
  const pressCount  = CARDS.filter((c) => c.column === "press").length;
  const monthSpark  = [6, 8, 5, 9, 7, 11, 10, 12, 9, 13, 11, 14];
  const deadlineDots = [
    { day: "M", count: 2, urgent: true  },
    { day: "T", count: 1, urgent: false },
    { day: "W", count: 3, urgent: true  },
    { day: "T", count: 0, urgent: false },
    { day: "F", count: 2, urgent: false },
    { day: "S", count: 1, urgent: false },
    { day: "S", count: 0, urgent: false },
  ];

  const selected = CARDS.find((c) => c.id === selectedId);
  const selectedEditor = selected ? EDITORS[selected.editor] : null;

  // ----- shared button styles (sans, uppercase, dashed border) -----
  const ghostBtn = {
    border: `1px dashed ${T.rule}`,
    color: T.ink,
    background: T.card,
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
  };
  const solidBtn = {
    background: T.ink,
    color: T.ground,
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: T.ground,
        color: T.ink,
      }}
    >
      {/* ============ MASTHEAD ============ */}
      <header className="mx-auto max-w-[1480px] px-8 pt-8 pb-5">
        <div className="flex items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <div
              className="flex h-11 w-11 items-center justify-center"
              style={{ border: `1px dashed ${T.rule}`, background: T.card }}
            >
              <Lr.Feather size={20} strokeWidth={1.4} />
            </div>
            <div>
              <div
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: T.ink50 }}
              >
                Est. 1924 · Vol. XII · Iss. 05
              </div>
              <h1
                className="font-serif leading-none mt-1"
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  color: T.ink,
                }}
              >
                Editorial Flow
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-2"
              style={{ border: `1px dashed ${T.rule}`, background: T.card }}
            >
              <Lr.Search size={13} strokeWidth={1.5} style={{ color: T.ink50 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, author, MS-…"
                className="bg-transparent text-[12px] outline-none"
                style={{ width: 220, color: T.ink, fontFamily: "Inter, sans-serif" }}
              />
            </div>
            <button
              className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#FAF9F6]"
              style={ghostBtn}
            >
              <Lr.Filter size={12} strokeWidth={1.5} />
              Filter
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
              style={solidBtn}
            >
              <Lr.Plus size={12} strokeWidth={1.8} />
              New Acquisition
            </button>
            <div className="ml-2 flex items-center -space-x-1.5">
              {Object.values(EDITORS).slice(0, 4).map((e, i) => (
                <span key={i} style={{ background: T.card, borderRadius: 9999 }}>
                  <EditorChip editor={e} size={26} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6">
          <Dashed />
          <nav className="mt-3 flex items-center gap-6">
            {[
              { k: "all",    label: "All Manuscripts", count: CARDS.length },
              { k: "mine",   label: "Assigned to Me",  count: CARDS.filter(c=>c.editor==="mr").length },
              { k: "urgent", label: "Urgent",          count: urgentCount, accent: true },
            ].map((tab) => {
              const active = filter === tab.k;
              const color = active ? T.ink : T.ink50;
              return (
                <button
                  key={tab.k}
                  onClick={() => setFilter(tab.k)}
                  className="flex items-center gap-2 pb-2 transition-colors"
                  style={{
                    borderBottom: active ? `1px solid ${T.ink}` : "1px solid transparent",
                  }}
                >
                  <span
                    className="text-[13px]"
                    style={{
                      color,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {tab.label}
                  </span>
                  <span
                    className="font-mono text-[10px] tabular-nums"
                    style={{ color: tab.accent && tab.count > 0 ? T.accent : T.ink30 }}
                  >
                    {tab.count.toString().padStart(2, "0")}
                  </span>
                </button>
              );
            })}
            <div
              className="ml-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
            >
              <span style={{ color: T.ink }}>● Board</span>
              <span style={{ color: T.ink30 }}>○ List</span>
              <span style={{ color: T.ink30 }}>○ Calendar</span>
            </div>
          </nav>
        </div>
      </header>

      {/* ============ STATS BENTO ============ */}
      {tweaks.showStats && (
        <section className="mx-auto max-w-[1480px] px-8 pb-6">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "1.4fr 1.4fr 1fr 1fr 1.3fr" }}
          >
            <StatBlock
              kicker="Active Manuscripts"
              value={totalActive}
              unit="in progress"
              foot="↗ +03 wk"
              icon={Lr.BookOpen}
            >
              <div className="ml-auto"><MiniBars data={monthSpark} /></div>
            </StatBlock>

            <StatBlock
              kicker="Approaching Deadlines"
              value={urgentCount}
              unit="this week"
              foot="next 7 days"
              icon={Lr.Calendar}
              accent={T.accent}
            >
              <DeadlineDots items={deadlineDots} />
            </StatBlock>

            <StatBlock
              kicker="To Press"
              value={pressCount}
              unit="titles"
              foot="May"
              icon={Lr.Printer}
            >
              <div className="ml-auto text-right">
                <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}>
                  Print run
                </div>
                <div className="font-mono text-[13px] tabular-nums" style={{ color: T.ink }}>
                  8,400
                </div>
              </div>
            </StatBlock>

            <StatBlock
              kicker="Awaiting Review"
              value={reviewCount.toString().padStart(2, "0")}
              unit="submissions"
              foot="cmte. Fri"
              icon={Lr.Eye}
              valueMono
            >
              <div className="ml-auto text-right">
                <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}>
                  Inbox
                </div>
                <div className="font-mono text-[13px] tabular-nums" style={{ color: T.ink }}>
                  11 / wk
                </div>
              </div>
            </StatBlock>

            {/* Editor workload */}
            <div
              className="flex h-full flex-col justify-between p-5"
              style={{ background: T.card, border: `1px dashed ${T.rule}` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lr.Users size={13} strokeWidth={1.5} style={{ color: T.ink50 }} />
                  <span
                    className="text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
                  >
                    Editor Workload
                  </span>
                </div>
                <span className="font-mono text-[10px] tabular-nums" style={{ color: T.ink30 }}>
                  06 active
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {Object.entries(EDITORS).map(([k, e]) => {
                  const load = CARDS.filter((c) => c.editor === k && c.column !== "press").length;
                  const max = 4;
                  const overloaded = load >= 3;
                  return (
                    <div key={k} className="flex items-center gap-3">
                      <EditorChip editor={e} size={18} />
                      <span
                        className="text-[12px] flex-1"
                        style={{ color: T.ink, fontFamily: "Inter, sans-serif" }}
                      >
                        {e.name}
                      </span>
                      <div className="flex gap-[2px]">
                        {Array.from({ length: max }).map((_, i) => (
                          <span
                            key={i}
                            className="block h-[8px] w-[8px]"
                            style={{
                              background: i < load
                                ? (overloaded ? T.accent : T.ink)
                                : "transparent",
                              border: i < load
                                ? "none"
                                : `1px dashed ${T.ink}33`,
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="font-mono text-[10px] w-5 text-right tabular-nums"
                        style={{ color: overloaded ? T.accent : T.ink50 }}
                      >
                        {load.toString().padStart(2, "0")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ KANBAN BOARD ============ */}
      <main className="mx-auto max-w-[1480px] px-8 pb-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
            >
              Section II — Production Ledger
            </div>
            <h2
              className="font-serif mt-1"
              style={{ fontSize: 24, color: T.ink, fontWeight: 500 }}
            >
              The Board
            </h2>
          </div>
          <div
            className="flex items-center gap-4 text-[10px] uppercase tracking-[0.16em]"
            style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: T.accent }} />
              Urgent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full border" style={{ borderColor: T.ink50, borderStyle: "dashed" }} />
              In review
            </span>
            <span className="flex items-center gap-1.5">
              <Lr.GripVertical size={11} strokeWidth={1.5} />
              Drag to reorder
            </span>
          </div>
        </div>

        <div className="flex items-stretch gap-3 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              cards={byCol[col.id] || []}
              editors={EDITORS}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer
        className="mx-auto max-w-[1480px] px-8 pb-10 pt-2 text-[10px] uppercase tracking-[0.2em] flex items-center justify-between"
        style={{ color: T.ink30, fontFamily: "Inter, sans-serif" }}
      >
        <span>Editorial Flow — Production Department</span>
        <span className="font-mono tracking-[0.16em]">Last sync · today, 09:42 · {CARDS.length} entries</span>
        <span className="font-mono tracking-[0.16em]">Folio 247</span>
      </footer>

      {/* ============ DETAIL DRAWER ============ */}
      {selected && (
        <DetailDrawer card={selected} editor={selectedEditor} onClose={() => setSelectedId(null)} />
      )}

      {/* ============ TWEAKS ============ */}
      {window.TweaksPanel ? (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Typography">
            <window.TweakSelect
              label="Serif (titles)"
              value={tweaks.serif}
              options={SERIF_OPTIONS}
              onChange={(v) => setTweak("serif", v)}
            />
            <window.TweakSelect
              label="Mono (data)"
              value={tweaks.mono}
              options={MONO_OPTIONS}
              onChange={(v) => setTweak("mono", v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Layout">
            <window.TweakToggle
              label="Show stats bento"
              value={tweaks.showStats}
              onChange={(v) => setTweak("showStats", v)}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      ) : null}
    </div>
  );
}

// ============ Detail drawer ============
function DetailDrawer({ card, editor, onClose }) {
  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[360px] z-30 overflow-y-auto"
      style={{
        background: T.card,
        borderLeft: `1px dashed ${T.rule}`,
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: T.ink50 }}
          >
            Folio · {card.id}
          </span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center hover:bg-[#F5F4F0]"
            style={{ border: `1px dashed ${T.rule}` }}
            aria-label="close"
          >
            <Lr.X size={12} strokeWidth={1.5} />
          </button>
        </div>

        <h3
          className="mt-4 font-serif leading-[1.1]"
          style={{ fontSize: 28, color: T.ink, fontWeight: 500, textWrap: "pretty" }}
        >
          {card.title}
        </h3>
        <div
          className="mt-1"
          style={{ color: T.ink50, fontFamily: "Inter, sans-serif", fontSize: 13 }}
        >
          by {card.author}
        </div>

        <Dashed className="my-5" />

        <dl className="grid grid-cols-2 gap-y-3 gap-x-3">
          {[
            ["Genre",     card.genre,            false],
            ["Words",     card.words.toLocaleString(), true],
            ["Chapters",  card.chapters,         true],
            ["Submitted", card.submitted,        true],
            ["Due",       card.due,              true],
            ["Editor",    editor?.name,          false],
          ].map(([k, v, isMono]) => (
            <div key={k}>
              <div
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
              >
                {k}
              </div>
              <div
                className={cls("mt-0.5 text-[12px]", isMono && "font-mono tabular-nums")}
                style={{
                  color: T.ink,
                  fontFamily: isMono ? undefined : "Inter, sans-serif",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </dl>

        <Dashed className="my-5" />

        <div
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
        >
          Progress
        </div>
        <div className="mt-2"><ProgressBar value={card.progress} accent={card.flag === "urgent" ? T.accent : T.ink} /></div>

        <Dashed className="my-5" />

        <div
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
        >
          Latest note
        </div>
        <p
          className="mt-2 leading-relaxed"
          style={{
            color: T.ink,
            fontSize: 13,
            textWrap: "pretty",
            fontFamily: "Inter, sans-serif",
          }}
        >
          “{card.note}”
        </p>

        <Dashed className="my-5" />

        <div
          className="text-[10px] uppercase tracking-[0.22em] mb-3"
          style={{ color: T.ink50, fontFamily: "Inter, sans-serif" }}
        >
          Stages
        </div>
        <ol className="space-y-2">
          {COLUMNS.map((col, idx) => {
            const colIdx = COLUMNS.findIndex((c) => c.id === card.column);
            const passed = idx <= colIdx;
            const current = col.id === card.column;
            return (
              <li key={col.id} className="flex items-center gap-3">
                <span
                  className="block h-[8px] w-[8px]"
                  style={{
                    background: passed ? (current ? T.accent : T.ink) : "transparent",
                    border: passed ? "none" : `1px dashed ${T.ink}55`,
                  }}
                />
                <span
                  className="text-[13px] flex-1"
                  style={{
                    color: passed ? T.ink : T.ink50,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: current ? 600 : 500,
                  }}
                >
                  {col.label}
                </span>
                {current && (
                  <span
                    className="text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: T.accent, fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    current
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-[0.2em]"
            style={{
              background: T.accent,
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            <Lr.ArrowRight size={12} strokeWidth={1.8} />
            Advance stage
          </button>
          <button
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-[#F5F4F0]"
            style={{
              border: `1px dashed ${T.rule}`,
              color: T.ink,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            <Lr.MessageSquare size={12} strokeWidth={1.5} />
            Note
          </button>
        </div>
      </div>
    </aside>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
