"use client";

// ─────────────────────────────────────────────────────────
// MAIN PAGE — app/page.tsx
//
// This file handles:
//   1. Loading enrollment data from Supabase on mount
//   2. Real-time subscription (when one head updates, all see it live)
//   3. Optimistic UI updates (instant feedback on +/-)
//   4. Rendering all child components
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { EnrollmentRow } from "@/lib/types";
import { STATE_COLORS } from "@/config/colors";
import TabBar from "@/components/TabBar";
import MainCard from "@/components/MainCard";
import MiniStateCards from "@/components/MiniStateCards";

export default function Home() {
  const [rows, setRows] = useState<EnrollmentRow[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"live" | "saving" | "error">(
    "live",
  );

  // ── Step 1: Load data from Supabase on page mount ──
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("enrollment")
        .select("*")
        .order("id"); // order matches color assignment in config/colors.ts

      if (error) {
        console.error("Failed to load enrollment data:", error.message);
        setSyncStatus("error");
      } else if (data) {
        setRows(data);
      }
      setLoading(false);
    }

    fetchData();

    // ── Step 2: Real-time subscription ──
    // When ANY head updates their count, ALL other browsers update instantly
    // No page refresh needed — Supabase pushes changes via WebSocket
    const channel = supabase
      .channel("enrollment-live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "enrollment" },
        (payload) => {
          const updated = payload.new as EnrollmentRow;
          setRows((prev) =>
            prev.map((row) =>
              row.id === updated.id
                ? { ...row, enrolled: updated.enrolled }
                : row,
            ),
          );
        },
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Step 3: Handle +/- button clicks ──
  async function handleUpdate(
    field: "dnb_enrolled" | "mdms_enrolled" | "non_clinical_enrolled",
    delta: number,
  ) {
    const row = rows[activeIdx];
    if (!row) return;

    const currentVal = row[field];
    const maxVal =
      field === "dnb_enrolled"
        ? row.dnb_target
        : field === "mdms_enrolled"
          ? row.mdms_target
          : row.non_clinical_target;
    const newVal = Math.max(0, Math.min(maxVal, currentVal + delta));

    // Optimistic update — UI updates instantly
    setRows((prev) =>
      prev.map((r, i) => (i === activeIdx ? { ...r, [field]: newVal } : r)),
    );

    setSyncStatus("saving");

    const { error } = await supabase
      .from("enrollment")
      .update({ [field]: newVal, updated_at: new Date().toISOString() })
      .eq("id", row.id);

    setSyncStatus(error ? "error" : "live");
  }

  // ── Loading state ──
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading...</p>
      </main>
    );
  }

  const activeRow = rows[activeIdx];
  const activeColor = STATE_COLORS[activeIdx] ?? STATE_COLORS[0];

  return (
    // ── Page wrapper — centered, max width 560px, white card on gray bg ──
    <main className="min-h-screen bg-gray-50 px-0 py-0 sm:px-4 sm:py-6 lg:py-10">
  <div className="w-full max-w-7xl mx-auto bg-white sm:rounded-2xl shadow-sm border-0 sm:border border-gray-100 p-3 sm:p-6 overflow-hidden min-h-screen sm:min-h-0">
        {/* ── Page header: title + live sync indicator ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <img
              src="/resilink-horizontal-lockup.svg"
              alt="Resilink"
              className="h-9 w-auto"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              NEET PG — State Enrollment Tracker
            </p>
          </div>

          {/* Sync status dot + label */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  syncStatus === "live"
                    ? activeColor.stroke
                    : syncStatus === "saving"
                      ? "#F59E0B"
                      : "#EF4444",
              }}
            />
            <span className="text-[11px] text-gray-400">
              {syncStatus === "live"
                ? "live"
                : syncStatus === "saving"
                  ? "saving..."
                  : "error"}
            </span>
          </div>
        </div>
        {/* ── Tab bar: 6 colored state pill buttons ── */}
        <TabBar rows={rows} activeIdx={activeIdx} onSwitch={setActiveIdx} />

        {/* ── Main card: selected state with large ring + +/- controls ── */}
        {activeRow && (
          <MainCard
            row={activeRow}
            color={activeColor}
            onUpdate={handleUpdate}
          />
        )}

        {/* ── Mini cards: all 6 states comparison grid ── */}
        <MiniStateCards
          rows={rows}
          activeIdx={activeIdx}
          onSwitch={setActiveIdx}
        />

        {/* ── Rotating motivational slogan ── */}
      </div>
    </main>
  );
}
