import { create } from "zustand";
import { COMPANIES, type Company, type SortKey } from "@/data/companies";
import { diffRecord } from "@/lib/audit";
import { DEFAULT_FILTERS, type CompanyFilters } from "@/lib/companies";
import { formatMoney, formatPercent } from "@/lib/format";
import { recordEvent } from "./audit-store";

export type CompanyPatch = Partial<
  Pick<Company, "name" | "owner" | "zone" | "tags" | "pipelineValue" | "openDeals" | "winProbability">
>;

const COMPANY_LABELS: Partial<Record<keyof Company, string>> = {
  name: "Nome",
  owner: "Gestor de conta",
  zone: "Zona",
  tags: "Segmento e fase",
  pipelineValue: "Valor em carteira",
  openDeals: "Oportunidades abertas",
  winProbability: "Probabilidade de fecho",
};

const COMPANY_FORMATTERS = {
  tags: (tags: Company["tags"]) => tags.join(", "),
  pipelineValue: (value: number) => formatMoney(value),
  winProbability: (value: number) => formatPercent(value),
};

export type CompaniesView = "lista" | "grelha";

const VIEW_STORAGE_KEY = "clientes-vista";

export function readStoredView(): CompaniesView | null {
  try {
    const value = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return value === "lista" || value === "grelha" ? value : null;
  } catch {
    return null;
  }
}

type CompaniesState = CompanyFilters & {
  companies: Company[];
  view: CompaniesView;
  setView: (view: CompaniesView) => void;
  selectedIds: string[];
  detailId: string | null;
  detailOpen: boolean;
  profileName: string | null;
  profileOpen: boolean;
  newCompanyOpen: boolean;
  setSortBy: (sortBy: SortKey) => void;
  setOwner: (owner: string) => void;
  setStage: (stage: string) => void;
  setActivityWindow: (days: number) => void;
  setZone: (zone: string) => void;
  setTeam: (team: string) => void;
  applyView: (filters: Partial<CompanyFilters>) => void;
  resetFilters: () => void;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  openProfile: (name: string) => void;
  closeProfile: () => void;
  setNewCompanyOpen: (open: boolean) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, patch: CompanyPatch) => void;
  updateMany: (ids: string[], patch: Pick<CompanyPatch, "owner" | "zone">) => void;
  archiveCompanies: (ids: string[]) => void;
};

