export type Lang = "en" | "az";

type Dict = {
  docTitle: string;
  title: string;
  subtitle: string;
  modeAge: string;
  modeDiff: string;
  day: string;
  month: string;
  year: string;
  from: string;
  to: string;
  calculate: string;
  youAre: string;
  unitYears: string;
  unitMonths: string;
  unitDays: string;
  oldCaption: string;
  birthdayCaption: string;
  asOf: string;
  bornOn: string; // {day}
  totalLine: string; // {days} {hours}
  nextBirthdayIn: string; // {days}
  nextBirthdayToday: string;
  nextBirthdayOn: string; // {date}
  leapNote: string;
  share: string;
  copied: string;
  diffResult: string; // {years} {months} {days}
  errDayRequired: string;
  errDayInvalid: string;
  errMonthRequired: string;
  errMonthInvalid: string;
  errYearRequired: string;
  errYearLength: string;
  errDayInMonth: string; // {month}
  errFuture: string;
  errFromTo: string;
};

const en: Dict = {
  docTitle: "AgeCalculator — exact age, birthdays & date differences",
  title: "AgeCalculator",
  subtitle: "Exact age in years, months and days — plus your next birthday countdown.",
  modeAge: "Your age",
  modeDiff: "Date difference",
  day: "Day",
  month: "Month",
  year: "Year",
  from: "From",
  to: "To",
  calculate: "Calculate",
  youAre: "You are",
  unitYears: "years",
  unitMonths: "months",
  unitDays: "days",
  oldCaption: "old",
  birthdayCaption: "old — and it's your birthday today",
  asOf: "as of",
  bornOn: "You were born on a {day}.",
  totalLine: "That's {days} days — or about {hours} hours — of life so far.",
  nextBirthdayIn: "Next birthday in {days} days",
  nextBirthdayToday: "Your birthday is today",
  nextBirthdayOn: "Falls on {date}",
  leapNote: "Born on Feb 29 — in non-leap years the birthday is celebrated on Mar 1.",
  share: "Share result",
  copied: "Copied to clipboard",
  diffResult: "Between these dates:",
  errDayRequired: "Day is required",
  errDayInvalid: "Must be a valid day",
  errMonthRequired: "Month is required",
  errMonthInvalid: "Must be a valid month",
  errYearRequired: "Year is required",
  errYearLength: "Year must be 4 digits",
  errDayInMonth: "Invalid day for {month}",
  errFuture: "Date cannot be in the future",
  errFromTo: "\u201CTo\u201D date must be on or after the \u201CFrom\u201D date",
};

const az: Dict = {
  docTitle: "AgeCalculator — dəqiq yaş, doğum günü və tarix fərqi",
  title: "AgeCalculator",
  subtitle: "İl, ay və günü ilə dəqiq yaş — üstəlik növbəti doğum günü sayğacı.",
  modeAge: "Yaşınız",
  modeDiff: "Tarix fərqi",
  day: "Gün",
  month: "Ay",
  year: "İl",
  from: "Başlanğıc",
  to: "Bitmə",
  calculate: "Hesabla",
  youAre: "Siz",
  unitYears: "il",
  unitMonths: "ay",
  unitDays: "gün",
  oldCaption: "yaşındasınız",
  birthdayCaption: "yaşındasınız — və bu gün doğum gününüzdür",
  asOf: "tarixə",
  bornOn: "{day} günü doğulmusunuz.",
  totalLine: "Bu, təqribən {days} gün — yəni {hours} saat deməkdir.",
  nextBirthdayIn: "Növbəti doğum gününə {days} gün",
  nextBirthdayToday: "Doğum gününüz budur",
  nextBirthdayOn: "{date} gününə düşür",
  leapNote: "29 fevralda doğulmusunuz — qağmayan illərdə 1 martda qeyd olunur.",
  share: "Nəticəni paylaş",
  copied: "Buferə kopyalandı",
  diffResult: "Bu tarixlər arasında:",
  errDayRequired: "Gün tələb olunur",
  errDayInvalid: "Düzgün gün deyil",
  errMonthRequired: "Ay tələb olunur",
  errMonthInvalid: "Düzgün ay deyil",
  errYearRequired: "İl tələb olunur",
  errYearLength: "İl 4 rəqəm olmalıdır",
  errDayInMonth: "{month} ayı üçün düzgün gün deyil",
  errFuture: "Tarix gələcəkdə ola bilməz",
  errFromTo: "\u201CBitmə\u201D tarixi \u201CBaşlanğıc\u201D tarixindən sonra olmalıdır",
};

const DICTS: Record<Lang, Dict> = { en, az };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.en;
}

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}
