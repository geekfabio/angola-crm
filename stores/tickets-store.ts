import { create } from "zustand";
import { CURRENT_USER } from "@/data/companies";
import {
  TICKETS,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from "@/data/tickets";
import { DEFAULT_FILTERS } from "@/lib/tickets";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

type TicketsState = {
  tickets: Ticket[];
  status: string;
  priority: string;
  assignee: string;
  search: string;
  detailId: string | null;
  detailOpen: boolean;
  newTicketOpen: boolean;
  fromEmailOpen: boolean;
  setStatus: (status: string) => void;
  setPriority: (priority: string) => void;
  setAssignee: (assignee: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  setNewTicketOpen: (open: boolean) => void;
  setFromEmailOpen: (open: boolean) => void;
  addTicket: (ticket: Ticket) => void;
  addComment: (ticketId: string, body: string) => void;
  setTicketStatus: (ticketId: string, status: TicketStatus) => void;
  setTicketPriority: (ticketId: string, priority: TicketPriority) => void;
};

export const useTicketsStore = create<TicketsState>((set) => ({
  tickets: TICKETS,
  ...DEFAULT_FILTERS,
  detailId: null,
  detailOpen: false,
  newTicketOpen: false,
  fromEmailOpen: false,

  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  setAssignee: (assignee) => set({ assignee }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),

  openDetail: (detailId) => set({ detailId, detailOpen: true }),
  closeDetail: () => set({ detailOpen: false }),
  setNewTicketOpen: (newTicketOpen) => set({ newTicketOpen }),
  setFromEmailOpen: (fromEmailOpen) => set({ fromEmailOpen }),

  addTicket: (ticket) =>
    set((state) => ({
      tickets: [ticket, ...state.tickets],
      newTicketOpen: false,
      fromEmailOpen: false,
    })),

  addComment: (ticketId, body) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              updatedAt: today(),
              comments: [
                ...ticket.comments,
                {
                  id: nextId("c"),
                  author: CURRENT_USER.name,
                  authorAvatar: CURRENT_USER.avatar,
                  body,
                  date: today(),
                },
              ],
              timeline: [
                ...ticket.timeline,
                {
                  id: nextId("t"),
                  label: "Comentário adicionado",
                  date: today(),
                  author: CURRENT_USER.name,
                },
              ],
            }
          : ticket,
      ),
    })),

  setTicketStatus: (ticketId, status) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status,
              updatedAt: today(),
              timeline: [
                ...ticket.timeline,
                {
                  id: nextId("t"),
                  label: `Estado alterado para ${status}`,
                  date: today(),
                  author: CURRENT_USER.name,
                },
              ],
            }
          : ticket,
      ),
    })),

  setTicketPriority: (ticketId, priority) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              priority,
              updatedAt: today(),
              timeline: [
                ...ticket.timeline,
                {
                  id: nextId("t"),
                  label: `Prioridade alterada para ${priority}`,
                  date: today(),
                  author: CURRENT_USER.name,
                },
              ],
            }
          : ticket,
      ),
    })),
}));
