import {
  ANY,
  BRAND_LOGO,
  VARIABLES,
  type AbcClass,
  type AudienceFilters,
  type BlockType,
  type Campaign,
  type CampaignBlock,
  type Fallbacks,
  type VariableKey,
} from "@/data/campaigns";
import type { Company } from "@/data/companies";
import type { Contact, ContactabilityStatus } from "@/data/contacts";

export type CampaignFilters = {
  channel: string;
  status: string;
  search: string;
};

export const DEFAULT_CAMPAIGN_FILTERS: CampaignFilters = {
  channel: ANY,
  status: ANY,
  search: "",
};

export function filterCampaigns(
  campaigns: Campaign[],
  { channel, status, search }: CampaignFilters,
) {
  const query = search.trim().toLowerCase();
  return campaigns.filter((campaign) => {
    if (channel !== ANY && campaign.channel !== channel) return false;
    if (status !== ANY && campaign.status !== status) return false;
    if (
      query &&
      !campaign.name.toLowerCase().includes(query) &&
      !campaign.subject.toLowerCase().includes(query)
    )
      return false;
    return true;
  });
}

export function createBlock(type: BlockType, id: string): CampaignBlock {
  switch (type) {
    case "heading":
      return { id, type, text: "Novo título" };
    case "text":
      return { id, type, text: "" };
    case "banner":
      return { id, type, title: "Destaque", subtitle: "", tone: "brand" };
    case "image":
      return {
        id,
        type,
        src: BRAND_LOGO,
        alt: "Alimenta Angola",
      };
    case "button":
      return { id, type, label: "Saber mais", href: "https://alimentaangola.co.ao" };
    case "divider":
      return { id, type };
  }
}

export type VariableValues = Partial<Record<VariableKey, string>>;

const VARIABLE_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

export function renderVariables(
  text: string,
  values: VariableValues,
  fallbacks: Fallbacks,
) {
  return text.replace(VARIABLE_PATTERN, (match, key: string) => {
    if (!(key in fallbacks)) return match;
    const variable = key as VariableKey;
    return values[variable]?.trim() || fallbacks[variable];
  });
}

export function valuesForContact(
  contact: Contact | undefined,
  company: Company | undefined,
): VariableValues {
  if (!contact) return {};
  return {
    nome: contact.name.split(" ")[0],
    empresa: contact.companyName,
    gestor: company?.owner,
    zona: company?.zone,
  };
}

export function missingFallbacks(fallbacks: Fallbacks) {
  return VARIABLES.filter((variable) => !fallbacks[variable.key].trim());
}

export function abcClasses(companies: Company[]): Map<string, AbcClass> {
  const sorted = [...companies].sort((a, b) => b.pipelineValue - a.pipelineValue);
  const total = sorted.reduce((sum, company) => sum + company.pipelineValue, 0) || 1;
  const classes = new Map<string, AbcClass>();
  let cumulative = 0;

  for (const company of sorted) {
    const share = cumulative / total;
    classes.set(company.id, share < 0.8 ? "A" : share < 0.95 ? "B" : "C");
    cumulative += company.pipelineValue;
  }

  return classes;
}

export type ExclusionReason =
  | Exclude<ContactabilityStatus, "Válido">
  | "Sem consentimento de e-mail";

export const EXCLUSION_TONES: Record<ExclusionReason, "red" | "amber" | "neutral"> = {
  "Sem consentimento de e-mail": "amber",
  Inválido: "red",
  "Saiu da empresa": "neutral",
  "Pediu remoção": "neutral",
};

export type AudienceEntry = {
  contact: Contact;
  company?: Company;
  reason?: ExclusionReason;
};

export type Audience = {
  companies: Company[];
  eligible: AudienceEntry[];
  excluded: AudienceEntry[];
  exclusionCounts: Partial<Record<ExclusionReason, number>>;
};

function exclusionFor(contact: Contact): ExclusionReason | undefined {
  if (contact.contactability !== "Válido") return contact.contactability;
  if (!contact.consent.email.granted) return "Sem consentimento de e-mail";
  return undefined;
}

export function buildAudience(
  filters: AudienceFilters,
  companies: Company[],
  contacts: Contact[],
): Audience {
  const abc = abcClasses(companies);
  const minDays = filters.inactiveDays === ANY ? null : Number(filters.inactiveDays);

  const matched = companies.filter((company) => {
    if (filters.zone !== ANY && company.zone !== filters.zone) return false;
    if (
      filters.segment !== ANY &&
      !company.tags.some((tag) => tag === filters.segment)
    )
      return false;
    if (filters.abc !== ANY && abc.get(company.id) !== filters.abc) return false;
    if (minDays !== null && company.activityDays <= minDays) return false;
    return true;
  });

  const byId = new Map(matched.map((company) => [company.id, company]));
  const entries = contacts
    .filter((contact) => byId.has(contact.companyId))
    .map<AudienceEntry>((contact) => ({
      contact,
      company: byId.get(contact.companyId),
      reason: exclusionFor(contact),
    }));

  const excluded = entries.filter((entry) => entry.reason);
  const exclusionCounts: Audience["exclusionCounts"] = {};
  for (const entry of excluded) {
    const reason = entry.reason!;
    exclusionCounts[reason] = (exclusionCounts[reason] ?? 0) + 1;
  }

  return {
    companies: matched,
    eligible: entries.filter((entry) => !entry.reason),
    excluded,
    exclusionCounts,
  };
}

export type ReviewCheck = {
  key: string;
  label: string;
  ok: boolean;
};

export function reviewChecks(campaign: Campaign, eligibleCount: number): ReviewCheck[] {
  return [
    { key: "subject", label: "Assunto preenchido", ok: campaign.subject.trim() !== "" },
    { key: "blocks", label: "Conteúdo com pelo menos um bloco", ok: campaign.blocks.length > 0 },
    {
      key: "fallbacks",
      label: "Valor por omissão em todas as variáveis",
      ok: missingFallbacks(campaign.fallbacks).length === 0,
    },
    {
      key: "audience",
      label: "Segmento com destinatários elegíveis",
      ok: eligibleCount > 0,
    },
    {
      key: "test",
      label: "Envio de teste registado",
      ok: Boolean(campaign.testSentAt),
    },
  ];
}

export function canSubmitForReview(checks: ReviewCheck[]) {
  return checks.filter((check) => check.key !== "test").every((check) => check.ok);
}
