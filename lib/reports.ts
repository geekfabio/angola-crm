import { COMPANIES, ownerByName, type Company } from "@/data/companies";
import { TEAM_FORECAST, ZONE_FORECAST } from "@/data/forecast";
import type { Opportunity } from "@/data/opportunities";
import type { RankedItem } from "@/components/_common/ranked-bar-list";
import { openOpportunities, type AtRiskClient } from "./dashboard";
import { stageTotal } from "./opportunities";
import type { CsvCell } from "./csv";

export const REPORT_DIMENSIONS = ["gestor", "zona", "equipa"] as const;

export type ReportDimension = (typeof REPORT_DIMENSIONS)[number];

function companyById(id: string) {
  return COMPANIES.find((company) => company.id === id);
}

export function byZoneLive(opportunities: Opportunity[]): RankedItem[] {
  const open = openOpportunities(opportunities);
  return ZONE_FORECAST.map((zone) => {
    const amount = stageTotal(
      open.filter((item) => companyById(item.companyId)?.zone === zone.zone),
    );
    return { key: zone.zone, label: zone.zone, amount, quota: zone.quota };
  }).sort((a, b) => b.amount - a.amount);
}

export function byTeam(opportunities: Opportunity[]): RankedItem[] {
  const open = openOpportunities(opportunities);
  return TEAM_FORECAST.map((team) => {
    const amount = stageTotal(
      open.filter((item) => ownerByName(item.owner).team === team.team),
    );
    return { key: team.team, label: team.team, amount, quota: team.quota };
  }).sort((a, b) => b.amount - a.amount);
}

export function atRiskClients(
  companies: Company[],
  windowDays: number,
): AtRiskClient[] {
  return companies
    .filter((company) => company.activityDays > windowDays)
    .sort((a, b) => b.activityDays - a.activityDays)
    .map((company) => ({
      id: company.id,
      name: company.name,
      owner: company.owner,
      activityDays: company.activityDays,
      pipelineValue: company.pipelineValue,
    }));
}

export function performanceCsvRows(
  dimensionLabel: string,
  items: RankedItem[],
): CsvCell[][] {
  return [
    [dimensionLabel, "Carteira Aberta (Kz)", "Quota (Kz)", "% da Quota"],
    ...items.map((item) => [
      item.label,
      item.amount,
      item.quota,
      Math.round((item.amount / item.quota) * 100),
    ]),
  ];
}

export function atRiskCsvRows(clients: AtRiskClient[]): CsvCell[][] {
  return [
    ["Cliente", "Gestor", "Dias sem Atividade", "Valor em Carteira (Kz)"],
    ...clients.map((client) => [
      client.name,
      client.owner,
      client.activityDays,
      client.pipelineValue,
    ]),
  ];
}
