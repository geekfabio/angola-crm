"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/_ui/button";
import TrendAreaChart from "./trend-area-chart";
import { ease } from "@/lib/easings";

type Metric = {
  key: string;
  label: string;
  values: number[];
  color: string;
};

type SegmentedTrendChartProps = {
  metrics: Metric[];
  className?: string;
};

export default function SegmentedTrendChart({
  metrics,
  className,
}: SegmentedTrendChartProps) {
  const [activeKey, setActiveKey] = useState(metrics[0]?.key);
  const active = metrics.find((metric) => metric.key === activeKey) ?? metrics[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {metrics.map((metric) => (
          <Button
            key={metric.key}
            type="button"
            variant={metric.key === active.key ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveKey(metric.key)}
            className="rounded-full"
          >
            {metric.label}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: ease.power2Out }}
        >
          <TrendAreaChart
            values={active.values}
            color={active.color}
            className={className}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
