import {
  OPPORTUNITY_STAGES,
  type Opportunity,
  type OpportunityStage,
} from "@/data/opportunities";

export const ALL_OWNERS = "all";
export const ANY_STAGE = "any";

export type OpportunityFilters = {
  owner: string;
  stage: string;
  search: string;
};

export const DEFAULT_FILTERS: OpportunityFilters = {
  owner: ALL_OWNERS,
  stage: ANY_STAGE,
  search: "",
};

export function activeFilterCount({ owner, stage, search }: OpportunityFilters) {
  return [
    owner !== DEFAULT_FILTERS.owner,
    stage !== DEFAULT_FILTERS.stage,
    search.trim() !== "",
  ].filter(Boolean).length;
}

export function filterOpportunities(
  opportunities: Opportunity[],
  { owner, stage, search }: OpportunityFilters,
): Opportunity[] {
  const query = search.trim().toLowerCase();

  return opportunities.filter((opportunity) => {
    if (owner !== ALL_OWNERS && opportunity.owner !== owner) return false;
    if (stage !== ANY_STAGE && opportunity.stage !== stage) return false;
    if (
      query &&
      !opportunity.companyName.toLowerCase().includes(query) &&
      !opportunity.contactName.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}

export function groupByStage(
  opportunities: Opportunity[],
): Map<OpportunityStage, Opportunity[]> {
  const groups = new Map<OpportunityStage, Opportunity[]>(
    OPPORTUNITY_STAGES.map((stage) => [stage, []]),
  );

  for (const opportunity of opportunities) {
    groups.get(opportunity.stage)?.push(opportunity);
  }

  return groups;
}

export function stageTotal(opportunities: Opportunity[]) {
  return opportunities.reduce((sum, opportunity) => sum + opportunity.value, 0);
}

export function weightedPipeline(opportunities: Opportunity[]) {
  return opportunities.reduce(
    (sum, opportunity) =>
      sum + (opportunity.value * opportunity.probability) / 100,
    0,
  );
}
