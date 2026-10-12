import type { Automation, AutomationStep } from "@/data/automations";
import type { Company } from "@/data/companies";
import { OPEN_OFFER_STATUSES, type DiscountOffer, type OfferStatus } from "@/data/discount-offers";
import type { ProductCategory, Sale } from "@/data/sales";
import { matchesConditions, stepDays } from "./automations";
import { addDays } from "./follow-up";
import { abcBySales, purchaseStats } from "./sales";

export type DueStep = {
  key: string;
  automation: Automation;
  company: Company;
  step: AutomationStep;
  stepIndex: number;
  dueDate: string;
  daysWithoutPurchase: number;
  topCategories: ProductCategory[];
  firstStep: boolean;
  lastStep: boolean;
};

type EngineInput = {
  automations: Automation[];
  companies: Company[];
  sales: Sale[];
  today: string;
  done: Set<string>;
};

export function evaluableTrigger(automation: Automation) {
  return automation.trigger.type === "dias-sem-comprar";
}

export function dueSteps({ automations, companies, sales, today, done }: EngineInput): DueStep[] {
  const running = automations.filter((automation) => automation.status === "Ativa" && evaluableTrigger(automation));
  if (running.length === 0) return [];
  const active = companies.filter((company) => !company.archived);
  const abc = abcBySales(active, sales, today);
  const stats = new Map(active.map((company) => [company.id, purchaseStats(sales, company.id, today)]));
  const due: DueStep[] = [];

  for (const automation of running) {
    const days = stepDays(automation.steps);
    for (const company of active) {
      const purchase = stats.get(company.id)!;
      if (!purchase.lastPurchaseAt || purchase.daysSincePurchase === undefined) continue;
      if (purchase.daysSincePurchase < automation.trigger.days) continue;
      if (!matchesConditions(company, automation.conditions, abc)) continue;
      const lastDate = purchase.lastPurchaseAt.slice(0, 10);
      const threshold = addDays(lastDate, automation.trigger.days);
      const start = automation.activatedAt && automation.activatedAt > threshold ? automation.activatedAt : threshold;
      automation.steps.forEach((step, index) => {
        const dueDate = addDays(start, days[index]);
        if (dueDate > today) return;
        const key = `${automation.id}|${company.id}|${lastDate}|${step.id}`;
        if (done.has(key)) return;
        due.push({
          key,
          automation,
          company,
          step,
          stepIndex: index,
          dueDate,
          daysWithoutPurchase: purchase.daysSincePurchase!,
          topCategories: purchase.topCategories,
          firstStep: index === 0,
          lastStep: index === automation.steps.length - 1,
        });
      });
    }
  }

  return due.sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.stepIndex - b.stepIndex);
}

export function offerStatus(offer: DiscountOffer, today: string): OfferStatus {
  if (OPEN_OFFER_STATUSES.includes(offer.status) && offer.validUntil < today) return "Expirada";
  return offer.status;
}

export function isOfferOpen(offer: DiscountOffer, today: string) {
  return OPEN_OFFER_STATUSES.includes(offerStatus(offer, today));
}

export function offerDiscountValue(offer: DiscountOffer, sale: Sale) {
  const base =
    offer.scope === "Toda a encomenda" || offer.categories.length === 0
      ? sale.total
      : sale.lines
          .filter((line) => offer.categories.includes(line.category))
          .reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  return Math.round((base * offer.percent) / 100);
}

export function offerScopeLabel(offer: Pick<DiscountOffer, "scope" | "categories">) {
  if (offer.scope === "Toda a encomenda" || offer.categories.length === 0) return "em toda a encomenda";
  return `em ${offer.categories.join(", ")}`;
}

export function renderTemplate(body: string, values: Record<string, string>) {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
}

export function daysSince(dateTime: string, today: string) {
  return Math.round(
    (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${dateTime.slice(0, 10)}T00:00:00Z`)) / (24 * 60 * 60 * 1000),
  );
}
