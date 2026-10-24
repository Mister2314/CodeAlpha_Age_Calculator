# Age Calculator

Calculates an exact age in years, months and days from a day / month / year input.

**Live demo:** https://codealpha-age-calculator-rho.vercel.app

<div align="center">

<img src="docs/demo.gif" alt="Age Calculator — animated demo" width="700">

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

## What it does

Three separate date fields instead of one native date picker, so the input can be masked as it is typed: non-digits are stripped on the fly and day (1–31) and month (1–12) are clamped, which makes an impossible date hard to submit. The result is broken down into years, months and days, plus totals in months, weeks and days. Built during the CodeAlpha front-end internship.

## Tech stack

React 19 · TypeScript · Vite

## Features

- Exact age in years, months and days, not just a year count
- Per-field input masking — non-digits stripped as you type
- Range clamping on day and month inputs
- Dark / light theme toggle with inline SVG icons, persisted to `localStorage`
- Responsive layout set in Noto Sans

## The revamp

The 2026 pass keeps the tool's identity and spends its motion budget in one place — the result:

- **Kinetic result reveal** — the three numerals count up in a staggered sequence with `tabular-nums`, so digits never jitter while they animate
- **Cause-linked error choreography** — the offending field shakes and its message slides in under it; every message is announced through `aria-live`
- **Theme toggle micro-interaction** — icon crossfade, with a View Transitions API cross-fade between palettes where the browser supports it (progressive enhancement)
- **Birthday moment** — calculate your age on your birthday and the result says so
- **Mobile-first inputs** — `inputMode="numeric"` brings up the digit keypad, `autocomplete="bday-*"` fills from contacts, 16px inputs prevent iOS zoom
- **Reduced motion designed in** — with `prefers-reduced-motion`, counts land instantly and all transitions collapse; the static page is the complete page

## Run locally

```bash
git clone https://github.com/Mister2314/CodeAlpha_Age_Calculator.git
cd CodeAlpha_Age_Calculator
npm install
npm run dev
```

## What I learned

Masking each field separately forces the validation logic to live in `input` events rather than a single submit check — errors surface while typing instead of after. The revamp added the flip side: a hand-rolled `requestAnimationFrame` counter is ~30 lines, and not adding an animation library was the design decision that mattered.
