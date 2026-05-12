"use client";

// ─────────────────────────────────────────────────────────
// SLOGAN COMPONENT
// Visible on page: the rotating motivational quote at the very bottom
// Changes every 5 seconds with a fade transition
// Edit the slogans list in: config/slogans.ts
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { SLOGANS } from "@/config/slogans";

export default function Slogan() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out → swap text → fade in
      setVisible(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % SLOGANS.length);
        setVisible(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-t border-gray-100 pt-5 pb-2">
      <p
        className="text-[13px] italic text-gray-400 text-center leading-relaxed transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      >
        &ldquo;{SLOGANS[idx]}&rdquo;
      </p>
    </div>
  );
}
