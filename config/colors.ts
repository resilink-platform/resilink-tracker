// ─────────────────────────────────────────────────────────
// COLOR CONFIG — one color identity per state (in order)
// Order must match the rows returned from Supabase (ordered by id)
// ─────────────────────────────────────────────────────────

export interface StateColor {
  stroke: string; // ring color + accent
  bg: string;     // light background tint
  dark: string;   // dark text on light bg
  mid: string;    // medium shade for subtitles
}

export const STATE_COLORS: StateColor[] = [
  { stroke: "#7F77DD", bg: "#EEEDFE", dark: "#3C3489", mid: "#534AB7" }, // Purple  — State 1
  { stroke: "#1D9E75", bg: "#E1F5EE", dark: "#085041", mid: "#0F6E56" }, // Teal    — State 2
  { stroke: "#D85A30", bg: "#FAECE7", dark: "#712B13", mid: "#993C1D" }, // Coral   — State 3
  { stroke: "#378ADD", bg: "#E6F1FB", dark: "#0C447C", mid: "#185FA5" }, // Blue    — State 4
  { stroke: "#BA7517", bg: "#FAEEDA", dark: "#633806", mid: "#854F0B" }, // Amber   — State 5
  { stroke: "#D4537E", bg: "#FBEAF0", dark: "#4B1528", mid: "#993556" }, // Pink    — State 6
];
