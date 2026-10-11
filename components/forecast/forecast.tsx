"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import ModuleHeader from "@/components/_common/module-header";
import { ScrollArea } from "@/components/_ui/scroll-area";
import HeroFigure from "./charts/hero-figure";
import StatTile from "@/components/_common/stat-tile";
import FunnelChart from "./charts/funnel-chart";
import SegmentedTrendChart from "./charts/segmented-trend-chart";
import RankedBarList, { type RankedItem } from "@/components/_common/ranked-bar-list";
import ZoneBarChart from "./charts/zone-bar-chart";
import RecentOpportunitiesList from "./charts/recent-opportunities-list";
import ProductsRadialChart from "./charts/products-radial-chart";
import AtRiskList from "@/components/_common/at-risk-list";
import { useCompaniesStore } from "@/stores/companies-store";
import { MONTHLY_QUOTA, MONTHLY_TREND, ZONE_FORECAST } from "@/data/forecast";
import { stageTotal, weightedPipeline } from "@/lib/opportunities";
import {
  activeVsInactive,
  averageDealSize,
  byManager,
  clientsAtRisk,
  conversionRate,
  lostOpportunities,
  openOpportunities,
  pipelineByStage,
  scaleTrendTo,
  wonOpportunities,
} from "@/lib/dashboard";
import { compactMoneyParts, formatMoney } from "@/lib/format";
import { ease } from "@/lib/easings";
import { useOpportunitiesStore } from "@/stores/opportunities-store";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const KPI_CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function Forecast() {
  const opportunities = useOpportunitiesStore((state) => state.opportunities);
  const companies = useCompaniesStore((state) => state.companies);
  const prefersReducedMotion = useReducedMotion();

  const metrics = useMemo(() => {
    const liveCompanies = companies.filter((company) => !company.archived);
    const open = openOpportunities(opportunities);
    const pipelineTotal = stageTotal(open);
    const weighted = weightedPipeline(open);
    const trend = scaleTrendTo(MONTHLY_TREND, pipelineTotal);
    const trendStart = trend[0];
    const trendEnd = trend[trend.length - 1];
    const trendDeltaPercent = trendStart
      ? Math.round(((trendEnd - trendStart) / trendStart) * 100)
      : 0;
    const wonTotal = stageTotal(wonOpportunities(opportunities));
    const lostTotal = stageTotal(lostOpportunities(opportunities));
    const { active } = activeVsInactive(liveCompanies);

    return {
      pipelineTotal,
      weighted,
      trend,
      trendDeltaPercent,
      wonTrend: scaleTrendTo(MONTHLY_TREND, Math.max(wonTotal, 1), 0.3),
      lostTrend: scaleTrendTo(MONTHLY_TREND, Math.max(lostTotal, 1), 0.3),
      openCount: open.length,
      conversion: conversionRate(opportunities),
      avgDeal: averageDealSize(opportunities),
      activeClients: active,
      stages: pipelineByStage(opportunities),
      managers: byManager(opportunities).map<RankedItem>((manager) => ({
        key: manager.name,
        label: manager.name,
        avatar: manager.avatar,
        amount: manager.amount,
        quota: manager.quota,
      })),
      zones: ZONE_FORECAST.map<RankedItem>((zone) => ({
        key: zone.zone,
        label: zone.zone,
        amount: zone.amount,
        quota: zone.quota,
      })),
      risk: clientsAtRisk(liveCompanies),
    };
  }, [opportunities, companies]);

  const weightedParts = compactMoneyParts(metrics.weighted);
  const pipelineParts = compactMoneyParts(metrics.pipelineTotal);
  const avgDealParts = compactMoneyParts(metrics.avgDeal);
  const quotaPercent = Math.round((metrics.weighted / MONTHLY_QUOTA) * 100);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Previsão" />
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-8 p-5">
          <HeroFigure
            label="Carteira ponderada do mês"
            amount={weightedParts.amount}
            suffix={weightedParts.suffix}
            quotaPercent={quotaPercent}
            quotaLabel={`Objetivo: ${formatMoney(MONTHLY_QUOTA)}`}
            trend={metrics.trend}
          />

          <motion.div
            variants={KPI_CONTAINER_VARIANTS}
            initial="hidden"
            animate="show"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatTile
              label="Carteira aberta"
              value={pipelineParts.amount}
              decimals={1}
              suffix={pipelineParts.suffix}
              trend={metrics.trend}
              delta={{
                percent: metrics.trendDeltaPercent,
                positiveIsGood: true,
                periodLabel: "nas últimas 14 semanas",
              }}
              index={0}
            />
            <StatTile
              label="Oportunidades abertas"
              value={metrics.openCount}
              index={1}
            />
            <StatTile
              label="Taxa de conversão"
              value={metrics.conversion}
              suffix="%"
              index={2}
            />
            <StatTile
              label="Ticket médio (ganho)"
              value={avgDealParts.amount}
              decimals={1}
              suffix={avgDealParts.suffix}
              index={3}
            />
          </motion.div>

          <motion.div
            variants={SECTION_VARIANTS}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
            className="border-border flex flex-col gap-4 rounded-xl border p-5"
          >
            <h2 className="eyebrow-style text-faint font-normal">
              Funil de oportunidades
            </h2>
            <FunnelChart stages={metrics.stages} />
          </motion.div>

          <motion.div
            variants={SECTION_VARIANTS}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
            className="border-border flex flex-col gap-4 rounded-xl border p-5"
          >
            <h2 className="eyebrow-style text-faint font-normal">
              Tendência da carteira
            </h2>
            <SegmentedTrendChart
              className="h-[180px] w-full"
              metrics={[
                { key: "carteira", label: "Carteira", values: metrics.trend, color: "var(--primary)" },
                { key: "ganho", label: "Ganho", values: metrics.wonTrend, color: "var(--success)" },
                { key: "perdido", label: "Perdido", values: metrics.lostTrend, color: "var(--danger)" },
              ]}
            />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              variants={SECTION_VARIANTS}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
              className="border-border flex flex-col gap-4 rounded-xl border p-5"
            >
              <h2 className="eyebrow-style text-faint font-normal">
                Oportunidades recentes
              </h2>
              <RecentOpportunitiesList opportunities={opportunities} />
            </motion.div>

            <motion.div
              variants={SECTION_VARIANTS}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
              className="border-border flex flex-col gap-4 rounded-xl border p-5"
            >
              <h2 className="eyebrow-style text-faint font-normal">
                Produtos mais procurados
              </h2>
              <ProductsRadialChart opportunities={opportunities} />
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              variants={SECTION_VARIANTS}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
              className="border-border flex flex-col gap-4 rounded-xl border p-5"
            >
              <h2 className="eyebrow-style text-faint font-normal">
                Por gestor
              </h2>
              <RankedBarList items={metrics.managers} />
            </motion.div>

            <motion.div
              variants={SECTION_VARIANTS}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
              className="border-border flex flex-col gap-4 rounded-xl border p-5"
            >
              <h2 className="eyebrow-style text-faint font-normal">
                Por zona
              </h2>
              <ZoneBarChart items={metrics.zones} />
            </motion.div>
          </div>

          <motion.div
            variants={SECTION_VARIANTS}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: ease.power3Out }}
            className="border-border flex flex-col gap-2 rounded-xl border p-5"
          >
            <h2 className="eyebrow-style text-faint font-normal">
              Clientes em risco
            </h2>
            <AtRiskList clients={metrics.risk} />
          </motion.div>
        </div>
      </ScrollArea>
    </section>
  );
}
