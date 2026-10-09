import { create } from "zustand";
import {
  CONTACTS,
  type Contact,
  type ConsentChannel,
  type ContactabilityStatus,
} from "@/data/contacts";
import { DEFAULT_FILTERS } from "@/lib/contacts";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export type MergeFieldKey = "role" | "phone" | "whatsapp" | "email";

export type MergeChoices = Record<MergeFieldKey, "primary" | "secondary">;

const DEFAULT_MERGE_CHOICES: MergeChoices = {
  role: "primary",
  phone: "primary",
  whatsapp: "primary",
  email: "primary",
};

type ContactsState = {
  contacts: Contact[];
  companyId: string;
  contactability: string;
  search: string;
  detailId: string | null;
  detailOpen: boolean;
  newContactOpen: boolean;
  mergeOpen: boolean;
  mergePrimaryId: string | null;
  mergeSecondaryId: string | null;
  mergeChoices: MergeChoices;
  setCompanyId: (companyId: string) => void;
  setContactability: (contactability: string) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  setNewContactOpen: (open: boolean) => void;
  addContact: (contact: Contact) => void;
  updateContactability: (id: string, status: ContactabilityStatus) => void;
  toggleConsent: (id: string, channel: ConsentChannel) => void;
  setMergeOpen: (open: boolean) => void;
  setMergePrimaryId: (id: string | null) => void;
  setMergeSecondaryId: (id: string | null) => void;
  setMergeChoice: (field: MergeFieldKey, winner: "primary" | "secondary") => void;
  confirmMerge: () => void;
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: CONTACTS,
  ...DEFAULT_FILTERS,
  detailId: null,
  detailOpen: false,
  newContactOpen: false,
  mergeOpen: false,
  mergePrimaryId: null,
  mergeSecondaryId: null,
  mergeChoices: DEFAULT_MERGE_CHOICES,

  setCompanyId: (companyId) => set({ companyId }),
  setContactability: (contactability) => set({ contactability }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),

  openDetail: (detailId) => set({ detailId, detailOpen: true }),
  closeDetail: () => set({ detailOpen: false }),
  setNewContactOpen: (newContactOpen) => set({ newContactOpen }),

  addContact: (contact) =>
    set((state) => ({
      contacts: [contact, ...state.contacts],
      newContactOpen: false,
    })),

  updateContactability: (id, status) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, contactability: status } : contact,
      ),
    })),

  toggleConsent: (id, channel) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              consent: {
                ...contact.consent,
                [channel]: {
                  granted: !contact.consent[channel].granted,
                  date: today(),
                  origin: "Atualizado manualmente",
                },
              },
            }
          : contact,
      ),
    })),

  setMergeOpen: (mergeOpen) =>
    set({
      mergeOpen,
      ...(mergeOpen
        ? {}
        : {
            mergePrimaryId: null,
            mergeSecondaryId: null,
            mergeChoices: DEFAULT_MERGE_CHOICES,
          }),
    }),
  setMergePrimaryId: (mergePrimaryId) => set({ mergePrimaryId }),
  setMergeSecondaryId: (mergeSecondaryId) => set({ mergeSecondaryId }),
  setMergeChoice: (field, winner) =>
    set((state) => ({
      mergeChoices: { ...state.mergeChoices, [field]: winner },
    })),

  confirmMerge: () => {
    const { contacts, mergePrimaryId, mergeSecondaryId, mergeChoices } = get();
    const primary = contacts.find((item) => item.id === mergePrimaryId);
    const secondary = contacts.find((item) => item.id === mergeSecondaryId);
    if (!primary || !secondary) return;

    const merged: Contact = {
      ...primary,
      role: mergeChoices.role === "secondary" ? secondary.role : primary.role,
      phone: mergeChoices.phone === "secondary" ? secondary.phone : primary.phone,
      whatsapp:
        mergeChoices.whatsapp === "secondary"
          ? secondary.whatsapp
          : primary.whatsapp,
      email: mergeChoices.email === "secondary" ? secondary.email : primary.email,
      consent: {
        email: primary.consent.email.granted
          ? primary.consent.email
          : secondary.consent.email,
        sms: primary.consent.sms.granted
          ? primary.consent.sms
          : secondary.consent.sms,
        whatsapp: primary.consent.whatsapp.granted
          ? primary.consent.whatsapp
          : secondary.consent.whatsapp,
      },
    };

    set((state) => ({
      contacts: state.contacts
        .map((item) => (item.id === primary.id ? merged : item))
        .filter((item) => item.id !== secondary.id),
      mergeOpen: false,
      mergePrimaryId: null,
      mergeSecondaryId: null,
      mergeChoices: DEFAULT_MERGE_CHOICES,
    }));
  },
}));
