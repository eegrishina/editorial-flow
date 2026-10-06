import type { Editor } from "./editor";

export const MOCK_EDITORS = {
  mr: { id: "mr", name: "M. Reyes" },
  ah: { id: "ah", name: "A. Holloway" },
  jt: { id: "jt", name: "J. Tanaka" },
  ks: { id: "ks", name: "K. Sundgren" },
  el: { id: "el", name: "E. Laurent" },
  pn: { id: "pn", name: "P. Nwosu" },
} satisfies Record<string, Editor>;

// Stand-in for the signed-in user until there is auth ("Assigned to Me" tab)
export const MOCK_CURRENT_EDITOR_ID = MOCK_EDITORS.mr.id;
