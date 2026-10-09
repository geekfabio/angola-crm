export const TICKET_STATUSES = [
  "Aberto",
  "Em Curso",
  "Em Espera",
  "Resolvido",
  "Fechado",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_STATUS_TONES: Record<
  TicketStatus,
  "blue" | "amber" | "purple" | "green" | "neutral"
> = {
  Aberto: "blue",
  "Em Curso": "amber",
  "Em Espera": "purple",
  Resolvido: "green",
  Fechado: "neutral",
};

export const TICKET_PRIORITIES = ["Baixa", "Normal", "Alta", "Urgente"] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_PRIORITY_TONES: Record<
  TicketPriority,
  "neutral" | "blue" | "orange" | "red"
> = {
  Baixa: "neutral",
  Normal: "blue",
  Alta: "orange",
  Urgente: "red",
};

export const TICKET_ORIGINS = ["E-mail", "Telefone", "WhatsApp", "Manual"] as const;

export type TicketOrigin = (typeof TICKET_ORIGINS)[number];

export type TicketComment = {
  id: string;
  author: string;
  authorAvatar: string;
  body: string;
  date: string;
};

export type TicketTimelineEvent = {
  id: string;
  label: string;
  date: string;
  author: string;
};

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  companyId?: string;
  companyName?: string;
  contactName?: string;
  status: TicketStatus;
  priority: TicketPriority;
  origin: TicketOrigin;
  assignee: string;
  assigneeAvatar: string;
  createdAt: string;
  updatedAt: string;
  comments: TicketComment[];
  timeline: TicketTimelineEvent[];
};

const AVATAR = (name: string) =>
  `/assets/images/_common/avatars/avatar-${(name.length % 10) + 1}.png`;

