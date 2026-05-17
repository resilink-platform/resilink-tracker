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
  onUpdate: (
    field: "dnb_enrolled" | "mdms_enrolled" | "non_clinical_enrolled",
    delta: number,
  ) => void;
}

// ── Individual progress bar with +/- controls ──
function ProgressBar({
  label,
  enrolled,
  target,
  color,
  onMinus,
  onPlus,
}: {
  label: string;
  enrolled: number;
  target: number;
  color: StateColor;
  onMinus: () => void;
  onPlus: () => void;
}) {
  const pct = Math.min(
    100,
    Number(target ?? 0) > 0
      ? Math.round((Number(enrolled ?? 0) / Number(target ?? 0)) * 100)
      : 0,
  );

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label + count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">{label} </span>
        <span className="text-xs text-gray-500">
          {enrolled} / {target}
        </span>
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
  const totalEnrolled =
    row.dnb_enrolled + row.mdms_enrolled + row.non_clinical_enrolled;
  const totalTarget =
    row.dnb_target + row.mdms_target + row.non_clinical_target;
  const overallPct = Math.min(
    100,
    Math.round((totalEnrolled / totalTarget) * 100),
  );
  const isComplete = totalEnrolled >= totalTarget;

  const deadLineInfro = row.deadline
    ? (() => {
        const today = new Date();
        const due = new Date(row.deadline);
        const daysLeft = Math.ceil(
          (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        const isOverdue = daysLeft < 0;
        const isUrgent = daysLeft >= 0 && daysLeft <= 7;
        const isWarning = daysLeft > 7 && daysLeft <= 14;

        // Format date nicely: "Jun 30, 2026"
        const formatted = due.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const reachedMsg = isOverdue
          ? `Target reached ${Math.abs(daysLeft)}d after deadline`
          : daysLeft === 0
            ? "Target reached exactly on deadline"
            : `Target reached ${daysLeft}d before deadline`;

        return {
          daysLeft,
          isOverdue,
          isUrgent,
          isWarning,
          formatted,
          reachedMsg,
        };
      })()
    : null;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 mb-4">
      {/* ── Colored header ── */}
      <div
        className="px-6 py-5 border-b border-gray-100"
        style={{ background: color.bg }}
      >
        {/*
          ── CHANGE 1 ──
          WHAT: Added "flex-wrap" and "gap-y-2" to this div
          WHY:  On mobile, avatar + name + deadline badge don't fit in one row.
                flex-wrap allows the deadline badge to drop to a new line.
                gap-y-2 adds vertical spacing between the two lines when it wraps.
                gap-3 renamed to gap-x-3 so horizontal gap still works correctly.
          DESKTOP: No visual change — everything still fits in one row.
          MOBILE:  Avatar + name on line 1, deadline badge on line 2.
        */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
            style={{ background: color.stroke }}
          >
            {row.abbr}
          </div>
          {/*
            ── CHANGE 2 ──
            WHAT: Added "min-w-0" to this div
            WHY:  Without min-w-0, flex children with "flex-1" can overflow
                  their container on mobile when the head name is long.
                  min-w-0 tells the browser this div is allowed to shrink
                  below its content size, preventing overflow.
            DESKTOP: No visual change.
            MOBILE:  Long head names (e.g. "Dr. Nawaz & Dr. Siraz") don't
                     overflow outside the card boundary.
          */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[15px] font-medium"
              style={{ color: color.dark }}
            >
              {row.head_name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: color.mid }}>
              Head of Residents · {row.state}
            </p>
          </div>
          {/* ── Deadline badge (replaces 'hiren') ── */}
          <div className="w-full sm:w-auto flex sm:justify-end">
            {isComplete ? (
              <span
                className="text-[15px] font-medium px-3 py-1 rounded-md"
                style={{
                  background: deadLineInfro?.isOverdue
                    ? "#FEE2E2"
                    : deadLineInfro?.isUrgent
                      ? "#FFEDD5"
                      : deadLineInfro?.isWarning
                        ? "#FEF9C3"
                        : "#F3F4F6",
                  color: deadLineInfro?.isOverdue
                    ? "#DC2626"
                    : deadLineInfro?.isUrgent
                      ? "#C2410C"
                      : deadLineInfro?.isWarning
                        ? "#CA8A04"
                        : "#6B7280",
                }}
              >
                {deadLineInfro ? deadLineInfro.reachedMsg : "Target reached"}
              </span>
            ) : deadLineInfro ? (
              <div className="flex items-center gap-1.5">
                {/* Calendar icon + date */}
                <span
                  className="text-lg flex items-center gap-1 font-bold"
                  style={{
                    color: deadLineInfro.isOverdue ? "#DC2626" : "#6B7280",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {deadLineInfro.formatted}
                </span>

                {/* Days remaining pill */}
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    background: deadLineInfro.isOverdue
                      ? "#FEE2E2"
                      : deadLineInfro.isUrgent
                        ? "#FFEDD5"
                        : deadLineInfro.isWarning
                          ? "#FEF9C3"
                          : "#F3F4F6",
                    color: deadLineInfro.isOverdue
                      ? "#DC2626"
                      : deadLineInfro.isUrgent
                        ? "#C2410C"
                        : deadLineInfro.isWarning
                          ? "#CA8A04"
                          : "#6B7280",
                  }}
                >
                  {deadLineInfro.isOverdue
                    ? `${Math.abs(deadLineInfro.daysLeft)}d overdue`
                    : deadLineInfro.daysLeft === 0
                      ? "Due today"
                      : `${deadLineInfro.daysLeft}d left`}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <Slogan color={color} />
      </div>

      {/* ── Body: Ring LEFT + Progress bars RIGHT ── */}
      <div className="bg-white px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
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
        <div className="hidden sm:block w-px h-24 bg-gray-100 flex-shrink-0" />

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
