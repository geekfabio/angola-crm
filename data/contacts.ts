export type ConsentStatus = "Válido" | "Inválido" | "Pediu remoção";

export const CONSENT_TONES: Record<
  ConsentStatus,
  "green" | "red" | "neutral"
> = {
  Válido: "green",
  Inválido: "red",
  "Pediu remoção": "neutral",
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  companyName: string;
  phone: string;
  email: string;
  consent: ConsentStatus;
};

export const CONTACTS: Contact[] = [
  {
    id: "ct-1",
    name: "Fernanda Quitumba",
    role: "Gerente",
    companyName: "Mercearia Boa Esperança",
    phone: "+244 921 334 221",
    email: "fernanda.quitumba@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-2",
    name: "Manuel Cassoma",
    role: "Proprietário",
    companyName: "Restaurante Ilha do Cabo",
    phone: "+244 912 556 783",
    email: "manuel.cassoma@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-3",
    name: "Isabel Capinda",
    role: "Diretora de Compras",
    companyName: "Hotel Baía Azul",
    phone: "+244 999 221 440",
    email: "isabel.capinda@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-4",
    name: "Pedro Muanza",
    role: "Gerente de Loja",
    companyName: "Supermercado Nova Vida",
    phone: "+244 923 118 902",
    email: "pedro.muanza@mail.co.ao",
    consent: "Pediu remoção",
  },
  {
    id: "ct-5",
    name: "Joana Capemba",
    role: "Proprietária",
    companyName: "Padaria Tchissola",
    phone: "+244 941 772 309",
    email: "joana.capemba@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-6",
    name: "Albino Sachipengo",
    role: "Chefe de Compras",
    companyName: "Mercearia Kilamba",
    phone: "+244 912 445 668",
    email: "albino.sachipengo@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-7",
    name: "Rosa Bumba",
    role: "Gerente Geral",
    companyName: "Hotel Talatona Plaza",
    phone: "+244 999 887 112",
    email: "rosa.bumba@mail.co.ao",
    consent: "Inválido",
  },
  {
    id: "ct-8",
    name: "Domingos Kiezi",
    role: "Sócio-Gerente",
    companyName: "Revenda Zango",
    phone: "+244 923 665 390",
    email: "domingos.kiezi@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-9",
    name: "Teresa Mbala",
    role: "Gerente de Loja",
    companyName: "Mercearia São Paulo",
    phone: "+244 912 230 774",
    email: "teresa.mbala@mail.co.ao",
    consent: "Válido",
  },
  {
    id: "ct-10",
    name: "Agostinho Zola",
    role: "Proprietário",
    companyName: "Marisqueira da Ilha",
    phone: "+244 941 556 221",
    email: "agostinho.zola@mail.co.ao",
    consent: "Válido",
  },
];
