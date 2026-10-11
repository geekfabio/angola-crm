import type { Operator } from "./phone";

const GSM_BASIC = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà",
);

const GSM_EXTENDED = new Set("^{}\\[~]|€\f");

const LIMITS = {
  "GSM-7": { single: 160, multi: 153 },
  Unicode: { single: 70, multi: 67 },
} as const;

export type SmsEncoding = keyof typeof LIMITS;

export type SmsAnalysis = {
  encoding: SmsEncoding;
  units: number;
  segments: number;
  perSegment: number;
  remaining: number;
  unicodeChars: string[];
};

export function isGsmChar(char: string) {
  return GSM_BASIC.has(char) || GSM_EXTENDED.has(char);
}

export function analyzeSms(text: string): SmsAnalysis {
  const unicodeChars = new Set<string>();
  let septets = 0;

  for (const char of text) {
    if (GSM_BASIC.has(char)) septets += 1;
    else if (GSM_EXTENDED.has(char)) septets += 2;
    else unicodeChars.add(char);
  }

  const encoding: SmsEncoding = unicodeChars.size > 0 ? "Unicode" : "GSM-7";
  const units = encoding === "Unicode" ? text.length : septets;
  const limit = LIMITS[encoding];
  const segments = units === 0 ? 0 : units <= limit.single ? 1 : Math.ceil(units / limit.multi);
  const perSegment = segments > 1 ? limit.multi : limit.single;
  const capacity = Math.max(segments, 1) * perSegment;

  return {
    encoding,
    units,
    segments,
    perSegment,
    remaining: capacity - units,
    unicodeChars: [...unicodeChars],
  };
}

const TYPOGRAPHIC: Record<string, string> = {
  "“": '"',
  "”": '"',
  "‘": "'",
  "’": "'",
  "–": "-",
  "—": "-",
  "…": "...",
  "ç": "c",
  "º": "o",
  "ª": "a",
};

export function toGsm(text: string) {
  let result = "";
  for (const char of text) {
    if (isGsmChar(char)) {
      result += char;
      continue;
    }
    const mapped =
      TYPOGRAPHIC[char] ?? char.normalize("NFD").replace(/[̀-ͯ]/g, "");
    result += [...mapped].every(isGsmChar) ? mapped : "?";
  }
  return result;
}

export const SMS_TARIFFS: Record<Operator, number> = {
  Unitel: 12,
  Africell: 10,
  Movicel: 11,
};

export const OPT_OUT_SUFFIX = " Resp. PARAR p/ sair";

export type SendWindow = {
  start: string;
  end: string;
};

export const DEFAULT_SEND_WINDOW: SendWindow = { start: "08:00", end: "20:00" };

export function isWithinWindow(local: string, window: SendWindow) {
  const time = local.slice(11, 16);
  return time >= window.start && time <= window.end;
}

const SENDER_ID_PATTERN = /^(?=.*[A-Za-z])[A-Za-z0-9 ]{3,11}$/;

export function isValidSenderId(senderId: string) {
  return SENDER_ID_PATTERN.test(senderId);
}
