# Realm Website

Static marketing site for Realm — plain HTML, CSS, and a little vanilla JS (no React, no Bootstrap).

## Pages

- `/` — `index.html` — concept, screenshots, downloads, Discord CTA
- `/forum/` — read-only Discord archive via Answer Overflow embed + Realm-branded forum chrome

## Config / links

Edit URLs directly in the HTML files (Discord, GitHub, downloads, Answer Overflow).

## Local preview

Any static server works, for example:

```sh
npx --yes serve -l 3000
```

Then open http://localhost:3000

## Stack

- HTML
- CSS (`css/styles.css`)
- Vanilla JS (`js/forum.js` — channel filter on `/forum/` only)
