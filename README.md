# Realm Website

Static marketing site for Realm — plain HTML, CSS, and a little vanilla JS (no React, no Bootstrap).

## Pages

- `/` — `index.html` — concept, screenshots, downloads, Discord CTA
- `/forum/` — read-only Discord archive via Answer Overflow embed + Realm-branded forum chrome

## Config / links

Edit URLs directly in the HTML files (Discord, GitHub, downloads, Answer Overflow).

## Local preview

Marketing site and Answer Overflow both default to port 3000 — don’t run them on the same port.

**Marketing site** (this folder):

```sh
npx --yes serve -l 5173
```

Then open http://localhost:5173 and http://localhost:5173/forum/

**Answer Overflow** lives in `AnswerOverflow/` in this same repo (not a submodule). Keep `bun dev` running there so the `/forum/` iframe can load http://localhost:3000

## Stack

- HTML
- CSS (`css/styles.css`)
- Vanilla JS (`js/forum.js` — channel filter on `/forum/` only)
