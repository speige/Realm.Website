# Realm Marketing Site & Forum Mirror — Design

**Date:** 2026-08-06  
**Status:** Approved for implementation planning  
**Repo:** Realm.Website  

## Summary

Ship a small marketing website for **Realm** (open-source RTS / Arcade of player-made mini-games) with:

1. A single marketing page (`/`) explaining the game and linking to downloads + Discord  
2. A `/forum` page that becomes a **read-only Discord archive** via a **self-hosted Answer Overflow** fork with Realm branding  

**In this cycle:** implement/trim the marketing site; make `/forum` a setup checklist + branded mock until the mirror is live; **specify** the Answer Overflow self-host + `/forum` proxy architecture.  

**Deferred:** AWS server provisioning, production Discord creation, live AO deploy (follow-up cycle).

---

## Goals

| Goal | Success looks like |
|---|---|
| Explain the game | Visitor understands Realm is an open-source RTS built around a player Arcade |
| Downloads | Clear links to Windows build and/or GitHub releases/source |
| Community | Discord CTA works once invite is in config |
| Forum | `/forum` is useful before AO exists (checklist + mock); later serves branded read-only Discord under the same path |
| Branding | Forum UI matches Realm visual tokens when AO is forked/themed |

## Non-goals (this cycle)

- AWS account setup, EC2/ECS/ALB, DNS, TLS certificates  
- Creating the production Discord server (document steps only)  
- Deploying Answer Overflow to production  
- Custom Discord scraper or home-grown forum  
- Extra marketing pages beyond `/` and `/forum`  
- Labeling screenshot art as “placeholders”

---

## Chosen approach

**Slim TanStack marketing site + Answer Overflow fork behind `/forum`.**

Rejected alternatives:

- Hosted answeroverflow.com only — insufficient custom CSS control  
- Custom Discord API forum UI — reinventing Answer Overflow  

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Public site (later: AWS + reverse proxy)                   │
│                                                             │
│  /           →  Realm.Website (TanStack Start)              │
│  /forum/*    →  Answer Overflow fork (Next.js)  [later]     │
│                 until then: Realm.Website /forum shell      │
└─────────────────────────────────────────────────────────────┘
         │                              ▲
         │ links                        │ indexes threads
         ▼                              │
   Discord server  ──►  Answer Overflow Discord bot  ──►  Convex
```

| Component | Responsibility |
|---|---|
| **Realm.Website** | Marketing `/`; `/forum` shell (checklist + mock, then proxy target) |
| **Answer Overflow fork** | Bot, indexed read-only UI, Realm theme/CSS |
| **Reverse proxy (later)** | Map `yoursite.com/forum` → AO app |
| **site.ts config** | Discord invite, GitHub, downloads, version, forum live flag / community id |

**Note:** Upstream Answer Overflow deploy docs target **Vercel + Convex**. AWS may host the marketing site and proxy `/forum`; where AO itself runs can be decided in the AWS follow-up as long as the public URL remains `yoursite.com/forum`.

---

## Pages & UI

### `/` — Marketing (only product page)

Keep existing Realm visual system (dark ember aesthetic, header/footer, fonts, CSS variables).

**Sections (in order):**

1. **Hero** — brand-forward name, one headline, short supporting sentence, CTAs (Download + GitHub)  
2. **Concept** — short explanation: open-source RTS + Arcade of community mini-games/maps  
3. **Screenshots** — keep current images; do **not** add placeholder labels  
4. **Download** — Windows package + build from source / releases link  
5. **Community** — Join Discord + Browse forum  

**Remove / fold:**

- Three-pillar feature grid  
- Separate heavy Arcade card section and separate Editor section  
- Any must-keep line about Arcade or modding goes into **Concept** (one short block)

Nav: drop Arcade and Modding links. Keep **Forum** and **Download** (plus brand home link). Optional in-page `#concept` / `#download` anchors only if useful — not separate product pages.

### `/forum` — Archive shell

Same SiteHeader / SiteFooter.

**Mode A — Not live** (default until config says otherwise):

- Short intro: read-only Discord mirror; posting happens in Discord  
- Numbered **setup checklist** for the operator:
  1. Create Discord server (or obtain invite from supervisor)  
  2. Invite [Answer Overflow](https://github.com/AnswerOverflow/AnswerOverflow) bot; enable indexing on help/modding channels  
  3. Complete AO consent / rules requirements  
  4. (Later) Deploy AO fork with Realm theme; enable proxy  
  5. Set community / `forumLive` in `src/config/site.ts`  
- **Branded mock** thread cards (Realm panel styling) showing what the archive will look like  

**Mode B — Live** (after proxy + AO):

- `/forum` served by AO (or proxied into the path)  
- Realm branding applied in the AO fork theme  
- Marketing CTAs still point here  

Config lives in `src/config/site.ts` (Discord URL, downloads, `answerOverflowCommunity` / live flag). No secrets in the repo.

---

## Answer Overflow & branding

### Operator setup (human)

Documented on `/forum` Mode A and in this spec. Discord may not exist yet; the checklist is the deliverable until it does.

### Self-host (specified now, implemented later)

1. Fork or vendor Answer Overflow  
2. Theme via Tailwind / CSS variables aligned to Realm (`--background`, `--primary` ember, `--accent`, display/body fonts, logo)  
3. Prefer a thin theme overlay — do not rewrite AO UX  
4. Run bot + web + Convex per upstream docs  
5. Reverse-proxy `yoursite.com/forum` → AO so the forum feels on-site  

### Data flow

Discord messages (selected channels) → AO bot → Convex → AO read-only web UI.  
Realm.Website does **not** call the Discord API for forum content.

---

## Error & empty states

| Condition | Behavior |
|---|---|
| Discord invite still placeholder | Checklist usable; Discord CTA uses config or “ask admin for invite” copy |
| AO not live | Mode A: checklist + mock (never blank) |
| AO / proxy down (later) | Simple unavailable message + link to Discord |
| Missing download URL | Hide or disable that download row rather than 404 silently |

---

## Testing (this cycle)

Manual verification:

- `/` shows trimmed sections only; links resolve from `site.ts`  
- Header/footer nav work on `/` and `/forum`  
- `/forum` shows checklist + branded mock when not live  
- Toggling live config (when implemented) switches Mode A → Mode B expectation  

Out of scope until Discord/AO exist: end-to-end indexing, search, consent flows.

---

## Implementation boundaries

| Work | Owner cycle |
|---|---|
| Trim `/`, polish `/forum` Mode A, config cleanup | **This cycle** |
| Design doc + implementation plan | **This cycle** |
| AO fork theme CSS | Spec now; code when AO repo/host ready |
| AWS, DNS, TLS, proxy | **Follow-up** |
| Production Discord + bot invite | Human (supervisor/student) using `/forum` checklist |

---

## Open decisions (non-blocking)

- Final production domain name  
- Whether AO runs on Vercel/Convex vs AWS-adjacent hosting (public path still `/forum`)  
- Exact Discord channel list to index (default: help / modding / bugs-style channels only)
