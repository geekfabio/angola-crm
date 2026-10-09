export type ActivityType =
  | "Visita"
  | "Chamada"
  | "E-mail"
  | "Reunião"
  | "Entrega"
  | "Reclamação";

export const ACTIVITY_TONES: Record<
  ActivityType,
  "blue" | "purple" | "green" | "amber" | "teal" | "red"
> = {
  Visita: "blue",
  Chamada: "purple",
  "E-mail": "teal",
  Reunião: "amber",
  Entrega: "green",
  Reclamação: "red",
};

export type Activity = {
  id: string;
  type: ActivityType;
  companyName: string;
  owner: string;
  date: string;
  note: string;
};

export const ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "Visita",
    companyName: "Mercearia Boa Esperança",
    owner: "Sara Neto",
    date: "2026-10-06",
    note: "Visita de rotina, confirmado reabastecimento de bebidas.",
  },
  {
    id: "act-2",
    type: "Chamada",
    companyName: "Restaurante Ilha do Cabo",
    owner: "Jaime Teixeira",
    date: "2026-10-05",
    note: "Negociação de condições de pagamento para o próximo trimestre.",
  },
  {
    id: "act-3",
    type: "Entrega",
    companyName: "Hotel Baía Azul",
    owner: "Mariana Capitão",
    date: "2026-10-04",
    note: "Entrega de encomenda mensal de mercearia e bebidas.",
  },
  {
    id: "act-4",
    type: "Reclamação",
    companyName: "Supermercado Nova Vida",
    owner: "Marcos Domingos",
    date: "2026-10-03",
    note: "Produto danificado na última entrega; crédito emitido.",
  },
  {
    id: "act-5",
    type: "E-mail",
    companyName: "Padaria Tchissola",
    owner: "Alexandre Santos",
    date: "2026-10-02",
    note: "Envio da lista de preços atualizada para outubro.",
  },
  {
    id: "act-6",
    type: "Reunião",
    companyName: "Mercearia Kilamba",
    owner: "Lina Wamba",
    date: "2026-10-01",
    note: "Reunião trimestral de revisão de carteira.",
  },
  {
    id: "act-7",
    type: "Visita",
    companyName: "Hotel Talatona Plaza",
    owner: "Catarina Sacramento",
    date: "2026-09-29",
    note: "Apresentação de novos produtos da gama institucional.",
  },
  {
    id: "act-8",
    type: "Chamada",
    companyName: "Revenda Zango",
    owner: "Emília Garcia",
    date: "2026-09-27",
    note: "Confirmação de parceria para distribuição na zona.",
  },
];
