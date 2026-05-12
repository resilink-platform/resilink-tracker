"use client";

// ─────────────────────────────────────────────────────────
// MINI STATE CARDS COMPONENT
// Visible on page: the bottom grid showing ALL 6 states
// Each mini card shows: small circular ring (% only) + abbr + medal/rank
// Click any card to switch the active state above
// ─────────────────────────────────────────────────────────

import CircularRing from "@/components/CircularRing";
import { EnrollmentRow } from "@/lib/types";
import { STATE_COLORS } from "@/config/colors";

interface Props {
  rows: EnrollmentRow[];
  activeIdx: number;
  onSwitch: (idx: number) => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function MiniStateCards({ rows, activeIdx, onSwitch }: Props) {
  // Sort by enrollment percentage to determine rankings
  const ranked = rows
    .map((row, i) => ({
      ...row,
      idx: i,
      pct: Math.min(100, Math.round((row.enrolled / row.target) * 100)),
    }))
    .sort((a, b) => b.pct - a.pct);

  // Map each row index → its rank position
  const rankMap: Record<number, number> = {};
  ranked.forEach((r, rank) => { rankMap[r.idx] = rank; });

  return (
    <div className="mb-4">
      {/* Section label */}
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">
        All States
      </p>

      {/* 6-column responsive grid */}
      <div className="grid grid-cols-6 gap-2">
        {rows.map((row, i) => {
          const c = STATE_COLORS[i] ?? STATE_COLORS[0];
          const totalEnrolled = row.dnb_enrolled + row.mdms_enrolled;
const totalTarget = row.dnb_target + row.mdms_target;
const pct = Math.min(100, Math.round((totalEnrolled / totalTarget) * 100));
          const isActive = i === activeIdx;
          const rank = rankMap[i];

          return (
            <button
              key={row.id}
              onClick={() => onSwitch(i)}
              className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-1 cursor-pointer transition-all duration-150"
              style={{
                border: isActive ? `2px solid ${c.stroke}` : "0.5px solid #E5E7EB",
                background: isActive ? c.bg : "#FFFFFF",
              }}
            >
              {/* Small circular ring */}
              <CircularRing
                percentage={pct}
                color={c.stroke}
                size={60}
                strokeWidth={6}
                fontSize={13}
              />

              {/* State abbreviation */}
              <p
                className="text-[10px] font-medium text-center leading-tight"
                style={{ color: isActive ? c.dark : "#6B7280" }}
              >
                {row.abbr}
              </p>

              {/* Medal for top 3, rank number for rest */}
              {rank < 3 ? (
                <span className="text-sm">{MEDALS[rank]}</span>
              ) : (
                <span className="text-[10px] text-gray-400">#{rank + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
