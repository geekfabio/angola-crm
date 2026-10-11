import { create } from "zustand";
import { COMPANIES, type Company, type SortKey } from "@/data/companies";
import { DEFAULT_FILTERS } from "@/lib/companies";
import { recordEvent } from "./audit-store";

type CompaniesState = {
  companies: Company[];
  sortBy: SortKey;
  owner: string;
  stage: string;
  activityWindow: number;
  selectedIds: string[];
  detailId: string | null;
  detailOpen: boolean;
  profileName: string | null;
  profileOpen: boolean;
  newCompanyOpen: boolean;
  activeTab: string;
  setSortBy: (sortBy: SortKey) => void;
  setOwner: (owner: string) => void;
  setStage: (stage: string) => void;
  setActivityWindow: (days: number) => void;
  resetFilters: () => void;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  openProfile: (name: string) => void;
  closeProfile: () => void;
  setNewCompanyOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  addCompany: (company: Company) => void;
};

export const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: COMPANIES,
  ...DEFAULT_FILTERS,
  selectedIds: ["microsoft"],
  detailId: null,
  detailOpen: false,
  profileName: null,
  profileOpen: false,
  newCompanyOpen: false,
  activeTab: "companies",
  setSortBy: (sortBy) => set({ sortBy }),
  setOwner: (owner) => set({ owner }),
  setStage: (stage) => set({ stage }),
  setActivityWindow: (activityWindow) => set({ activityWindow }),
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
  setActiveTab: (activeTab) => set({ activeTab }),
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
}));
