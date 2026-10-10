export type Channel = "Email" | "SMS";

export const CAMPAIGN_STATUSES = [
  "Rascunho",
  "Em revisão",
  "Agendada",
  "Enviada",
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const CHANNEL_LABELS: Record<Channel, string> = {
  Email: "E-mail",
  SMS: "SMS",
};

export const CHANNEL_TONES: Record<Channel, "blue" | "purple"> = {
  Email: "blue",
  SMS: "purple",
};

export const STATUS_TONES: Record<
  CampaignStatus,
  "neutral" | "blue" | "amber" | "green"
> = {
  Rascunho: "neutral",
  "Em revisão": "blue",
  Agendada: "amber",
  Enviada: "green",
};

export const BRAND_LOGO = "/assets/images/_common/brand/alimenta-angola-logo.png";

export const SENDER = "Alimenta Angola <promocoes@alimentaangola.co.ao>";

export const SANDBOX_ADDRESS = "teste@alimentaangola.co.ao";

export type BlockType =
  | "heading"
  | "text"
  | "banner"
  | "image"
  | "button"
  | "divider";

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Título",
  text: "Texto",
  banner: "Destaque",
  image: "Imagem",
  button: "Botão",
  divider: "Separador",
};

export type BannerTone = "brand" | "accent";

export const BANNER_TONE_LABELS: Record<BannerTone, string> = {
  brand: "Vermelho",
  accent: "Amarelo",
};

export type CampaignBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "text"; text: string }
  | {
      id: string;
      type: "banner";
      title: string;
      subtitle: string;
      tone: BannerTone;
    }
  | { id: string; type: "image"; src: string; alt: string }
  | { id: string; type: "button"; label: string; href: string }
  | { id: string; type: "divider" };

export type BlockDraft = CampaignBlock extends infer Block
  ? Block extends CampaignBlock
    ? Omit<Block, "id">
    : never
  : never;

export const VARIABLES = [
  { key: "nome", label: "Nome do contacto", fallback: "Cliente" },
  { key: "empresa", label: "Empresa", fallback: "a sua empresa" },
  { key: "gestor", label: "Gestor de conta", fallback: "a equipa comercial" },
  { key: "zona", label: "Zona", fallback: "Luanda" },
  { key: "saldo", label: "Saldo em conta", fallback: "consulte o seu gestor" },
] as const;

export type VariableKey = (typeof VARIABLES)[number]["key"];

export type Fallbacks = Record<VariableKey, string>;

export const DEFAULT_FALLBACKS = Object.fromEntries(
  VARIABLES.map((variable) => [variable.key, variable.fallback]),
) as Fallbacks;

export const ANY = "all";

export const ABC_CLASSES = ["A", "B", "C"] as const;

export type AbcClass = (typeof ABC_CLASSES)[number];

export type AudienceFilters = {
  zone: string;
  segment: string;
  abc: string;
  inactiveDays: string;
};

export const DEFAULT_AUDIENCE: AudienceFilters = {
  zone: ANY,
  segment: ANY,
  abc: ANY,
  inactiveDays: ANY,
};

export type CampaignTemplate = {
  id: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  blocks: BlockDraft[];
};

