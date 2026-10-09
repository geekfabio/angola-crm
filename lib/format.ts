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

export function formatMoney(value: number) {
  return MONEY_FORMATTER.format(value);
}

export function formatNumber(value: number) {
  return NUMBER_FORMATTER.format(value);
}

export function formatPercent(value: number) {
  return PERCENT_FORMATTER.format(value / 100);
}

export function formatDateShort(iso: string) {
  return SHORT_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

export function formatDateLong(iso: string) {
  return LONG_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}
