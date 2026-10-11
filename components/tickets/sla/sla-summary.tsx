"use client";

import type { Ticket } from "@/data/tickets";
import { slaSummary } from "@/lib/sla";
import type { SlaFilter } from "@/lib/tickets";
import { useTicketsStore } from "@/stores/tickets-store";
import { cn } from "@/lib/utils";

type SlaSummaryProps = {
  tickets: Ticket[];
  now: number | null;
};

type Tile = {
  filter: SlaFilter | null;
  label: string;
  value: string;
  hint: string;
  tone?: "warning" | "danger";
};

export default function SlaSummary({ tickets, now }: SlaSummaryProps) {
  const sla = useTicketsStore((state) => state.sla);
  const setSla = useTicketsStore((state) => state.setSla);
  const summary = slaSummary(tickets, now);
  const pending = now === null;

  const tiles: Tile[] = [
    { filter: "abertos", label: "Por resolver", value: String(summary.open), hint: "tickets em aberto" },
    {
      filter: "risco",
      label: "Em risco",
      value: pending ? "—" : String(summary.risk),
      hint: "menos de 25% do prazo",
      tone: summary.risk > 0 ? "warning" : undefined,
    },
    {
      filter: "atrasados",
      label: "Atrasados",
      value: pending ? "—" : String(summary.breached),
      hint: "prazo de SLA ultrapassado",
      tone: summary.breached > 0 ? "danger" : undefined,
    },
    {
      filter: null,
      label: "Cumprimento",
      value: summary.compliance === null ? "—" : `${summary.compliance}%`,
      hint: "dos tickets resolvidos",
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 px-4 pt-4 md:grid-cols-4">
      {tiles.map((tile) => {
        const active = tile.filter !== null && sla === tile.filter;
        const content = (
          <>
            <span className="caption-style text-subtle flex items-center gap-1.5">
              {tile.tone && (
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    tile.tone === "danger" ? "bg-danger" : "bg-warning",
                  )}
                />
              )}
              {tile.label}
            </span>
            <span className="text-[22px] leading-none font-medium">{tile.value}</span>
            <span className="caption-style text-faint">{tile.hint}</span>
          </>
        );
        const className =
          "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-[background-color,border-color] duration-150 ease-power3-out";

        if (tile.filter === null) {
          return (
            <div key={tile.label} className={cn(className, "border-border")}>
              {content}
            </div>
          );
        }
        const filter = tile.filter;
        return (
          <button
            key={tile.label}
            type="button"
            aria-pressed={active}
            onClick={() => setSla(active ? "todos" : filter)}
            className={cn(
              className,
              "focus-visible:ring-ring/60 cursor-pointer outline-none focus-visible:ring-2 active:scale-[0.98] motion-reduce:active:scale-100",
              active ? "border-foreground/40 bg-white/5" : "border-border hover:bg-white/3",
            )}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
