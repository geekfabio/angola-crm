const MONEY_FORMATTER = new Intl.NumberFormat("pt-AO", {
  style: "currency",
  currency: "AOA",
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("pt-AO");

const PERCENT_FORMATTER = new Intl.NumberFormat("pt-AO", {
  style: "percent",
  maximumFractionDigits: 0,
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("pt-AO", {
  timeZone: "Africa/Luanda",
  day: "2-digit",
  month: "2-digit",
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("pt-AO", {
  timeZone: "Africa/Luanda",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-AO", {
  timeZone: "Africa/Luanda",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const LUANDA_OFFSET = "+01:00";

export function luandaLocalToDate(local: string) {
  return new Date(`${local}:00${LUANDA_OFFSET}`);
}

export function formatDateTime(local: string) {
  return DATE_TIME_FORMATTER.format(luandaLocalToDate(local));
}

export function formatMoney(value: number) {
  return MONEY_FORMATTER.format(value);
}

export function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value);
}

export function formatPercent(value: number) {
  return PERCENT_FORMATTER.format(value / 100);
}

const PERCENT_DECIMAL_FORMATTER = new Intl.NumberFormat("pt-AO", {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatPercentDecimal(value: number) {
  return PERCENT_DECIMAL_FORMATTER.format(value / 100);
}

export function formatDateShort(iso: string) {
  return SHORT_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

export function formatDateLong(iso: string) {
  return LONG_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

export function compactMoneyParts(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return { amount: Math.round((value / 1_000_000) * 10) / 10, suffix: "M Kz" };
  }
  if (abs >= 1_000) {
    return { amount: Math.round((value / 1_000) * 10) / 10, suffix: "mil Kz" };
  }
  return { amount: Math.round(value), suffix: "Kz" };
}
