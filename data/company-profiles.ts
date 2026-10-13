import { COMPANIES, type CompanyProfile } from "./companies";
import { CREDIT_LIMITS, CUSTOMER_IDENTIFIERS } from "./sales";

const MUNICIPALITIES: Record<string, string[]> = {
  Luanda: ["Talatona", "Viana", "Cazenga", "Kilamba Kiaxi", "Maianga", "Ingombota"],
  Benguela: ["Benguela", "Lobito", "Catumbela"],
  Huíla: ["Lubango", "Chibia"],
};

const STREETS = [
  "Rua Rainha Ginga",
  "Avenida 21 de Janeiro",
  "Rua Comandante Che Guevara",
  "Avenida Deolinda Rodrigues",
  "Rua Major Kanhangulo",
  "Estrada de Catete",
];

export const COMPANY_PROFILES: Record<string, CompanyProfile> = Object.fromEntries(
  COMPANIES.map((company, index) => {
    const ids = CUSTOMER_IDENTIFIERS[company.id];
    const municipalities = MUNICIPALITIES[company.zone] ?? [company.zone];
    const limit = CREDIT_LIMITS[company.id] ?? 0;
    return [
      company.id,
      {
        nif: ids.nif,
        card: ids.card,
        phone: ids.phone,
        billingEmail: `contabilidade.${company.id}@exemplo.ao`,
        address: `${STREETS[index % STREETS.length]}, n.º ${12 + index * 7}`,
        municipality: municipalities[index % municipalities.length],
        paymentTerms: limit > 0 ? (index % 2 === 0 ? "Crédito a 30 dias" : "Crédito a 15 dias") : "Pronto pagamento",
        creditLimit: limit,
        customerSince: `${2018 + (index % 7)}-${String((index % 12) + 1).padStart(2, "0")}-${String(((index * 5) % 27) + 1).padStart(2, "0")}`,
      },
    ];
  }),
);
