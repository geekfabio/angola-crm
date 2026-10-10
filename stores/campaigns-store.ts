import { create } from "zustand";
import {
  BLANK_TEMPLATE,
  CAMPAIGNS,
  DEFAULT_AUDIENCE,
  DEFAULT_FALLBACKS,
  TEMPLATES,
  blocksFromTemplate,
  type AudienceFilters,
  type BlockType,
  type Campaign,
  type CampaignBlock,
  type VariableKey,
} from "@/data/campaigns";
import { DEFAULT_CAMPAIGN_FILTERS, createBlock } from "@/lib/campaigns";

export type EditorStep = "conteudo" | "destinatarios" | "revisao";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function luandaNow() {
  return new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
}

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

type CampaignsState = {
  campaigns: Campaign[];
  channel: string;
  status: string;
  search: string;
  editorId: string | null;
  editorStep: EditorStep;
  libraryOpen: boolean;
  setChannel: (channel: string) => void;
  setStatus: (status: string) => void;
  setSearch: (search: string) => void;
  setLibraryOpen: (open: boolean) => void;
  openEditor: (id: string) => void;
  closeEditor: () => void;
  setEditorStep: (step: EditorStep) => void;
  createFromTemplate: (templateId: string) => void;
  updateDetails: (
    id: string,
    patch: Partial<Pick<Campaign, "name" | "subject" | "preheader">>,
  ) => void;
  addBlock: (id: string, type: BlockType) => void;
  updateBlock: (id: string, block: CampaignBlock) => void;
  removeBlock: (id: string, blockId: string) => void;
  moveBlock: (id: string, blockId: string, delta: number) => void;
  setFallback: (id: string, key: VariableKey, value: string) => void;
  setAudience: (id: string, patch: Partial<AudienceFilters>) => void;
  submitForReview: (id: string) => void;
  backToDraft: (id: string) => void;
  recordTest: (id: string) => void;
  schedule: (id: string, scheduledAt: string, recipients: number) => void;
  cancelSchedule: (id: string) => void;
};

export const useCampaignsStore = create<CampaignsState>((set) => {
  function patch(id: string, fn: (campaign: Campaign) => Partial<Campaign>) {
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id
          ? { ...campaign, ...fn(campaign), updatedAt: today() }
          : campaign,
      ),
    }));
  }

  function editBlocks(
    id: string,
    fn: (blocks: CampaignBlock[]) => CampaignBlock[],
  ) {
    patch(id, (campaign) =>
      campaign.status === "Rascunho" ? { blocks: fn(campaign.blocks) } : {},
    );
  }

  return {
    campaigns: CAMPAIGNS,
    ...DEFAULT_CAMPAIGN_FILTERS,
    editorId: null,
    editorStep: "conteudo",
    libraryOpen: false,

    setChannel: (channel) => set({ channel }),
    setStatus: (status) => set({ status }),
    setSearch: (search) => set({ search }),
    setLibraryOpen: (libraryOpen) => set({ libraryOpen }),
    openEditor: (editorId) => set({ editorId, editorStep: "conteudo" }),
    closeEditor: () => set({ editorId: null }),
    setEditorStep: (editorStep) => set({ editorStep }),

    createFromTemplate: (templateId) => {
      const template =
        TEMPLATES.find((item) => item.id === templateId) ?? BLANK_TEMPLATE;
      const id = newId("cmp");
      const campaign: Campaign = {
        id,
        name: template.id === BLANK_TEMPLATE.id ? "Nova campanha" : template.name,
        channel: "Email",
        status: "Rascunho",
        templateId: template.id,
        subject: template.subject,
        preheader: template.preheader,
        blocks: blocksFromTemplate(template, id),
        fallbacks: { ...DEFAULT_FALLBACKS },
        audience: { ...DEFAULT_AUDIENCE },
        recipients: 0,
        updatedAt: today(),
      };
      set((state) => ({
        campaigns: [campaign, ...state.campaigns],
        libraryOpen: false,
        editorId: id,
        editorStep: "conteudo",
      }));
    },

    updateDetails: (id, details) =>
      patch(id, (campaign) => (campaign.status === "Rascunho" ? details : {})),

    addBlock: (id, type) =>
      editBlocks(id, (blocks) => [...blocks, createBlock(type, newId(type))]),
    updateBlock: (id, block) =>
      editBlocks(id, (blocks) =>
        blocks.map((item) => (item.id === block.id ? block : item)),
      ),
    removeBlock: (id, blockId) =>
      editBlocks(id, (blocks) => blocks.filter((item) => item.id !== blockId)),
    moveBlock: (id, blockId, delta) =>
      editBlocks(id, (blocks) => {
        const index = blocks.findIndex((item) => item.id === blockId);
        const target = index + delta;
        if (index < 0 || target < 0 || target >= blocks.length) return blocks;
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      }),

    setFallback: (id, key, value) =>
      patch(id, (campaign) =>
        campaign.status === "Rascunho"
          ? { fallbacks: { ...campaign.fallbacks, [key]: value } }
          : {},
      ),
    setAudience: (id, audience) =>
      patch(id, (campaign) =>
        campaign.status === "Rascunho"
          ? { audience: { ...campaign.audience, ...audience } }
          : {},
      ),

    submitForReview: (id) =>
      patch(id, (campaign) =>
        campaign.status === "Rascunho" ? { status: "Em revisão" } : {},
      ),
    backToDraft: (id) =>
      patch(id, (campaign) =>
        campaign.status === "Em revisão"
          ? { status: "Rascunho", testSentAt: undefined }
          : {},
      ),
    recordTest: (id) =>
      patch(id, (campaign) =>
        campaign.status === "Em revisão" ? { testSentAt: luandaNow() } : {},
      ),
    schedule: (id, scheduledAt, recipients) =>
      patch(id, (campaign) =>
        campaign.status === "Em revisão" && campaign.testSentAt
          ? { status: "Agendada", scheduledAt, recipients }
          : {},
      ),
    cancelSchedule: (id) =>
      patch(id, (campaign) =>
        campaign.status === "Agendada"
          ? { status: "Em revisão", scheduledAt: undefined }
          : {},
      ),
  };
});