export const useCompaniesStore = create<CompaniesState>((set, get) => {
  function restore(snapshot: Company[]) {
    set((state) => ({
      companies: state.companies.map(
        (company) => snapshot.find((item) => item.id === company.id) ?? company,
      ),
    }));
  }

  return {
    companies: COMPANIES,
    view: "lista",
    setView: (view) => {
      set({ view });
      try {
        window.localStorage.setItem(VIEW_STORAGE_KEY, view);
      } catch {}
    },
    ...DEFAULT_FILTERS,
    selectedIds: [],
    detailId: null,
    detailOpen: false,
    profileName: null,
    profileOpen: false,
    newCompanyOpen: false,
    setSortBy: (sortBy) => set({ sortBy }),
    setOwner: (owner) => set({ owner }),
    setStage: (stage) => set({ stage }),
    setActivityWindow: (activityWindow) => set({ activityWindow }),
    setZone: (zone) => set({ zone }),
    setTeam: (team) => set({ team }),
    applyView: (filters) => set({ ...DEFAULT_FILTERS, ...filters, selectedIds: [] }),
    resetFilters: () => set({ ...DEFAULT_FILTERS }),
    toggleSelected: (id) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds.filter((selected) => selected !== id)
          : [...state.selectedIds, id],
      })),
    setSelected: (selectedIds) => set({ selectedIds }),
    openDetail: (detailId) =>
      set({ detailId, detailOpen: true, profileOpen: false }),
    closeDetail: () => set({ detailOpen: false }),
    openProfile: (profileName) =>
      set({ profileName, profileOpen: true, detailOpen: false }),
    closeProfile: () => set({ profileOpen: false }),
    setNewCompanyOpen: (newCompanyOpen) => set({ newCompanyOpen }),

    addCompany: (company) => {
      set((state) => ({
        companies: [company, ...state.companies],
        newCompanyOpen: false,
      }));
      recordEvent({
        action: "criou o cliente",
        target: { module: "Clientes", id: company.id, label: company.name },
        companyId: company.id,
        sensitive: true,
        changes: [
          { field: "Gestor de conta", to: company.owner },
          { field: "Zona", to: company.zone },
        ],
        toast: {
          title: "Cliente criado",
          description: company.name,
          tone: "success",
          action: { label: "Abrir", run: () => get().openDetail(company.id) },
        },
      });
    },

    updateCompany: (id, patch) => {
      const previous = get().companies.find((company) => company.id === id);
      if (!previous) return;
      const next = { ...previous, ...patch };
      const changes = diffRecord(previous, next, COMPANY_LABELS, COMPANY_FORMATTERS);
      if (changes.length === 0) return;
      set((state) => ({
        companies: state.companies.map((company) => (company.id === id ? next : company)),
      }));
      recordEvent({
        action: "atualizou o cliente",
        target: { module: "Clientes", id, label: next.name },
        companyId: id,
        sensitive: true,
        notify: false,
        changes,
        toast: {
          title: "Cliente atualizado",
          description: `${changes.length === 1 ? "1 campo alterado" : `${changes.length} campos alterados`} em ${next.name}.`,
          tone: "success",
          action: {
            label: "Anular",
            run: () => {
              restore([previous]);
              recordEvent({
                action: "anulou a alteração do cliente",
                target: { module: "Clientes", id, label: previous.name },
                companyId: id,
                notify: false,
              });
            },
          },
        },
      });
    },

    updateMany: (ids, patch) => {
      const snapshot = get().companies.filter((company) => ids.includes(company.id));
      const affected = snapshot.filter((company) =>
        (Object.keys(patch) as (keyof typeof patch)[]).some((key) => company[key] !== patch[key]),
      );
      if (affected.length === 0) return;
      set((state) => ({
        companies: state.companies.map((company) =>
          ids.includes(company.id) ? { ...company, ...patch } : company,
        ),
      }));
      const field = patch.owner !== undefined ? "Gestor de conta" : "Zona";
      const value = patch.owner ?? patch.zone ?? "";
      const label = affected.length === 1 ? affected[0].name : `${affected.length} clientes`;
      recordEvent({
        action: patch.owner !== undefined ? "atribuiu um novo gestor a" : "mudou a zona de",
        target: { module: "Clientes", id: affected.length === 1 ? affected[0].id : undefined, label },
        sensitive: true,
        changes: [{ field, to: value }],
        toast: {
          title: `${label} atualizado${affected.length === 1 ? "" : "s"}`,
          description: `${field}: ${value}`,
          tone: "success",
          action: { label: "Anular", run: () => restore(snapshot) },
        },
      });
    },

    archiveCompanies: (ids) => {
      const snapshot = get().companies.filter((company) => ids.includes(company.id) && !company.archived);
      if (snapshot.length === 0) return;
      set((state) => ({
        companies: state.companies.map((company) =>
          ids.includes(company.id) ? { ...company, archived: true } : company,
        ),
        selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        detailOpen: ids.includes(state.detailId ?? "") ? false : state.detailOpen,
      }));
      const label = snapshot.length === 1 ? snapshot[0].name : `${snapshot.length} clientes`;
      recordEvent({
        action: "arquivou",
        target: { module: "Clientes", id: snapshot.length === 1 ? snapshot[0].id : undefined, label },
        sensitive: true,
        toast: {
          title: snapshot.length === 1 ? "Cliente arquivado" : "Clientes arquivados",
          description: `${label} ${snapshot.length === 1 ? "deixou" : "deixaram"} de aparecer na carteira.`,
          action: {
            label: "Anular",
            run: () => {
              restore(snapshot);
              recordEvent({
                action: "repôs",
                target: { module: "Clientes", label },
                notify: false,
              });
            },
          },
        },
      });
    },
  };
});
