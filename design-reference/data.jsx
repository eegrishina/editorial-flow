// Editorial Flow — sample data

const EDITORS = {
  mr: { initials: "MR", name: "M. Reyes", color: "#8B2C1F" },
  ah: { initials: "AH", name: "A. Holloway", color: "#3B5E50" },
  jt: { initials: "JT", name: "J. Tanaka", color: "#4A5876" },
  ks: { initials: "KS", name: "K. Sundgren", color: "#7A5B2F" },
  el: { initials: "EL", name: "E. Laurent", color: "#5C3A66" },
  pn: { initials: "PN", name: "P. Nwosu", color: "#2F4858" },
};

const COLUMNS = [
  { id: "acq",  label: "Acquisition",          sub: "Submitted manuscripts" },
  { id: "dev",  label: "Developmental Edit",   sub: "Structural revision" },
  { id: "copy", label: "Copy Edit",            sub: "Line & consistency" },
  { id: "des",  label: "Design & Typesetting", sub: "Cover & interior" },
  { id: "proof",label: "Final Proof",          sub: "Pre-press review" },
  { id: "press",label: "To Press",             sub: "Cleared for print" },
];

// Each card lives in a column. word counts in thousands rounded.
const CARDS = [
  // ---- ACQUISITION ----
  {
    id: "MS-2041", column: "acq", title: "The Cartographer's Index",
    author: "Inés Marchetti", genre: "Literary Fiction",
    words: 92400, chapters: 24, due: "Jun 02", editor: "mr",
    progress: 8, flag: "review", note: "Acquisition committee pending.",
    submitted: "May 11",
  },
  {
    id: "MS-2049", column: "acq", title: "Saltwater Atlas",
    author: "Daniel Okafor", genre: "Essays",
    words: 64200, chapters: 18, due: "Jun 09", editor: "pn",
    progress: 4, flag: null, note: "First read scheduled.",
    submitted: "May 14",
  },
  {
    id: "MS-2052", column: "acq", title: "A Field Guide to Forgetting",
    author: "Ruth Bellweather", genre: "Memoir",
    words: 71800, chapters: 22, due: "Jun 14", editor: "ah",
    progress: 12, flag: null, note: "Sample pages with reader.",
    submitted: "May 15",
  },

  // ---- DEVELOPMENTAL ----
  {
    id: "MS-1987", column: "dev", title: "Northing & Easting",
    author: "Per Lindqvist", genre: "Historical Fiction",
    words: 118500, chapters: 31, due: "May 28", editor: "ks",
    progress: 42, flag: "urgent", note: "Act II restructure in progress.",
    submitted: "Apr 02",
  },
  {
    id: "MS-2003", column: "dev", title: "The Hours Between Tides",
    author: "Marisol Vega", genre: "Literary Fiction",
    words: 86300, chapters: 27, due: "Jun 18", editor: "mr",
    progress: 38, flag: null, note: "Awaiting author response — round 2 notes.",
    submitted: "Apr 09",
  },
  {
    id: "MS-2017", column: "dev", title: "Quiet Apparatus",
    author: "T. Halvorsen", genre: "Science",
    words: 102100, chapters: 14, due: "Jul 03", editor: "jt",
    progress: 55, flag: null, note: "Chapter 6 revision returned.",
    submitted: "Apr 18",
  },

  // ---- COPY EDIT ----
  {
    id: "MS-1942", column: "copy", title: "Stoneware",
    author: "Yusuf Demir", genre: "Short Stories",
    words: 58900, chapters: 12, due: "May 22", editor: "el",
    progress: 64, flag: "urgent", note: "Style sheet locked.",
    submitted: "Mar 14",
  },
  {
    id: "MS-1955", column: "copy", title: "Lantern Practice",
    author: "Wren Ahmadi", genre: "Poetry",
    words: 21400, chapters: 6, due: "Jun 06", editor: "ah",
    progress: 71, flag: null, note: "Italics pass complete.",
    submitted: "Mar 21",
  },

  // ---- DESIGN ----
  {
    id: "MS-1908", column: "des", title: "Vellum & Wire",
    author: "Camille Brouchard", genre: "Art History",
    words: 134700, chapters: 9, due: "Jun 11", editor: "ks",
    progress: 78, flag: null, note: "Plate section v3 with designer.",
    submitted: "Feb 28",
  },
  {
    id: "MS-1922", column: "des", title: "The Empty Quarter",
    author: "Idris al-Mansouri", genre: "Travel",
    words: 88600, chapters: 21, due: "May 30", editor: "pn",
    progress: 82, flag: "urgent", note: "Cover R3 — awaiting sign-off.",
    submitted: "Mar 03",
  },

  // ---- PROOF ----
  {
    id: "MS-1871", column: "proof", title: "A Catalogue of Small Disasters",
    author: "Ottilie Karsten", genre: "Literary Fiction",
    words: 79200, chapters: 28, due: "May 24", editor: "mr",
    progress: 91, flag: "urgent", note: "Page proofs with author.",
    submitted: "Jan 22",
  },
  {
    id: "MS-1885", column: "proof", title: "Eight Bridges",
    author: "Hiroshi Maeda", genre: "Literary Fiction",
    words: 96100, chapters: 19, due: "Jun 04", editor: "jt",
    progress: 88, flag: null, note: "Final read returned clean.",
    submitted: "Feb 04",
  },

  // ---- TO PRESS ----
  {
    id: "MS-1820", column: "press", title: "The Quiet Stations",
    author: "Eleanor Pryce", genre: "Memoir",
    words: 68400, chapters: 16, due: "May 20", editor: "el",
    progress: 100, flag: null, note: "Files transmitted — 04:12 UTC.",
    submitted: "Dec 18",
  },
  {
    id: "MS-1832", column: "press", title: "Birds, Believing",
    author: "Tomás Reyes-Vela", genre: "Poetry",
    words: 19800, chapters: 5, due: "May 21", editor: "ah",
    progress: 100, flag: null, note: "Print run: 4,000 hardcover.",
    submitted: "Jan 04",
  },
];

window.EF_DATA = { EDITORS, COLUMNS, CARDS };