export const TEMPLATES: CampaignTemplate[] = [
  {
    id: "promocao-semanal",
    name: "Promoção semanal",
    description: "Destaque de preços da semana em mercearia e bebidas.",
    subject: "{{nome}}, as promoções desta semana já chegaram",
    preheader: "Até 15% de desconto em mercearia e bebidas.",
    blocks: [
      {
        type: "banner",
        title: "Promoção da semana",
        subtitle: "Até -15% em mercearia e bebidas",
        tone: "accent",
      },
      { type: "heading", text: "Olá, {{nome}}" },
      {
        type: "text",
        text: "Esta semana preparámos condições especiais para {{empresa}}. Os preços são válidos até domingo ou enquanto houver stock no armazém.",
      },
      { type: "button", label: "Ver promoções", href: "https://alimentaangola.co.ao/promocoes" },
      {
        type: "text",
        text: "Qualquer dúvida, fale com {{gestor}}.",
      },
    ],
  },
  {
    id: "lista-precos",
    name: "Lista de preços",
    description: "Envio mensal da tabela de preços atualizada.",
    subject: "Nova lista de preços para {{empresa}}",
    preheader: "Preços atualizados para o próximo mês.",
    blocks: [
      {
        type: "banner",
        title: "Nova lista de preços",
        subtitle: "Válida a partir do próximo mês",
        tone: "accent",
      },
      { type: "heading", text: "Olá, {{nome}}" },
      {
        type: "text",
        text: "A nova tabela de preços para {{empresa}} já está disponível.\nSaldo atual da sua conta: {{saldo}}.",
      },
      { type: "button", label: "Consultar lista de preços", href: "https://alimentaangola.co.ao/precos" },
    ],
  },
  {
    id: "novo-produto",
    name: "Novo produto",
    description: "Anúncio de uma referência nova no catálogo.",
    subject: "Novidade no catálogo Alimenta Angola",
    preheader: "Uma nova referência já disponível no armazém.",
    blocks: [
      {
        type: "banner",
        title: "Novidade",
        subtitle: "Massas importadas já disponíveis",
        tone: "brand",
      },
      {
        type: "text",
        text: "{{nome}}, acabámos de receber uma nova gama de massas importadas, com entrega em {{zona}} a partir desta semana.",
      },
      { type: "button", label: "Encomendar", href: "https://alimentaangola.co.ao/novidades" },
    ],
  },
  {
    id: "aviso-rutura",
    name: "Aviso de rutura",
    description: "Comunicação de falta de stock e alternativas.",
    subject: "Aviso: rutura temporária de stock",
    preheader: "Alternativas disponíveis até à reposição.",
    blocks: [
      {
        type: "banner",
        title: "Aviso de rutura",
        subtitle: "Óleo alimentar 5 L temporariamente indisponível",
        tone: "brand",
      },
      {
        type: "text",
        text: "Informamos que o óleo alimentar de 5 L está sem stock em {{zona}}. Prevemos a reposição na próxima semana.",
      },
      { type: "divider" },
      {
        type: "text",
        text: "Até lá, {{gestor}} pode propor alternativas equivalentes para {{empresa}}.",
      },
      { type: "button", label: "Falar com o gestor", href: "https://alimentaangola.co.ao/contacto" },
    ],
  },
  {
    id: "boas-vindas",
    name: "Boas-vindas",
    description: "Primeiro contacto com um cliente novo.",
    subject: "Bem-vindo à Alimenta Angola, {{nome}}",
    preheader: "Conheça o catálogo e o seu gestor de conta.",
    blocks: [
      {
        type: "banner",
        title: "Bem-vindo!",
        subtitle: "Preços de grossista para o seu negócio",
        tone: "brand",
      },
      { type: "heading", text: "Olá, {{nome}}" },
      {
        type: "text",
        text: "Obrigado por escolher a Alimenta Angola. A partir de hoje, {{empresa}} conta com preços de grossista e entregas em {{zona}}.",
      },
      { type: "button", label: "Conhecer o catálogo", href: "https://alimentaangola.co.ao/catalogo" },
      { type: "divider" },
      {
        type: "text",
        text: "Qualquer dúvida, fale com {{gestor}}.",
      },
    ],
  },
  {
    id: "aniversario",
    name: "Aniversário do cliente",
    description: "Celebração do aniversário da relação comercial.",
    subject: "{{nome}}, parabéns por mais um ano connosco",
    preheader: "Uma oferta especial para celebrar consigo.",
    blocks: [
      {
        type: "banner",
        title: "Parabéns!",
        subtitle: "Mais um ano a crescer juntos",
        tone: "accent",
      },
      {
        type: "text",
        text: "{{nome}}, obrigado por mais um ano de confiança. Para celebrar, a próxima encomenda tem uma oferta especial.",
      },
      { type: "button", label: "Ver oferta", href: "https://alimentaangola.co.ao/oferta" },
    ],
  },
];

