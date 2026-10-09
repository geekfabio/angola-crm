import type { Stage } from "./companies";

export type Opportunity = {
  id: string;
  companyName: string;
  contactName: string;
  value: number;
  stage: Stage;
  probability: number;
  expectedCloseDate: string;
  owner: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "op-1",
    companyName: "Mercearia Boa Esperança",
    contactName: "Fernanda Quitumba",
    value: 18_500_000,
    stage: "Venda adicional",
    probability: 70,
    expectedCloseDate: "2026-10-15",
    owner: "Sara Neto",
  },
  {
    id: "op-2",
    companyName: "Restaurante Ilha do Cabo",
    contactName: "Manuel Cassoma",
    value: 6_200_000,
    stage: "Novo cliente",
    probability: 45,
    expectedCloseDate: "2026-10-28",
    owner: "Jaime Teixeira",
  },
  {
    id: "op-3",
    companyName: "Hotel Baía Azul",
    contactName: "Isabel Capinda",
    value: 32_000_000,
    stage: "Renovação",
    probability: 80,
    expectedCloseDate: "2026-11-05",
    owner: "Mariana Capitão",
  },
  {
    id: "op-4",
    companyName: "Supermercado Nova Vida",
    contactName: "Pedro Muanza",
    value: 24_800_000,
    stage: "Expansão",
    probability: 60,
    expectedCloseDate: "2026-11-12",
    owner: "Marcos Domingos",
  },
  {
    id: "op-5",
    companyName: "Padaria Tchissola",
    contactName: "Joana Capemba",
    value: 4_900_000,
    stage: "Piloto",
    probability: 35,
    expectedCloseDate: "2026-10-20",
    owner: "Alexandre Santos",
  },
  {
    id: "op-6",
    companyName: "Mercearia Kilamba",
    contactName: "Albino Sachipengo",
    value: 15_300_000,
    stage: "Parceria",
    probability: 55,
    expectedCloseDate: "2026-11-18",
    owner: "Lina Wamba",
  },
  {
    id: "op-7",
    companyName: "Hotel Talatona Plaza",
    contactName: "Rosa Bumba",
    value: 9_700_000,
    stage: "Reactivação",
    probability: 40,
    expectedCloseDate: "2026-10-30",
    owner: "Catarina Sacramento",
  },
  {
    id: "op-8",
    companyName: "Revenda Zango",
    contactName: "Domingos Kiezi",
    value: 11_100_000,
    stage: "Expansão",
    probability: 65,
    expectedCloseDate: "2026-11-22",
    owner: "Emília Garcia",
  },
  {
    id: "op-9",
    companyName: "Mercearia São Paulo",
    contactName: "Teresa Mbala",
    value: 21_400_000,
    stage: "Venda adicional",
    probability: 72,
    expectedCloseDate: "2026-11-02",
    owner: "Graça Miguel",
  },
  {
    id: "op-10",
    companyName: "Marisqueira da Ilha",
    contactName: "Agostinho Zola",
    value: 7_600_000,
    stage: "Novo cliente",
    probability: 30,
    expectedCloseDate: "2026-12-01",
    owner: "Avelina Brito",
  },
];
