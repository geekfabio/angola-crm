import type { AuditEvent } from "@/data/audit";
import type { CsvCell } from "./csv";

export const ANY_MODULE = "all";
export const ANY_ACTOR = "all";

export type AuditFilters = {
  module: string;
  actor: string;
  search: string;
  sensitiveOnly: boolean;
};

export const DEFAULT_AUDIT_FILTERS: AuditFilters = {
  module: ANY_MODULE,
  actor: ANY_ACTOR,
  search: "",
  sensitiveOnly: false,
};

export function filterAudit(events: AuditEvent[], filters: AuditFilters) {
  const query = filters.search.trim().toLowerCase();
  return events
    .filter((event) => {
      if (filters.module !== ANY_MODULE && event.target.module !== filters.module) return false;
      if (filters.actor !== ANY_ACTOR && event.actor !== filters.actor) return false;
      if (filters.sensitiveOnly && !event.sensitive) return false;
      if (!query) return true;
      return [event.actor, event.action, event.target.label, ...event.changes.map((change) => change.field)]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function groupAuditByDay(events: AuditEvent[]) {
  const groups = new Map<string, AuditEvent[]>();
  for (const event of events) {
    const day = event.at.slice(0, 10);
    groups.set(day, [...(groups.get(day) ?? []), event]);
  }
  return [...groups.entries()];
}

export function auditActors(events: AuditEvent[]) {
  return [...new Set(events.map((event) => event.actor))].sort((a, b) => a.localeCompare(b, "pt"));
}

export function auditCsvRows(events: AuditEvent[]): CsvCell[][] {
  return [
    ["Data e hora", "Pessoa", "Ação", "Registo", "Módulo", "Alterações", "Dados sensíveis"],
    ...events.map((event) => [
      event.at.replace("T", " "),
      event.actor,
      event.action,
      event.target.label,
      event.target.module,
      event.changes
        .map((change) => `${change.field}: ${change.from ?? "—"} → ${change.to ?? "—"}`)
        .join(" | "),
      event.sensitive ? "Sim" : "Não",
    ]),
  ];
}
