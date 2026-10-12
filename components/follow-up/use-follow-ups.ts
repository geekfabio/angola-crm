"use client";

import { useMemo } from "react";
import { useToday } from "@/hooks/use-today";
import { buildFollowUps } from "@/lib/follow-up";
import { useActivitiesStore } from "@/stores/activities-store";
import { useCompaniesStore } from "@/stores/companies-store";
import { useOpportunitiesStore } from "@/stores/opportunities-store";
import { useSalesStore } from "@/stores/sales-store";

export function useFollowUps() {
  const companies = useCompaniesStore((state) => state.companies);
  const tasks = useActivitiesStore((state) => state.tasks);
  const opportunities = useOpportunitiesStore((state) => state.opportunities);
  const sales = useSalesStore((state) => state.sales);
  const today = useToday();

  const items = useMemo(
    () => buildFollowUps({ companies, tasks, opportunities, sales, today }),
    [companies, tasks, opportunities, sales, today],
  );

  return { items, today };
}
