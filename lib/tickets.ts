import type { Ticket } from "@/data/tickets";

export const ANY_STATUS = "any";
export const ANY_PRIORITY = "any";
export const ALL_ASSIGNEES = "all";

export type TicketFilters = {
  status: string;
  priority: string;
  assignee: string;
  search: string;
};

export const DEFAULT_FILTERS: TicketFilters = {
  status: ANY_STATUS,
  priority: ANY_PRIORITY,
  assignee: ALL_ASSIGNEES,
  search: "",
};

export function filterTickets(
  tickets: Ticket[],
  { status, priority, assignee, search }: TicketFilters,
): Ticket[] {
  const query = search.trim().toLowerCase();

  return tickets.filter((ticket) => {
    if (status !== ANY_STATUS && ticket.status !== status) return false;
    if (priority !== ANY_PRIORITY && ticket.priority !== priority) return false;
    if (assignee !== ALL_ASSIGNEES && ticket.assignee !== assignee) return false;
    if (
      query &&
      !ticket.subject.toLowerCase().includes(query) &&
      !(ticket.companyName ?? "").toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}
