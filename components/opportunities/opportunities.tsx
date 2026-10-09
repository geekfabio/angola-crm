"use client";

import { useMemo } from "react";
import OpportunitiesHeader from "./header/header";
import OpportunitiesToolbar from "./toolbar/toolbar";
import KanbanBoard from "./kanban/kanban-board";
import OpportunitiesTable from "./table/opportunities-table";
import OpportunityDetail from "./detail/opportunity-detail";
import NewOpportunityDialog from "./new-opportunity/new-opportunity-dialog";
import LossReasonDialog from "./loss-reason-dialog";
import { filterOpportunities } from "@/lib/opportunities";
import { useOpportunitiesStore } from "@/stores/opportunities-store";

export default function Opportunities() {
  const opportunities = useOpportunitiesStore((state) => state.opportunities);
  const owner = useOpportunitiesStore((state) => state.owner);
  const stage = useOpportunitiesStore((state) => state.stage);
  const search = useOpportunitiesStore((state) => state.search);
  const view = useOpportunitiesStore((state) => state.view);

  const visible = useMemo(
    () => filterOpportunities(opportunities, { owner, stage, search }),
    [opportunities, owner, stage, search],
  );

  return (
    <section
      id="opportunities"
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <OpportunitiesHeader count={visible.length} />
      <OpportunitiesToolbar />
      {view === "kanban" ? (
        <KanbanBoard opportunities={visible} />
      ) : (
        <OpportunitiesTable opportunities={visible} />
      )}
      <OpportunityDetail />
      <NewOpportunityDialog />
      <LossReasonDialog />
    </section>
  );
}