export const BLANK_TEMPLATE: CampaignTemplate = {
  id: "em-branco",
  name: "Em branco",
  description: "Começar só com um título e um texto.",
  subject: "",
  preheader: "",
  blocks: [
    { type: "heading", text: "Olá, {{nome}}" },
    { type: "text", text: "" },
  ],
};

export type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  templateId?: string;
  subject: string;
  preheader: string;
  blocks: CampaignBlock[];
  fallbacks: Fallbacks;
  audience: AudienceFilters;
  testSentAt?: string;
  scheduledAt?: string;
  recipients: number;
  openRate?: number;
  updatedAt: string;
};

export function blocksFromTemplate(
  template: CampaignTemplate,
  prefix: string,
): CampaignBlock[] {
  return template.blocks.map(
    (block, index) => ({ ...block, id: `${prefix}-${index}` }) as CampaignBlock,
  );
}

function templateById(id: string) {
  return TEMPLATES.find((template) => template.id === id)!;
}

function seeded(
  id: string,
  templateId: string,
  rest: Omit<
    Campaign,
    "id" | "templateId" | "subject" | "preheader" | "blocks" | "fallbacks"
  >,
): Campaign {
  const template = templateById(templateId);
  return {
    id,
    templateId,
    subject: template.subject,
    preheader: template.preheader,
    blocks: blocksFromTemplate(template, id),
    fallbacks: { ...DEFAULT_FALLBACKS },
    ...rest,
  };
}

export const CAMPAIGNS: Campaign[] = [
  seeded("cmp-1", "promocao-semanal", {
    name: "Promoção semanal — mercearia",
    channel: "Email",
    status: "Enviada",
    audience: { ...DEFAULT_AUDIENCE, segment: "Grossista" },
    recipients: 486,
    openRate: 42,
    updatedAt: "2026-09-29",
  }),
  seeded("cmp-2", "lista-precos", {
    name: "Lista de preços — outubro",
    channel: "Email",
    status: "Enviada",
    audience: { ...DEFAULT_AUDIENCE },
    recipients: 512,
    openRate: 38,
    updatedAt: "2026-10-01",
  }),
  {
    id: "cmp-3",
    name: "Aviso de rutura — óleo alimentar",
    channel: "SMS",
    status: "Enviada",
    subject: "",
    preheader: "",
    blocks: [],
    fallbacks: { ...DEFAULT_FALLBACKS },
    audience: { ...DEFAULT_AUDIENCE },
    recipients: 310,
    updatedAt: "2026-10-03",
  },
  seeded("cmp-4", "boas-vindas", {
    name: "Boas-vindas — novos clientes HORECA",
    channel: "Email",
    status: "Agendada",
    audience: { ...DEFAULT_AUDIENCE, segment: "HORECA" },
    testSentAt: "2026-10-08T16:20",
    scheduledAt: "2026-10-14T09:00",
    recipients: 64,
    updatedAt: "2026-10-08",
  }),
  {
    id: "cmp-5",
    name: "Lembrete de pagamento — contas em atraso",
    channel: "SMS",
    status: "Agendada",
    subject: "",
    preheader: "",
    blocks: [],
    fallbacks: { ...DEFAULT_FALLBACKS },
    audience: { ...DEFAULT_AUDIENCE },
    scheduledAt: "2026-10-12T10:00",
    recipients: 128,
    updatedAt: "2026-10-07",
  },
  seeded("cmp-6", "novo-produto", {
    name: "Novo produto — massas importadas",
    channel: "Email",
    status: "Rascunho",
    audience: { ...DEFAULT_AUDIENCE, zone: "Luanda" },
    recipients: 0,
    updatedAt: "2026-10-09",
  }),
];
