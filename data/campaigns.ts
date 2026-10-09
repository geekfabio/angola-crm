export type Channel = "Email" | "SMS";
export type CampaignStatus = "Rascunho" | "Agendada" | "Enviada";

export const CHANNEL_TONES: Record<Channel, "blue" | "purple"> = {
  Email: "blue",
  SMS: "purple",
};

export const STATUS_TONES: Record<CampaignStatus, "neutral" | "amber" | "green"> = {
  Rascunho: "neutral",
  Agendada: "amber",
  Enviada: "green",
};

export type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  recipients: number;
  openRate?: number;
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "cmp-1",
    name: "Promoção semanal — mercearia",
    channel: "Email",
    status: "Enviada",
    recipients: 486,
    openRate: 42,
  },
  {
    id: "cmp-2",
    name: "Lista de preços — outubro",
    channel: "Email",
    status: "Enviada",
    recipients: 512,
    openRate: 38,
  },
  {
    id: "cmp-3",
    name: "Aviso de rutura — óleo alimentar",
    channel: "SMS",
    status: "Enviada",
    recipients: 310,
  },
  {
    id: "cmp-4",
    name: "Boas-vindas — novos clientes HORECA",
    channel: "Email",
    status: "Agendada",
    recipients: 64,
  },
  {
    id: "cmp-5",
    name: "Lembrete de pagamento — contas em atraso",
    channel: "SMS",
    status: "Agendada",
    recipients: 128,
  },
  {
    id: "cmp-6",
    name: "Novo produto — massas importadas",
    channel: "Email",
    status: "Rascunho",
    recipients: 0,
  },
];
