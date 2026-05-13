"use client";

// ─────────────────────────────────────────────────────────
// MAIN CARD — Redesigned layout:
// LEFT  → Circular ring (overall combined progress)
// RIGHT → Two progress bars: DNB + MD/MS (each with +/- buttons)
// ─────────────────────────────────────────────────────────

import CircularRing from "@/components/CircularRing";
import { EnrollmentRow } from "@/lib/types";
import { StateColor } from "@/config/colors";
import Slogan from "./Slogan";

interface Props {
  row: EnrollmentRow;
  color: StateColor;
  onUpdate: (field: "dnb_enrolled" | "mdms_enrolled" | "non_clinical_enrolled", delta: number) => void;
}

// ── Individual progress bar with +/- controls ──
function ProgressBar({
  label, enrolled, target, color, onMinus, onPlus,
}: {
  label: string;
  enrolled: number;
  target: number;
  color: StateColor;
  onMinus: () => void;
  onPlus: () => void;
}) {
  const pct = Math.min(100, 
              Number(target ?? 0) > 0 ? Math.round((Number(enrolled??0) / Number(target)) * 100) : 0);

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label + count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">{label} </span>
        <span className="text-xs text-gray-500">{enrolled} / {target}</span>
      </div>

      {/* Progress bar + percentage + buttons */}
      <div className="flex items-center gap-3">

        {/* Bar track */}
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color.stroke }}
          />
        </div>

        {/* Percentage */}
        <span
          className="text-xs font-medium w-8 text-right"
          style={{ color: color.stroke }}
        >
          {pct}%
        </span>

        {/* Minus button */}
        <button
          onClick={onMinus}
          className="w-7 h-7 rounded-full border border-gray-200 bg-gray-50 text-sm flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        >
          −
        </button>

        {/* Plus button */}
        <button
          onClick={onPlus}
          className="w-7 h-7 rounded-full text-white text-sm flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
          style={{ background: color.stroke }}
        >
          + 
        </button>
      </div>
    </div>
  );
}

export default function MainCard({ row, color, onUpdate }: Props) {

  // Overall = DNB + MDMS combined
  const totalEnrolled = row.dnb_enrolled + row.mdms_enrolled + row.non_clinical_enrolled;
  const totalTarget = row.dnb_target + row.mdms_target + row.non_clinical_target;
  const overallPct = Math.min(100, Math.round((totalEnrolled / totalTarget) * 100));
  const isComplete = totalEnrolled >= totalTarget;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 mb-4">

      {/* ── Colored header ── */}
      <div
        className="px-6 py-5 border-b border-gray-100"
        style={{ background: color.bg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
            style={{ background: color.stroke }}
          >
            {row.abbr}
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-medium" style={{ color: color.dark }}>
              {row.head_name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: color.mid }}>
              Head of Residents · {row.state}
            </p>
          </div>
          <Slogan />
          {isComplete && (
            <span
              className="text-[10px] font-medium px-3 py-1 rounded-md text-white"
              style={{ background: color.stroke }}
            >
              Target reached
            </span>
          )}
        </div>
      </div>

      {/* ── Body: Ring LEFT + Progress bars RIGHT ── */}
      <div className="bg-white px-6 py-6 flex items-center gap-6">

        {/* LEFT — Overall circular ring */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <CircularRing
            percentage={overallPct}
            color={color.stroke}
            size={130}
            strokeWidth={9}
            fontSize={26}
            enrolled={totalEnrolled}
            target={totalTarget}
          />
          <p className="text-[10px] text-gray-400">overall</p>
        </div>

        {/* Divider */}
        <div className="w-px h-24 bg-gray-100 flex-shrink-0" />

        {/* RIGHT — DNB + MD/MS + Non Clinical progress bars */}
        <div className="flex-1 flex flex-col gap-5">

          {/* DNB progress bar */}
          {Number(row.dnb_target ?? 0) > 0 && (
          <ProgressBar
            label="DNB"
            enrolled={row.dnb_enrolled}
            target={row.dnb_target}
            color={color}
            onMinus={() => onUpdate("dnb_enrolled", -1)}
            onPlus={() => onUpdate("dnb_enrolled", 1)}
          />
          )}

          {/* MD/MS progress bar */}
          {Number(row.mdms_target ?? 0) > 0 && (
          <ProgressBar
            label="MD / MS"
            enrolled={row.mdms_enrolled}
            target={row.mdms_target}
            color={color}
            onMinus={() => onUpdate("mdms_enrolled", -1)}
            onPlus={() => onUpdate("mdms_enrolled", 1)}
          />
          )}

          {/* Non Clinical progress bar */}
          {Number(row.non_clinical_target ?? 0) > 0 && (
          <ProgressBar
            label="Non Clinical"
            enrolled={row.non_clinical_enrolled}
            target={row.non_clinical_target}
            color={color}
            onMinus={() => onUpdate("non_clinical_enrolled", -1)}
            onPlus={() => onUpdate("non_clinical_enrolled", 1)}
          />
          )}
        </div>
      </div>
    </div>
  );
}