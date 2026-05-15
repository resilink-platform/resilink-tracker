"use client";

// ─────────────────────────────────────────────────────────
// SLOGAN COMPONENT
// Visible on page: the rotating motivational quote at the very bottom
// Changes every 5 seconds with a fade transition
// Edit the slogans list in: config/slogans.ts
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { SLOGANS } from "@/config/slogans";
import { StateColor } from "@/config/colors";
interface Props {
  color: StateColor;
}

export default function Slogan({ color }: Props) {
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
        className="text-base sm:text-2xl italic text-center leading-relaxed transition-opacity duration-4000 font-medium"
        style={{ opacity: visible ? 1 : 0, color: color.dark }}
      >
        &ldquo;{SLOGANS[idx]}&rdquo;
      </p>
    </div>
  );
}
