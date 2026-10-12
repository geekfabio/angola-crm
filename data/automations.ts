import { STAGES, type Stage } from "./companies";
import { OPPORTUNITY_STAGES, type OpportunityStage } from "./opportunities";

export const AUTOMATION_STATUSES = ["Ativa", "Pausada", "Rascunho"] as const;

export type AutomationStatus = (typeof AUTOMATION_STATUSES)[number];

export const AUTOMATION_STATUS_TONES: Record<
  AutomationStatus,
  "green" | "amber" | "neutral"
> = {
  Ativa: "green",
  Pausada: "amber",
  Rascunho: "neutral",
};

export const TRIGGER_TYPES = [
  "cliente-criado",
  "fase-alterada",
  "oportunidade-ganha",
  "oportunidade-perdida",
  "dias-sem-comprar",
  "aniversario",
  "divida-vencida",
  "campanha-aberta",
] as const;

export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  "cliente-criado": "Cliente criado",
  "fase-alterada": "Oportunidade muda de fase",
  "oportunidade-ganha": "Oportunidade ganha",
  "oportunidade-perdida": "Oportunidade perdida",
  "dias-sem-comprar": "N dias sem comprar",
  aniversario: "Aniversário do cliente",
  "divida-vencida": "Dívida vencida",
  "campanha-aberta": "Campanha aberta ou clicada",
};

export const CAMPAIGN_ENGAGEMENTS = ["Aberto", "Clicou"] as const;

export type CampaignEngagement = (typeof CAMPAIGN_ENGAGEMENTS)[number];

export type Trigger = {
  type: TriggerType;
  days: number;
  stage: OpportunityStage;
  engagement: CampaignEngagement;
};

export const DEFAULT_TRIGGER: Trigger = {
  type: "dias-sem-comprar",
  days: 30,
  stage: OPPORTUNITY_STAGES[1],
  engagement: "Clicou",
};

