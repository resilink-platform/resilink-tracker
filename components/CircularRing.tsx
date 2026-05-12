"use client";

// ─────────────────────────────────────────────────────────
// CIRCULAR RING COMPONENT
// Visible on page: the circular progress ring showing only %
// Used in: MainCard (large) and MiniStateCards (small)
// ─────────────────────────────────────────────────────────

interface Props {
  percentage: number; // 0–100
  color: string; // stroke + text color
  size?: number; // svg dimensions in px (default 180)
  strokeWidth?: number;
  fontSize?: number;
  enrolled?: number;   // ← ADD THIS
  target?: number;     // ← ADD THIS
}

export default function CircularRing({
  percentage,
  color,
  size = 180,
  strokeWidth = 11,
  fontSize = 38,
  enrolled,   // ← ADD THIS
  target,     // ← ADD THIS
}: Props) {
  const radius = size / 2 - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = (percentage / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track (grey ring) */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />

      {/* Colored progress arc */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashArray.toFixed(1)} ${circumference.toFixed(1)}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{
          transition: "stroke-dasharray 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/*as 
       {/* Percentage text — only % shown, no raw numbers *
      <text
        x={cx}
        y={cy + fontSize * 0.38}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize}
        fontWeight="500"
        fontFamily="system-ui, sans-serif"
      >
        {percentage}%
      </text>  */}
      {/* Percentage + enrolled/target numbers */}
      <text
        x={cx}
        y={cy + fontSize * 0.1}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize}
        fontWeight="500"
        fontFamily="system-ui, sans-serif"
      >
        {percentage}%
      </text>
      <text
        x={cx}
        y={cy + fontSize * 0.7}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize * 0.35}
        fontFamily="system-ui, sans-serif"
        opacity={0.7}
      >
        {enrolled} / {target}
      </text>
    </svg>
  );
}
