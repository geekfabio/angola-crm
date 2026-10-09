import Avatar from "@/components/_ui/avatar";
import ModuleHeader from "@/components/_common/module-header";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Sparkline from "@/components/_common/sparkline";
import SegmentBar from "@/components/_common/segment-bar";
import {
  MANAGER_FORECAST,
  MONTHLY_QUOTA,
  MONTHLY_TOTAL,
  MONTHLY_TREND,
  ZONE_FORECAST,
} from "@/data/forecast";
import { formatMoney, formatPercent } from "@/lib/format";

function quotaPercent(amount: number, quota: number) {
  return Math.round((amount / quota) * 100);
}

export default function Forecast() {
  const monthlyPercent = quotaPercent(MONTHLY_TOTAL, MONTHLY_QUOTA);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Previsão" />
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-5">
          <div className="border-border flex flex-col gap-3 rounded-xl border p-5">
            <span className="caption-style text-subtle">
              Previsão do mês
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-[28px] leading-none font-semibold">
                {formatMoney(MONTHLY_TOTAL)}
              </span>
              <Sparkline values={MONTHLY_TREND} className="h-[22px]" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="caption-style text-subtle flex items-center justify-between">
                <span>Objetivo: {formatMoney(MONTHLY_QUOTA)}</span>
                <span>{formatPercent(monthlyPercent)}</span>
              </div>
              <SegmentBar
                percent={monthlyPercent}
                segments={63}
                className="h-3 w-full border border-white/4 px-px"
                segmentClassName="h-2"
                trackClassName="bg-white/8"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="eyebrow-style text-faint font-normal">
              Por gestor
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MANAGER_FORECAST.map((manager) => {
                const percent = quotaPercent(manager.amount, manager.quota);
                return (
                  <div
                    key={manager.name}
                    className="border-border flex flex-col gap-3 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar src={manager.avatar} alt="" />
                      <span className="lead-style truncate font-medium">
                        {manager.name}
                      </span>
                    </div>
                    <span className="block tabular-nums">
                      {formatMoney(manager.amount)}
                    </span>
                    <SegmentBar
                      percent={percent}
                      className="h-2.5 w-full border border-white/4 px-px"
                      trackClassName="bg-white/8"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="eyebrow-style text-faint font-normal">Por zona</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ZONE_FORECAST.map((zone) => {
                const percent = quotaPercent(zone.amount, zone.quota);
                return (
                  <div
                    key={zone.zone}
                    className="border-border flex flex-col gap-3 rounded-lg border p-4"
                  >
                    <span className="lead-style font-medium">{zone.zone}</span>
                    <span className="block tabular-nums">
                      {formatMoney(zone.amount)}
                    </span>
                    <SegmentBar
                      percent={percent}
                      className="h-2.5 w-full border border-white/4 px-px"
                      trackClassName="bg-white/8"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}
