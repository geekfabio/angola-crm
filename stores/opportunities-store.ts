import { create } from "zustand";
import { CURRENT_USER } from "@/data/companies";
import {
  OPPORTUNITIES,
  type LossReason,
  type Opportunity,
  type OpportunityStage,
} from "@/data/opportunities";
import { DEFAULT_FILTERS } from "@/lib/opportunities";

type View = "kanban" | "tabela";

type PendingLossMove = {
  id: string;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

type OpportunitiesState = {
  opportunities: Opportunity[];
  owner: string;
  stage: string;
  search: string;
  view: View;
  detailId: string | null;
  detailOpen: boolean;
  newOpportunityOpen: boolean;
  pendingLossMove: PendingLossMove | null;
  setOwner: (owner: string) => void;
  setStage: (stage: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
  setView: (view: View) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  setNewOpportunityOpen: (open: boolean) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  requestStageMove: (id: string, stage: OpportunityStage) => void;
  confirmLossMove: (reason: LossReason) => void;
  cancelLossMove: () => void;
};

export const useOpportunitiesStore = create<OpportunitiesState>((set, get) => ({
  opportunities: OPPORTUNITIES,
  ...DEFAULT_FILTERS,
  view: "kanban",
  detailId: null,
  detailOpen: false,
  newOpportunityOpen: false,
  pendingLossMove: null,

  setOwner: (owner) => set({ owner }),
  setStage: (stage) => set({ stage }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),
  setView: (view) => set({ view }),

  openDetail: (detailId) => set({ detailId, detailOpen: true }),
  closeDetail: () => set({ detailOpen: false }),
  setNewOpportunityOpen: (newOpportunityOpen) => set({ newOpportunityOpen }),

  addOpportunity: (opportunity) =>
    set((state) => ({
      opportunities: [opportunity, ...state.opportunities],
      newOpportunityOpen: false,
    })),

  requestStageMove: (id, stage) => {
    const opportunity = get().opportunities.find((item) => item.id === id);
    if (!opportunity || opportunity.stage === stage) return;

    if (stage === "Fechada - Perdida") {
      set({ pendingLossMove: { id } });
      return;
    }

    set((state) => ({
      opportunities: state.opportunities.map((item) =>
        item.id === id
          ? {
              ...item,
              stage,
              probability: stage === "Fechada - Ganha" ? 100 : item.probability,
              lossReason: undefined,
              stageHistory: [
                ...item.stageHistory,
                { stage, date: today(), author: CURRENT_USER.name },
              ],
            }
          : item,
      ),
    }));
  },

  confirmLossMove: (reason) => {
    const pending = get().pendingLossMove;
    if (!pending) return;

    set((state) => ({
      opportunities: state.opportunities.map((item) =>
        item.id === pending.id
          ? {
              ...item,
              stage: "Fechada - Perdida",
              probability: 0,
              lossReason: reason,
              stageHistory: [
                ...item.stageHistory,
                {
                  stage: "Fechada - Perdida",
                  date: today(),
                  author: CURRENT_USER.name,
                },
              ],
            }
          : item,
      ),
      pendingLossMove: null,
    }));
  },

  cancelLossMove: () => set({ pendingLossMove: null }),
}));
