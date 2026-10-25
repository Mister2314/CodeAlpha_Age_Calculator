# AgeCalculator

Calculates an exact age in years, months and days — plus a countdown to your next birthday and a two-date difference mode. English / Azərbaycanca.

**Live demo:** https://age-calculator-rho.vercel.app <!-- re-check after repo/project rename -->

<div align="center">

<img src="docs/demo.gif" alt="AgeCalculator — animated demo" width="700">

| Desktop | Mobile |
|---|---|
| <img src="docs/shot-desktop.png" alt="Desktop view" width="700"> | <img src="docs/shot-mobile.png" alt="Mobile view" width="290"> |

<details>
<summary>More screenshots</summary>

| Desktop | Mobile |
|---|---|
| <img src="docs/preview.png" alt="Desktop, alternate view" width="700"> | <img src="docs/preview-mobile.png" alt="Mobile, alternate view" width="290"> |

</details>

</div>

## Features

- **Exact age** — years, months and days, not just a year count, plus totals in days and hours
- **Next-birthday countdown** — days remaining, the weekday it falls on, and a birthday-today moment
- **Leap-day birthdays** — born Feb 29? The countdown follows the Mar 1 convention in non-leap years and says so
- **Date difference mode** — measure any two dates in years / months / days and total days
- **Shareable result** — native share sheet where supported, clipboard fallback everywhere
- **English / Azerbaijani** — one-tap language switch, persisted, browser language detected on first visit
- **Per-field input masking** — non-digits stripped as you type, day and month range-clamped, impossible dates caught against real month lengths
- **Dark / light theme** — follows the system on first visit, persisted choice, no first-paint flash
- **Accessible** — `aria-live` result and error announcements, `aria-invalid` field marking, keyboard flow, focus-visible rings, reduced-motion honoured throughout

## Tech stack

React 19 · TypeScript · Vite — no runtime dependencies beyond React, no analytics, no cookies. Dates are computed locally in the browser.

## Run locally

```bash
git clone https://github.com/Mister2314/AgeCalculator.git
cd AgeCalculator
npm install
npm run dev
```

## Project structure

```
src/
  age.ts     — calendar math: age, date difference, next birthday, leap-year rules
  i18n.ts    — EN/AZ string dictionaries
  App.tsx    — UI, validation, share
  styles.css — design tokens, themes, motion
```

## Design notes

The motion budget is spent in one place — the result. The three numerals count up in a staggered sequence with `tabular-nums` so digits never jitter; everything else is state feedback (field shake on error, icon crossfade on theme switch). With `prefers-reduced-motion`, counts land instantly and the static page is the complete page.

Feb 29 birthdays roll forward to Mar 1 in non-leap years (`new Date(year, 1, 29)` does exactly this), which matches the most common celebration convention — and the app tells the user that's what it did.

## What I learned

Masking each field separately forces the validation logic to live in `input` events rather than a single submit check — errors surface while typing instead of after. The second lesson: a hand-rolled `requestAnimationFrame` counter is ~30 lines, and not adding an animation library was the design decision that mattered.
