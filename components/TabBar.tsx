"use client";

// ─────────────────────────────────────────────────────────
// TAB BAR COMPONENT
// Visible on page: the 6 colored pill buttons at the top
// Each pill shows: color dot + state name + live %
// Click any pill to switch the active state card below
// ─────────────────────────────────────────────────────────

import { EnrollmentRow } from "@/lib/types";
import { STATE_COLORS } from "@/config/colors";

interface Props {
  rows: EnrollmentRow[];
  activeIdx: number;
  onSwitch: (idx: number) => void;
}

export default function TabBar({ rows, activeIdx, onSwitch }: Props) {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none -mx-3 px-3 sm:flex-wrap sm:overflow-visible">
      {rows.map((row, i) => {
        const c = STATE_COLORS[i] ?? STATE_COLORS[0];
        const totalEnrolled = row.dnb_enrolled + row.mdms_enrolled;
        const totalTarget = row.dnb_target + row.mdms_target;
        const pct = Math.min(100, Math.round((totalEnrolled / totalTarget) * 100));
        const isActive = i === activeIdx;

        return (
          <button
            key={row.id}
            onClick={() => onSwitch(i)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer font-sans"
            style={{
              border: isActive ? `2px solid ${c.stroke}` : "0.5px solid #E5E7EB",
              background: isActive ? c.bg : "#FFFFFF",
              color: isActive ? c.dark : "#6B7280",
              fontWeight: isActive ? 500 : 400,
            }}
          >
            {/* Color identity dot */}
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: c.stroke }}
            />

            {/* State name */}
            {row.state}

            {/* Live percentage */}
            <span className="font-medium" style={{ color: c.mid }}>
              {pct}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
