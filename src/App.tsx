import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { ageAt, diffYMD, isLeapDay, isValidDate, nextBirthday, startOfDay } from "./age";
import { fill, getDict, type Lang } from "./i18n";

const WEEKDAYS: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  az: ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"],
};

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  az: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectLang(): Lang {
  const saved = localStorage.getItem("lang");
  if (saved === "az" || saved === "en") return saved;
  return navigator.language?.toLowerCase().startsWith("az") ? "az" : "en";
}

/** Counts a displayed number from 0 to `target` with an expo-out curve.
 *  Jumps straight to the target when reduced motion is preferred. */
function useCountUp(target: number, delay: number, runId: number): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const DURATION = 900;
    let start: number | null = null;
    let timeout = 0;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(2, -10 * t); // expo.out
      setValue(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    timeout = window.setTimeout(() => {
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [target, delay, runId]);

  return value;
}

type Mode = "age" | "diff";

interface Fields {
  d: string;
  m: string;
  y: string;
}
type FieldKey = "d" | "m" | "y";

const EMPTY: Fields = { d: "", m: "", y: "" };

interface Computed {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  isBirthday: boolean;
  leapDay: boolean;
  birthWeekdayIndex: number | null;
  nextBdDays: number | null;
  nextBdDate: Date | null;
}

export default function App() {
  const [theme, setTheme] = useState<string>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [lang, setLang] = useState<Lang>(detectLang);
  const [mode, setMode] = useState<Mode>("age");
  const [birth, setBirth] = useState<Fields>(EMPTY);
  const [from, setFrom] = useState<Fields>(EMPTY);
  const [to, setTo] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [result, setResult] = useState<Computed | null>(null);
  const [diffLabel, setDiffLabel] = useState<{ from: Date; to: Date } | null>(null);
  const [runId, setRunId] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const t = getDict(lang);

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.docTitle;
  }, [lang, t.docTitle]);

  const applyTheme = (next: string) => {
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (typeof doc.startViewTransition === "function" && !prefersReducedMotion()) {
      doc.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  };

  const switchLang = (next: Lang) => {
    setLang(next);
    localStorage.setItem("lang", next);
  };

  const clampField = (key: FieldKey, value: string, max: number): string => {
    let v = value.replace(/[^0-9]/g, "");
    const parsed = parseInt(v);
    if (key === "y") {
      const currentYear = new Date().getFullYear();
      if (parsed > currentYear) v = currentYear.toString();
      if (v.length > 4) v = v.slice(0, 4);
    } else {
      if (parsed > max) v = String(max);
      if (v.length > 2) v = v.slice(0, 2);
    }
    return v;
  };

  /** Validate one date trio; returns the parsed Date or pushes errors. */
  const validateTrio = (f: Fields, prefix: string, allowFuture: boolean): Date | null => {
    const d = parseInt(f.d);
    const m = parseInt(f.m);
    const y = parseInt(f.y);
    const errs: Partial<Record<string, string>> = {};
    let ok = true;

    if (!f.d) { errs[`${prefix}d`] = t.errDayRequired; ok = false; }
    else if (d < 1 || d > 31) { errs[`${prefix}d`] = t.errDayInvalid; ok = false; }

    if (!f.m) { errs[`${prefix}m`] = t.errMonthRequired; ok = false; }
    else if (m < 1 || m > 12) { errs[`${prefix}m`] = t.errMonthInvalid; ok = false; }

    if (!f.y) { errs[`${prefix}y`] = t.errYearRequired; ok = false; }
    else if (f.y.length < 4) { errs[`${prefix}y`] = t.errYearLength; ok = false; }

    if (ok && !isValidDate(y, m, d)) {
      errs[`${prefix}d`] = fill(t.errDayInMonth, { month: MONTHS[lang][m - 1] });
      ok = false;
    }

    if (ok) {
      const date = new Date(y, m - 1, d);
      if (!allowFuture && startOfDay(date) > startOfDay(new Date())) {
        errs[`${prefix}y`] = t.errFuture;
        ok = false;
      }
      if (ok) {
        setErrors((prev) => ({ ...prev, ...Object.fromEntries(
          Object.keys(errs).length ? Object.entries(errs) : [[`${prefix}d`, ""], [`${prefix}m`, ""], [`${prefix}y`, ""]]
        ) }));
        return date;
      }
    }
    setErrors((prev) => ({ ...prev, ...errs }));
    return null;
  };

  const calculate = () => {
    setErrors({});
    setCopied(false);

    if (mode === "age") {
      const b = validateTrio(birth, "b", false);
      if (!b) {
        setShakeKey((k) => k + 1);
        return;
      }
      const now = new Date();
      const age = ageAt(b, now);
      const nb = nextBirthday(b, now);
      const leapDay = isLeapDay(b);
      setResult({
        years: age.years,
        months: age.months,
        days: age.days,
        totalDays: age.totalDays,
        totalHours: age.totalHours,
        isBirthday: nb.isToday,
        leapDay,
        birthWeekdayIndex: b.getDay(),
        nextBdDays: nb.daysUntil,
        nextBdDate: nb.date,
      });
      setDiffLabel(null);
      setRunId((k) => k + 1);
    } else {
      const f = validateTrio(from, "f", true);
      const toDate = validateTrio(to, "t", true);
      if (!f || !toDate) {
        setShakeKey((k) => k + 1);
        return;
      }
      if (startOfDay(toDate) < startOfDay(f)) {
        setErrors({ td: t.errFromTo });
        setShakeKey((k) => k + 1);
        return;
      }

      const diff = diffYMD(f, toDate);
      setResult({
        years: diff.years,
        months: diff.months,
        days: diff.days,
        totalDays: diff.totalDays,
        totalHours: diff.totalHours,
        isBirthday: false,
        leapDay: false,
        birthWeekdayIndex: null,
        nextBdDays: null,
        nextBdDate: null,
      });
      setDiffLabel({ from: f, to: toDate });
      setRunId((k) => k + 1);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") calculate();
  };

  const shareResult = async () => {
    if (!result) return;
    let text: string;
    if (mode === "diff" && diffLabel) {
      const fmt = (d: Date) => fmtDate(d);
      text = `${t.diffResult} ${fmt(diffLabel.from)} → ${fmt(diffLabel.to)}: ${result.years} ${t.unitYears}, ${result.months} ${t.unitMonths}, ${result.days} ${t.unitDays} (${result.totalDays} ${t.unitDays}).`;
    } else {
      text = `${t.youAre} ${result.years} ${t.unitYears}, ${result.months} ${t.unitMonths}, ${result.days} ${t.unitDays} ${t.oldCaption}.`;
      if (result.nextBdDays !== null && result.nextBdDays > 0) {
        text += ` ${fill(t.nextBirthdayIn, { days: result.nextBdDays })}.`;
      }
    }
    text += " — AgeCalculator";

    if (navigator.share) {
      try {
        await navigator.share({ title: "AgeCalculator", text });
        return;
      } catch {
        /* user cancelled or share failed — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Locale-independent formatting: AZ locale data is missing in some
  // browsers, so dates and numbers are built from our own dictionaries.
  const fmtDate = (d: Date) => `${d.getDate()} ${MONTHS[lang][d.getMonth()]} ${d.getFullYear()}`;
  const fmtNum = (n: number) => n.toLocaleString("en-US");

  const years = result?.years ?? 0;
  const months = result?.months ?? 0;
  const days = result?.days ?? 0;

  const shownYears = useCountUp(years, 0, runId);
  const shownMonths = useCountUp(months, 120, runId);
  const shownDays = useCountUp(days, 240, runId);

  const now = new Date();
  const asOf = result ? `${t.asOf} ${fmtDate(now)}` : "";

  const renderField = (
    id: string,
    label: string,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    maxLength: number,
    autoComplete: string
  ) => (
    <div className="inputcontainer" key={id}>
      <label className="title" htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        required
        inputMode="numeric"
        autoComplete={autoComplete}
        aria-invalid={errors[id] ? true : undefined}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
      />
      <span className="error" id={`${id}-error`} aria-live="polite">{errors[id] ?? ""}</span>
    </div>
  );

  const renderTrio = (
    prefix: "b" | "f" | "t",
    fields: Fields,
    setFields: (f: Fields) => void,
    groupLabel?: string
  ) => (
    <fieldset className="date-trio">
      {groupLabel ? <legend className="trio-legend">{groupLabel}</legend> : null}
      <div className="middle">
        {renderField(
          `${prefix}d`,
          t.day,
          "DD",
          fields.d,
          (v) => setFields({ ...fields, d: clampField("d", v, 31) }),
          2,
          mode === "age" ? "bday-day" : "off"
        )}
        {renderField(
          `${prefix}m`,
          t.month,
          "MM",
          fields.m,
          (v) => setFields({ ...fields, m: clampField("m", v, 12) }),
          2,
          mode === "age" ? "bday-month" : "off"
        )}
        {renderField(
          `${prefix}y`,
          t.year,
          "YYYY",
          fields.y,
          (v) => setFields({ ...fields, y: clampField("y", v, 9999) }),
          4,
          mode === "age" ? "bday-year" : "off"
        )}
      </div>
    </fieldset>
  );

  return (
    <>
      <div className="controls">
        <div className="lang-toggle" role="group" aria-label="Language / Dil">
          {(["en", "az"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              className={`lang-btn${lang === l ? " is-active" : ""}`}
              aria-pressed={lang === l}
              onClick={() => switchLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          id="themeToggle"
          onClick={toggleTheme}
          className={`theme-toggle-btn${theme === "dark" ? " is-dark" : ""}`}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
      <div className="container">
        <main className="formContainer">
          <div className="up">
            <h1>{t.title}</h1>
            <p className="subtitle">{t.subtitle}</p>
          </div>

          <div className="mode-switch" role="tablist" aria-label={t.modeAge}>
            {(["age", "diff"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                className={`mode-btn${mode === m ? " is-active" : ""}`}
                onClick={() => { setMode(m); setErrors({}); setResult(null); setDiffLabel(null); setCopied(false); }}
              >
                {m === "age" ? t.modeAge : t.modeDiff}
              </button>
            ))}
          </div>

          <div key={`shake-${shakeKey}`} data-error={Object.values(errors).some(Boolean) ? "true" : undefined}>
            {mode === "age"
              ? renderTrio("b", birth, setBirth)
              : renderTrio("f", from, setFrom, t.from)}

            {mode === "diff" && renderTrio("t", to, setTo, t.to)}
          </div>

          <div className="bottom">
            <div className="submit-button">
              <button type="button" id="calculateBtn" onClick={calculate}>
                {t.calculate}
              </button>
            </div>
          </div>

          <div className={`result${result ? " active" : ""}`} id="result" aria-live="polite">
            <div id="ageResult">
              {result && (
                <div key={runId}>
                  <p className="result-heading">{mode === "diff" ? t.diffResult : t.youAre}</p>
                  <div className="result-grid">
                    <div className="result-cell">
                      <span className="result-number">{shownYears}</span>
                      <span className="result-unit">{t.unitYears}</span>
                    </div>
                    <div className="result-cell">
                      <span className="result-number">{shownMonths}</span>
                      <span className="result-unit">{t.unitMonths}</span>
                    </div>
                    <div className="result-cell">
                      <span className="result-number">{shownDays}</span>
                      <span className="result-unit">{t.unitDays}</span>
                    </div>
                  </div>
                  {mode === "age" && (
                    <p className="result-caption">
                      {result.isBirthday ? t.birthdayCaption : t.oldCaption}
                    </p>
                  )}

                  <div className="result-extras">
                    {mode === "age" && result.birthWeekdayIndex !== null && (
                      <p className="extra-line">{fill(t.bornOn, { day: WEEKDAYS[lang][result.birthWeekdayIndex] })}</p>
                    )}
                    <p className="extra-line">
                      {fill(t.totalLine, { days: fmtNum(result.totalDays), hours: fmtNum(result.totalHours) })}
                    </p>
                    {mode === "age" && result.nextBdDays !== null && (
                      result.isBirthday ? (
                        <p className="extra-line extra-strong">{t.nextBirthdayToday}</p>
                      ) : (
                        <p className="extra-line extra-strong">
                          {fill(t.nextBirthdayIn, { days: result.nextBdDays })}
                          {" · "}
                          {fill(t.nextBirthdayOn, { date: result.nextBdDate ? fmtDate(result.nextBdDate) : "" })}
                        </p>
                      )
                    )}
                    {result.leapDay && <p className="extra-line extra-muted">{t.leapNote}</p>}
                  </div>

                  {mode === "age" && <p className="result-asof">{asOf}</p>}

                  <button type="button" className="share-btn" onClick={shareResult}>
                    {copied ? t.copied : t.share}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