export const ACTION_TYPES = [
  "enviar-email",
  "enviar-sms",
  "criar-tarefa",
  "mudar-fase",
  "notificar-gestor",
  "adicionar-segmento",
  "propor-desconto",
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export const ACTION_LABELS: Record<ActionType, string> = {
  "enviar-email": "Enviar e-mail",
  "enviar-sms": "Enviar SMS",
  "criar-tarefa": "Criar tarefa",
  "mudar-fase": "Mudar fase do cliente",
  "notificar-gestor": "Notificar gestor",
  "adicionar-segmento": "Adicionar a segmento",
  "propor-desconto": "Propor desconto",
};

export const DISCOUNT_SCOPES = ["Categorias habituais", "Toda a encomenda"] as const;

export type DiscountScope = (typeof DISCOUNT_SCOPES)[number];

export const MAX_DISCOUNT_PERCENT = 30;

export const MESSAGE_ACTIONS: ActionType[] = ["enviar-email", "enviar-sms"];

export type AutomationStep = {
  id: string;
  waitDays: number;
  action: ActionType;
  emailTemplateId: string;
  smsTemplateId: string;
  taskTitle: string;
  stage: Stage;
  message: string;
  segmentName: string;
  discountPercent: number;
  discountValidDays: number;
  discountScope: DiscountScope;
};

export type AutomationConditions = {
  zone: string;
  segment: string;
  abc: string;
};

export type Automation = {
  id: string;
  name: string;
  status: AutomationStatus;
  trigger: Trigger;
  conditions: AutomationConditions;
  steps: AutomationStep[];
  enrolled: number;
  completed: number;
  lastRunAt?: string;
  activatedAt?: string;
  updatedAt: string;
};

export const ANY_CONDITION = "all";

export const DEFAULT_CONDITIONS: AutomationConditions = {
  zone: ANY_CONDITION,
  segment: ANY_CONDITION,
  abc: ANY_CONDITION,
};

export function blankStep(id: string, action: ActionType = "enviar-sms"): AutomationStep {
  return {
    id,
    waitDays: 0,
    action,
    emailTemplateId: "promocao-semanal",
    smsTemplateId: "sms-promocao",
    taskTitle: "Ligar ao cliente",
    stage: STAGES[STAGES.length - 1],
    message: "",
    segmentName: "",
    discountPercent: 5,
    discountValidDays: 15,
    discountScope: "Categorias habituais",
  };
}

function step(
  id: string,
  action: ActionType,
  patch: Partial<AutomationStep> = {},
): AutomationStep {
  return { ...blankStep(id, action), ...patch };
}

export const AUTOMATIONS: Automation[] = [
  {
    id: "aut-1",
    name: "Boas-vindas a novos clientes",
    status: "Ativa",
    trigger: { ...DEFAULT_TRIGGER, type: "cliente-criado" },
    conditions: { ...DEFAULT_CONDITIONS },
    steps: [
      step("aut-1-s1", "enviar-email", { emailTemplateId: "boas-vindas" }),
      step("aut-1-s2", "criar-tarefa", {
        waitDays: 3,
        taskTitle: "Ligar para confirmar a primeira encomenda",
      }),
      step("aut-1-s3", "enviar-sms", { waitDays: 7, smsTemplateId: "sms-entrega" }),
    ],
    enrolled: 38,
    completed: 31,
    lastRunAt: "2026-10-10T09:00",
    activatedAt: "2026-09-15",
    updatedAt: "2026-09-15",
  },
  {
    id: "aut-2",
    name: "Reativação de cliente inativo",
    status: "Ativa",
    trigger: { ...DEFAULT_TRIGGER, type: "dias-sem-comprar", days: 60 },
    conditions: { ...DEFAULT_CONDITIONS },
    steps: [
      step("aut-2-s1", "enviar-sms", { smsTemplateId: "sms-promocao" }),
      step("aut-2-s2", "enviar-email", { waitDays: 7, emailTemplateId: "promocao-semanal" }),
      step("aut-2-s3", "mudar-fase", { waitDays: 7, stage: "Reactivação" }),
      step("aut-2-s4", "notificar-gestor", {
        message: "Cliente sem compras há mais de 60 dias — agendar visita.",
      }),
    ],
    enrolled: 12,
    completed: 4,
    lastRunAt: "2026-10-11T08:00",
    activatedAt: "2026-10-05",
    updatedAt: "2026-10-02",
  },
  {
    id: "aut-5",
    name: "Desconto para clientes sem compras",
    status: "Ativa",
    trigger: { ...DEFAULT_TRIGGER, type: "dias-sem-comprar", days: 30 },
    conditions: { ...DEFAULT_CONDITIONS },
    steps: [
      step("aut-5-s1", "propor-desconto", { discountPercent: 5, discountValidDays: 14 }),
      step("aut-5-s2", "enviar-sms", { waitDays: 1, smsTemplateId: "sms-desconto" }),
      step("aut-5-s3", "propor-desconto", {
        waitDays: 14,
        discountPercent: 10,
        discountValidDays: 14,
      }),
      step("aut-5-s4", "notificar-gestor", {
        waitDays: 14,
        message: "Não aproveitou as propostas de desconto — agendar visita.",
      }),
    ],
    enrolled: 0,
    completed: 0,
    activatedAt: "2026-10-10",
    updatedAt: "2026-10-10",
  },
  {
    id: "aut-3",
    name: "Seguimento de proposta sem resposta",
    status: "Pausada",
    trigger: { ...DEFAULT_TRIGGER, type: "fase-alterada", stage: "Proposta" },
    conditions: { ...DEFAULT_CONDITIONS },
    steps: [
      step("aut-3-s1", "criar-tarefa", {
        waitDays: 5,
        taskTitle: "Seguimento da proposta enviada",
      }),
      step("aut-3-s2", "notificar-gestor", {
        waitDays: 5,
        message: "Proposta sem resposta há 10 dias.",
      }),
    ],
    enrolled: 9,
    completed: 6,
    lastRunAt: "2026-10-04T10:00",
    updatedAt: "2026-10-04",
  },
  {
    id: "aut-4",
    name: "Aniversário do cliente",
    status: "Rascunho",
    trigger: { ...DEFAULT_TRIGGER, type: "aniversario" },
    conditions: { ...DEFAULT_CONDITIONS, abc: "A" },
    steps: [step("aut-4-s1", "enviar-email", { emailTemplateId: "aniversario" })],
    enrolled: 0,
    completed: 0,
    updatedAt: "2026-10-09",
  },
];

export const DEFAULT_WEEKLY_CAP = 2;
