"use client";

import { useMemo } from "react";
import ModuleHeader from "@/components/_common/module-header";
import AutomationsToolbar from "./toolbar/toolbar";
import AutomationsTotals from "./automations-totals";
import AutomationsTable from "./table/automations-table";
import AutomationBuilder from "./builder/automation-builder";
import { filterAutomations } from "@/lib/automations";
import { useAutomationsStore } from "@/stores/automations-store";

export default function Automations() {
  const automations = useAutomationsStore((state) => state.automations);
  const status = useAutomationsStore((state) => state.status);
  const search = useAutomationsStore((state) => state.search);
  const editorId = useAutomationsStore((state) => state.editorId);

  const visible = useMemo(
    () => filterAutomations(automations, { status, search }),
    [automations, status, search],
  );

  const editing = automations.find((automation) => automation.id === editorId);
  if (editing) return <AutomationBuilder automation={editing} />;

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Automações" count={visible.length} />
      <AutomationsTotals automations={visible} />
      <AutomationsToolbar />
      <AutomationsTable automations={visible} />
    </section>
  );
}
