# Answer Overflow Realm Branding Tokens

**Date:** 2026-08-06  
**Use when:** Theming a self-hosted Answer Overflow fork to match Realm.Website  
**Source of truth for live site:** `src/styles.css` `:root` block

## Fonts

- Display / headings: `"Cinzel", serif` (weights 500, 700, 900)
- Body: `"Barlow", sans-serif` (weights 400–700)
- Google Fonts URL used by the marketing site:
  `https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Barlow:wght@400;500;600;700&display=swap`

## Colors (oklch)

| Token | Value | Role |
|---|---|---|
| background | `oklch(0.17 0.018 250)` | Page background |
| foreground | `oklch(0.93 0.012 90)` | Primary text |
| card | `oklch(0.215 0.021 252)` | Panels / thread surfaces |
| primary | `oklch(0.72 0.17 55)` | Ember CTA / accents |
| primary-foreground | `oklch(0.17 0.03 50)` | Text on ember |
| accent | `oklch(0.78 0.12 195)` | Cyan secondary accent |
| muted-foreground | `oklch(0.68 0.02 250)` | Secondary text |
| border | match site border token in `src/styles.css` | Hairlines |

## Radius & chrome

- Prefer small radius (`--radius: 0.25rem`) — squared panels, not pills
- Marketing header uses sticky bar + `backdrop-blur`; AO can use a simpler top bar with the wordmark **REALM** in Cinzel uppercase tracking

## Scope

- Thin theme overlay only — do not rewrite Answer Overflow UX
- Public path remains `/forum` via reverse proxy (AWS follow-up)