export const TICKETS: Ticket[] = [
  {
    id: "tk-1",
    subject: "Entrega da última encomenda veio incompleta",
    description:
      "Faltaram 3 caixas de óleo alimentar na entrega de ontem. Cliente pede reposição urgente antes do fim de semana.",
    companyId: "boa-esperanca",
    companyName: "Mercearia Boa Esperança",
    contactName: "Fernanda Quitumba",
    status: "Em Curso",
    priority: "Alta",
    origin: "E-mail",
    assignee: "Sara Neto",
    assigneeAvatar: AVATAR("Sara Neto"),
    createdAt: "2026-09-15",
    updatedAt: "2026-09-16",
    comments: [
      {
        id: "c1",
        author: "Sara Neto",
        authorAvatar: AVATAR("Sara Neto"),
        body: "Falei com o armazém, a reposição sai amanhã de manhã.",
        date: "2026-09-16",
      },
    ],
    timeline: [
      { id: "t1", label: "Ticket criado a partir de e-mail", date: "2026-09-15", author: "Fernanda Quitumba" },
      { id: "t2", label: "Estado alterado para Em Curso", date: "2026-09-15", author: "Sara Neto" },
      { id: "t3", label: "Comentário adicionado", date: "2026-09-16", author: "Sara Neto" },
    ],
  },
  {
    id: "tk-2",
    subject: "Pedido de fatura duplicada",
    description: "Cliente perdeu a fatura da encomenda de setembro e precisa de uma segunda via para contabilidade.",
    companyId: "ilha-cabo",
    companyName: "Restaurante Ilha do Cabo",
    contactName: "Manuel Cassoma",
    status: "Resolvido",
    priority: "Baixa",
    origin: "Telefone",
    assignee: "Jaime Teixeira",
    assigneeAvatar: AVATAR("Jaime Teixeira"),
    createdAt: "2026-09-10",
    updatedAt: "2026-09-11",
    comments: [
      {
        id: "c1",
        author: "Jaime Teixeira",
        authorAvatar: AVATAR("Jaime Teixeira"),
        body: "Fatura reenviada por e-mail.",
        date: "2026-09-11",
      },
    ],
    timeline: [
      { id: "t1", label: "Ticket criado", date: "2026-09-10", author: "Jaime Teixeira" },
      { id: "t2", label: "Comentário adicionado", date: "2026-09-11", author: "Jaime Teixeira" },
      { id: "t3", label: "Estado alterado para Resolvido", date: "2026-09-11", author: "Jaime Teixeira" },
    ],
  },
  {
    id: "tk-3",
    subject: "Reclamação: produto fora do prazo de validade",
    description: "Encontraram laticínios próximos do fim do prazo de validade no último lote recebido.",
    companyId: "baia-azul",
    companyName: "Hotel Baía Azul",
    contactName: "Isabel Capinda",
    status: "Aberto",
    priority: "Urgente",
    origin: "E-mail",
    assignee: "Mariana Capitão",
    assigneeAvatar: AVATAR("Mariana Capitão"),
    createdAt: "2026-09-18",
    updatedAt: "2026-09-18",
    comments: [],
    timeline: [
      { id: "t1", label: "Ticket criado a partir de e-mail", date: "2026-09-18", author: "Isabel Capinda" },
    ],
  },
  {
    id: "tk-4",
    subject: "Alteração da janela de entrega",
    description: "Cliente pede para passar a receber entregas sempre de manhã em vez de à tarde.",
    companyId: "nova-vida",
    companyName: "Supermercado Nova Vida",
    contactName: "Pedro Muanza",
    status: "Em Espera",
    priority: "Normal",
    origin: "WhatsApp",
    assignee: "Marcos Domingos",
    assigneeAvatar: AVATAR("Marcos Domingos"),
    createdAt: "2026-09-12",
    updatedAt: "2026-09-14",
    comments: [
      {
        id: "c1",
        author: "Marcos Domingos",
        authorAvatar: AVATAR("Marcos Domingos"),
        body: "A aguardar confirmação da logística sobre a nova rota.",
        date: "2026-09-14",
      },
    ],
    timeline: [
      { id: "t1", label: "Ticket criado", date: "2026-09-12", author: "Marcos Domingos" },
      { id: "t2", label: "Estado alterado para Em Espera", date: "2026-09-14", author: "Marcos Domingos" },
      { id: "t3", label: "Comentário adicionado", date: "2026-09-14", author: "Marcos Domingos" },
    ],
  },
  {
    id: "tk-5",
    subject: "Dúvida sobre condições de pagamento",
    description: "Cliente novo pergunta se há desconto para pagamento a pronto.",
    companyId: "tchissola",
    companyName: "Padaria Tchissola",
    contactName: "Joana Capemba",
    status: "Fechado",
    priority: "Baixa",
    origin: "Manual",
    assignee: "Alexandre Santos",
    assigneeAvatar: AVATAR("Alexandre Santos"),
    createdAt: "2026-09-02",
    updatedAt: "2026-09-03",
    comments: [
      {
        id: "c1",
        author: "Alexandre Santos",
        authorAvatar: AVATAR("Alexandre Santos"),
        body: "Expliquei as condições por telefone, cliente satisfeito.",
        date: "2026-09-03",
      },
    ],
    timeline: [
      { id: "t1", label: "Ticket criado", date: "2026-09-02", author: "Alexandre Santos" },
      { id: "t2", label: "Comentário adicionado", date: "2026-09-03", author: "Alexandre Santos" },
      { id: "t3", label: "Estado alterado para Fechado", date: "2026-09-03", author: "Alexandre Santos" },
    ],
  },
  {
    id: "tk-6",
    subject: "Pedido de catálogo de produtos institucionais",
    description: "Instituto pede o catálogo completo de produtos para grandes volumes.",
    companyId: "lobito",
    companyName: "Instituto Técnico do Lobito",
    contactName: "Olívio Chico",
    status: "Em Curso",
    priority: "Normal",
    origin: "E-mail",
    assignee: "Olívio Chico",
    assigneeAvatar: AVATAR("Olívio Chico"),
    createdAt: "2026-09-17",
    updatedAt: "2026-09-17",
    comments: [],
    timeline: [
      { id: "t1", label: "Ticket criado a partir de e-mail", date: "2026-09-17", author: "Olívio Chico" },
      { id: "t2", label: "Estado alterado para Em Curso", date: "2026-09-17", author: "Olívio Chico" },
    ],
  },
  {
    id: "tk-7",
    subject: "Avaria no equipamento de refrigeração emprestado",
    description: "A arca frigorífica cedida pela Alimenta Angola deixou de arrefecer corretamente.",
    companyId: "marisqueira-ilha",
    companyName: "Marisqueira da Ilha",
    contactName: "Agostinho Zola",
    status: "Aberto",
    priority: "Alta",
    origin: "Telefone",
    assignee: "Avelina Brito",
    assigneeAvatar: AVATAR("Avelina Brito"),
    createdAt: "2026-09-19",
    updatedAt: "2026-09-19",
    comments: [],
    timeline: [
      { id: "t1", label: "Ticket criado", date: "2026-09-19", author: "Avelina Brito" },
    ],
  },
  {
    id: "tk-8",
    subject: "Pedido de visita comercial para expansão",
    description: "Cliente quer discutir o alargamento do catálogo de bebidas para a nova loja.",
    companyId: "sao-paulo",
    companyName: "Mercearia São Paulo",
    contactName: "Teresa Mbala",
    status: "Resolvido",
    priority: "Normal",
    origin: "WhatsApp",
    assignee: "Graça Miguel",
    assigneeAvatar: AVATAR("Graça Miguel"),
    createdAt: "2026-09-08",
    updatedAt: "2026-09-13",
    comments: [
      {
        id: "c1",
        author: "Graça Miguel",
        authorAvatar: AVATAR("Graça Miguel"),
        body: "Visita agendada e realizada, proposta enviada em Oportunidades.",
        date: "2026-09-13",
      },
    ],
    timeline: [
      { id: "t1", label: "Ticket criado", date: "2026-09-08", author: "Graça Miguel" },
      { id: "t2", label: "Comentário adicionado", date: "2026-09-13", author: "Graça Miguel" },
      { id: "t3", label: "Estado alterado para Resolvido", date: "2026-09-13", author: "Graça Miguel" },
    ],
  },
];
