"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/components/_ui/button";
import type { RankedItem } from "@/components/_common/ranked-bar-list";
import { ease } from "@/lib/easings";
import { compactMoneyParts } from "@/lib/format";

type Mode = "valor" | "quota";

type ZoneBarChartProps = {
  items: RankedItem[];
};

const CHART_HEIGHT = 160;

export default function ZoneBarChart({ items }: ZoneBarChartProps) {
  const [mode, setMode] = useState<Mode>("valor");
  const prefersReducedMotion = useReducedMotion();

  const maxValue = Math.max(1, ...items.map((item) => item.amount));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant={mode === "valor" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setMode("valor")}
          className="rounded-full"
        >
          Valor
        </Button>
        <Button
          type="button"
          variant={mode === "quota" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setMode("quota")}
          className="rounded-full"
        >
          % da quota
        </Button>
      </div>

      <div
        className="flex items-end justify-between gap-3 px-2"
        style={{ height: CHART_HEIGHT }}
      >
        {items.map((item, index) => {
          const quotaPercent = Math.round((item.amount / item.quota) * 100);
          const heightPercent =
            mode === "valor"
              ? (item.amount / maxValue) * 100
              : Math.min(100, quotaPercent);
          const parts = compactMoneyParts(item.amount);
          const bubbleLabel =
            mode === "valor" ? `${parts.amount} ${parts.suffix}` : `${quotaPercent}%`;

          return (
            <div
              key={item.key}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <motion.span
                className="border-line-strong bg-popover shadow-overlay caption-style rounded-full border px-2 py-1 whitespace-nowrap"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  delay: prefersReducedMotion ? 0 : 0.5 + index * 0.08,
                  ease: ease.power3Out,
                }}
              >
                {bubbleLabel}
              </motion.span>
              <div className="flex w-full flex-1 items-end">
                <motion.div
                  className="bg-primary w-full rounded-t-[6px]"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPercent, 3)}%` }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    delay: prefersReducedMotion ? 0 : index * 0.08,
                    ease: ease.power3Out,
                  }}
                />
              </div>
              <span className="caption-style text-subtle truncate">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
