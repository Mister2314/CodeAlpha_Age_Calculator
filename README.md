<h1 align="center">Age Calculator</h1>

<p align="center"><b>Calculates an exact age in years, months and days, with input masking and a persisted light / dark theme.</b></p>

<p align="center">
<a href="https://mister2314.github.io/CodeAlpha_Age_Calculator/"><img src="https://img.shields.io/badge/Live_Demo-2ea44f?style=flat-square&logo=vercel&logoColor=white" alt="Live demo" height="28"></a>
<img src="https://img.shields.io/badge/HTML5-e34f26?style=flat-square" alt="HTML5" height="20">
<img src="https://img.shields.io/badge/CSS3-1572b6?style=flat-square" alt="CSS3" height="20">
<img src="https://img.shields.io/badge/Vanilla_JS-f7df1e?style=flat-square" alt="Vanilla JS" height="20">
</p>

<p align="center"><a href="https://mister2314.github.io/CodeAlpha_Age_Calculator/"><b>Live demo</b></a> &nbsp;·&nbsp; <a href="#quick-start">Quick start</a> &nbsp;·&nbsp; <a href="#features">Features</a> &nbsp;·&nbsp; <a href="#architecture">Architecture</a> &nbsp;·&nbsp; <a href="#faq">FAQ</a></p>

<p align="center">
  <a href="https://mister2314.github.io/CodeAlpha_Age_Calculator/">
    <img src="docs/demo.gif" alt="Age Calculator — animated demo" width="88%">
  </a>
</p>

<p align="center"><sub>Live capture of the real build — 52 KB, loops forever.</sub></p>

## Overview

Enter a date of birth as three separate day / month / year fields and get back an exact age — not just a number of years, but the years, months and days that have passed, plus the total in months, weeks and days.

The three-field layout is deliberate: a single date input hands the browser's own picker the job, whereas separate fields let me mask and validate the input as it is typed. Non-digits are stripped on the fly and out-of-range values are clamped, so an impossible date cannot be submitted.

Built as a front-end task during the CodeAlpha internship programme.

## At a glance

| Field | Detail |
| --- | --- |
| **Type** | Static site — no build step |
| **Primary language** | JavaScript |
| **Live demo** | [mister2314.github.io/CodeAlpha_Age_Calculator](https://mister2314.github.io/CodeAlpha_Age_Calculator/) |
| **Repository** | [Mister2314/CodeAlpha_Age_Calculator](https://github.com/Mister2314/CodeAlpha_Age_Calculator) |

## Features

- Exact age broken down into years, months and days
- Totals in months, weeks and days
- Per-field input masking — non-digits are stripped as you type
- Range clamping for day (1–31) and month (1–12)
- Light / dark theme toggle with inline SVG icons, persisted to `localStorage`
- Responsive layout with the Noto Sans typeface

## Tech Stack

| Layer | Technology |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3, custom-property themes |
| Logic | Vanilla JavaScript (`DOMContentLoaded`, `localStorage`) |
| Deploy | GitHub Pages |

## Architecture

```mermaid
flowchart LR
  A["DD / MM / YYYY<br/>three fields"] --> B["Input masking<br/>strip non-digits"]
  B --> C["Range clamp<br/>day 1–31 · month 1–12"]
  C --> D["Date difference"]
  D --> E["Years · months · days"]
  D --> F["Totals in months · weeks · days"]
```

## Screenshots

| Desktop | Mobile |
| :---: | :---: |
| <img src="docs/preview.png" alt="Desktop view"> | <img src="docs/preview-mobile.png" alt="Mobile view" width="230"> |

## Quick Start

```bash
git clone https://github.com/Mister2314/CodeAlpha_Age_Calculator.git
cd CodeAlpha_Age_Calculator

# open it directly
start index.html      # Windows
open  index.html      # macOS

# or serve the folder
npx serve .
```

## Project Structure

```
index.html — date fields, theme toggle and result panel
assets/js/index.js — input masking, validation, date maths, theme persistence
assets/css/style.css — layout and both palettes
```

## FAQ

<details>
<summary><b>Why three separate fields instead of one date input?</b></summary>

A single date input hands control to the browser's own picker. Separate fields let the input be masked and clamped as it is typed, so an impossible date cannot be submitted.

</details>

<details>
<summary><b>Is the theme remembered?</b></summary>

Yes — the choice is written to `localStorage` and restored on load.

</details>

## Roadmap

- [ ] Add a leap-year edge-case test
- [ ] Add a countdown to the next birthday
- [ ] Support the Azerbaijani date format

## Notes

Task completed during the **CodeAlpha** front-end internship programme.

## Author

**Xəyal Hüseynli** — Junior Front-End Developer

[Portfolio](https://hypnosdev.vercel.app) · [GitHub](https://github.com/Mister2314) · [LinkedIn](https://www.linkedin.com/in/x%C9%99yal-h%C3%BCseynli-3487b91ba/) · [xeyalhuseynli06@gmail.com](mailto:xeyalhuseynli06@gmail.com)
