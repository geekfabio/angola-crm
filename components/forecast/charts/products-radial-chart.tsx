"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SlidingNumber } from "@/components/motion-primitives/sliding-number";
import { PRODUCT_CATEGORIES, type Opportunity } from "@/data/opportunities";
import { ease } from "@/lib/easings";

type ProductsRadialChartProps = {
  opportunities: Opportunity[];
};

const WIDTH = 320;
const HEIGHT = 190;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT - 10;
const INNER_RADIUS = 28;
const MAX_LENGTH = 130;

function polar(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER_X + radius * Math.cos(angleRad),
    y: CENTER_Y + radius * Math.sin(angleRad),
  };
}

export default function ProductsRadialChart({
  opportunities,
}: ProductsRadialChartProps) {
  const prefersReducedMotion = useReducedMotion();

  const counts = useMemo(() => {
    const tally = new Map<string, number>(
      PRODUCT_CATEGORIES.map((category) => [category, 0]),
    );
    for (const opportunity of opportunities) {
      for (const product of opportunity.products) {
        tally.set(product, (tally.get(product) ?? 0) + 1);
      }
    }
    return PRODUCT_CATEGORIES.map((category) => ({
      category,
      count: tally.get(category) ?? 0,
    })).sort((a, b) => b.count - a.count);
  }, [opportunities]);

  const total = counts.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(1, ...counts.map((item) => item.count));
  const top3 = counts.slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full max-w-[320px]"
          aria-hidden
        >
          {counts.map((item, index) => {
            const angle = 180 + (index + 0.5) * (180 / counts.length);
            const length = (item.count / max) * MAX_LENGTH;
            const inner = polar(angle, INNER_RADIUS);
            const outer = polar(angle, INNER_RADIUS + Math.max(length, 6));
            const opacity = 0.35 + (item.count / max) * 0.65;

            return (
              <motion.line
                key={item.category}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--primary)"
                strokeOpacity={opacity}
                strokeWidth={16}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  delay: prefersReducedMotion ? 0 : index * 0.08,
                  ease: ease.power3Out,
                }}
              />
            );
          })}
        </svg>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center"
          style={{ paddingBottom: HEIGHT - CENTER_Y - 4 }}
        >
          <span className="flex items-baseline text-[26px] leading-none font-semibold">
            <SlidingNumber value={total} />
          </span>
          <span className="caption-style text-subtle">Produtos mencionados</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {top3.map((item) => (
          <span
            key={item.category}
            className="caption-style flex items-center gap-1.5"
          >
            <span
              aria-hidden
              className="bg-primary size-2 shrink-0 rounded-full"
              style={{ opacity: 0.35 + (item.count / max) * 0.65 }}
            />
            <span className="text-foreground">{item.category}</span>
            <span className="text-subtle">{item.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
