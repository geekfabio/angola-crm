"use client";

import { useMemo } from "react";
import ModuleHeader from "@/components/_common/module-header";
import TicketsToolbar from "./toolbar/toolbar";
import TicketsTable from "./table/tickets-table";
import TicketDetail from "./detail/ticket-detail";
import NewTicketDialog from "./new-ticket/new-ticket-dialog";
import CreateFromEmailDialog from "./from-email/create-from-email-dialog";
import { filterTickets } from "@/lib/tickets";
import { useTicketsStore } from "@/stores/tickets-store";

export default function Tickets() {
  const tickets = useTicketsStore((state) => state.tickets);
  const status = useTicketsStore((state) => state.status);
  const priority = useTicketsStore((state) => state.priority);
  const assignee = useTicketsStore((state) => state.assignee);
  const search = useTicketsStore((state) => state.search);

  const visible = useMemo(
    () => filterTickets(tickets, { status, priority, assignee, search }),
    [tickets, status, priority, assignee, search],
  );

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ModuleHeader title="Tickets" count={visible.length} />
      <TicketsToolbar />
      <TicketsTable tickets={visible} />
      <TicketDetail />
      <NewTicketDialog />
      <CreateFromEmailDialog />
    </section>
  );
}
