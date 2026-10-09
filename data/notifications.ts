export type NotificationKind =
  | "mention"
  | "stage"
  | "alert"
  | "update"
  | "invite";

export type Notification = {
  id: string;
  kind: NotificationKind;
  actor?: string;
  companyId: string;
  message: string;
  quote?: string;
  time: string;
  unread: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "mention",
    actor: "Marcos Domingos",
    companyId: "nova-vida",
    message: "mencionou-te no Supermercado Nova Vida",
    quote:
      "Podes juntar-te à revisão do piloto na sexta? A direção quer uma avaliação de segurança.",
    time: "há 2 min",
    unread: true,
  },
  {
    id: "n2",
    kind: "stage",
    actor: "Sara Neto",
    companyId: "boa-esperanca",
    message: "moveu a Mercearia Boa Esperança para Renovação",
    time: "há 18 min",
    unread: true,
  },
  {
    id: "n3",
    kind: "alert",
    companyId: "marisqueira-ilha",
    message: "A probabilidade de fecho da Marisqueira da Ilha desceu para 23%",
    time: "há 1h",
    unread: true,
  },
  {
    id: "n4",
    kind: "update",
    actor: "Emília Garcia",
    companyId: "zango",
    message: "atualizou a adequação ao negócio da Revenda Zango",
    time: "há 3h",
    unread: false,
  },
  {
    id: "n5",
    kind: "update",
    actor: "Nelson Lemos",
    companyId: "mussulo-bay",
    message: "registou uma demonstração com o Hotel Mussulo Bay",
    time: "Ontem",
    unread: false,
  },
  {
    id: "n6",
    kind: "alert",
    companyId: "sao-paulo",
    message: "O valor em carteira da Mercearia São Paulo subiu para 44.000.000 Kz",
    time: "há 2 dias",
    unread: false,
  },
  {
    id: "n7",
    kind: "invite",
    actor: "Graça Miguel",
    companyId: "cantina-kilamba",
    message: "adicionou-te à equipa da Cantina Universitária do Kilamba",
    time: "há 3 dias",
    unread: false,
  },
];
