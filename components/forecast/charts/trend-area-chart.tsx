"use client";

import { useId, useMemo, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/easings";
import { formatMoney } from "@/lib/format";

type TrendAreaChartProps = {
  values: number[];
  className?: string;
  color?: string;
  unitLabel?: string;
};

const WIDTH = 1000;
const HEIGHT = 220;
const PAD_X = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 8;

function buildGeometry(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (WIDTH - PAD_X * 2) / Math.max(1, values.length - 1);
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  return values.map((value, index) => ({
    x: PAD_X + index * stepX,
    y: PAD_TOP + (1 - (value - min) / range) * plotHeight,
    value,
  }));
}

export default function TrendAreaChart({
  values,
  className,
  color = "var(--primary)",
  unitLabel = "Semana",
}: TrendAreaChartProps) {
  const gradientId = useId();
  const prefersReducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo(() => buildGeometry(values), [values]);

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${points[points.length - 1].x.toFixed(2)},${HEIGHT - PAD_BOTTOM} L${points[0].x.toFixed(2)},${HEIGHT - PAD_BOTTOM} Z`;

  function handleMove(event: MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (points.length - 1));
    setHoverIndex(Math.min(points.length - 1, Math.max(0, index)));
  }

  const active = hoverIndex !== null ? points[hoverIndex] : null;
  const last = points[points.length - 1];

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-full w-full cursor-crosshair"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.24} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.9,
            ease: ease.power2Out,
          }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.1,
            ease: ease.power3Out,
          }}
        />

        <motion.circle
          cx={last.x}
          cy={last.y}
          r={4.5}
          fill={color}
          stroke="var(--background)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : 1.1,
            ease: ease.power3Out,
          }}
        />

        {active && (
          <g>
            <line
              x1={active.x}
              x2={active.x}
              y1={PAD_TOP}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--line-strong)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={active.x}
              cy={active.y}
              r={5}
              fill={color}
              stroke="var(--background)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>

      {active && (
        <div
          className="pointer-events-none relative"
          style={{ marginTop: -HEIGHT }}
        >
          <div
            className="border-line-strong bg-popover shadow-overlay caption-style absolute flex -translate-x-1/2 flex-col gap-0.5 rounded-lg border px-2.5 py-1.5 whitespace-nowrap"
            style={{
              left: `${(active.x / WIDTH) * 100}%`,
              top: `${Math.max(0, (active.y / HEIGHT) * 100 - 18)}%`,
            }}
          >
            <span className="text-subtle">{unitLabel} {hoverIndex! + 1}</span>
            <span className="text-foreground font-medium tabular-nums">
              {formatMoney(active.value)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
