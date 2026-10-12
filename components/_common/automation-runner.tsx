"use client";

import { useEffect } from "react";
import { useToday } from "@/hooks/use-today";
import { useNow } from "@/hooks/use-now";
import { useAutomationRunsStore } from "@/stores/automation-runs-store";
import { useAutomationsStore } from "@/stores/automations-store";
import { useSalesStore } from "@/stores/sales-store";

export default function AutomationRunner() {
  const ready = useNow() !== null;
  const today = useToday();
  const automations = useAutomationsStore((state) => state.automations);
  const sales = useSalesStore((state) => state.sales);

  useEffect(() => {
    if (!ready) return;
    useAutomationRunsStore.getState().runDue(today);
  }, [ready, today, automations, sales]);

  return null;
}
