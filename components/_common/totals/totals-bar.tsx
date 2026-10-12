"use client";

import { useId, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/easings";
import { cn } from "@/lib/utils";
import ChevronIcon from "@/public/assets/images/_common/chevron-down.svg";

export type TotalItem = {
  key: string;
  label: string;
  value: string;
  fullValue?: string;
  hint?: string;
  tone?: "warning" | "danger" | "success";
  pressed?: boolean;
  onSelect?: () => void;
};

type TotalsBarProps = {
  id: string;
  items: TotalItem[];
  summary: string;
};

const STORAGE_PREFIX = "totais-";

const memory = new Map<string, boolean>();

function readHidden(id: string) {
  if (memory.has(id)) return memory.get(id)!;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + id) === "ocultos";
  } catch {
    return false;
  }
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeHidden(id: string, hidden: boolean) {
  memory.set(id, hidden);
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, hidden ? "ocultos" : "visiveis");
  } catch {}
  listeners.forEach((listener) => listener());
}

const TONE_DOT = {
  warning: "bg-warning",
  danger: "bg-danger",
  success: "bg-(--tag-green-text)",
} as const;

function TileContent({ item }: { item: TotalItem }) {
  return (
    <>
      <span className="caption-style text-subtle flex min-w-0 items-center gap-1.5">
        {item.tone && (
          <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[item.tone])} />
        )}
        <span className="truncate">{item.label}</span>
      </span>
      <span
        title={item.fullValue}
        className="max-w-full truncate text-[18px] leading-none font-medium tabular-nums sm:text-[20px]"
      >
        {item.value}
        {item.fullValue && <span className="sr-only"> ({item.fullValue})</span>}
      </span>
      {item.hint && <span className="caption-style text-faint hidden max-w-full truncate sm:block">{item.hint}</span>}
    </>
  );
}

const TILE_CLASS =
  "flex min-w-0 flex-col items-start gap-2 rounded-xl border p-3 text-left transition-[background-color,border-color] duration-150 ease-power3-out";

export default function TotalsBar({ id, items, summary }: TotalsBarProps) {
  const hidden = useSyncExternalStore(
    subscribe,
    () => readHidden(id),
    () => false,
  );
  const reduceMotion = useReducedMotion();
  const regionId = useId();

  function toggle() {
    writeHidden(id, !hidden);
  }

  return (
    <section aria-label="Totais" className="shrink-0 px-4 pt-3">
      <div className="flex items-center">
        <button
          type="button"
          aria-expanded={!hidden}
          aria-controls={regionId}
          onClick={toggle}
          className="caption-style text-subtle hover:text-soft focus-visible:ring-ring/60 -mx-1.5 flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-left outline-none transition-colors duration-150 focus-visible:ring-2"
        >
          <ChevronIcon
            aria-hidden
            className={cn(
              "size-3 shrink-0 transition-transform duration-200 ease-power3-out",
              hidden && "-rotate-90",
            )}
          />
          <span className="eyebrow-style shrink-0">Totais</span>
          {hidden && <span className="text-soft min-w-0 truncate">· {summary}</span>}
          <span className="text-faint ml-auto shrink-0 pl-2">{hidden ? "Mostrar" : "Ocultar"}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!hidden && (
          <motion.div
            id={regionId}
            key="totals"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: ease.power3Out }}
            className="overflow-hidden"
          >
            <ul className="grid grid-cols-2 gap-2 pt-2 pb-1 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
              {items.map((item) => (
                <li key={item.key} className="flex min-w-0">
                  {item.onSelect ? (
                    <button
                      type="button"
                      aria-pressed={item.pressed}
                      onClick={item.onSelect}
                      className={cn(
                        TILE_CLASS,
                        "focus-visible:ring-ring/60 w-full cursor-pointer outline-none focus-visible:ring-2 motion-safe:active:scale-[0.98]",
                        item.pressed ? "border-foreground/40 bg-white/5" : "border-border hover:bg-white/3",
                      )}
                    >
                      <TileContent item={item} />
                    </button>
                  ) : (
                    <div className={cn(TILE_CLASS, "border-border w-full")}>
                      <TileContent item={item} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
