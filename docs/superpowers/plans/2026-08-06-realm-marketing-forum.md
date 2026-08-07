# Realm Marketing Site & Forum Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trim the Realm marketing homepage to five sections and polish `/forum` as a Mode A setup checklist + branded mock (Answer Overflow self-host remains specified, not deployed).

**Architecture:** Keep the existing TanStack Start + Tailwind app. Drive Discord/download/forum-live state from `src/config/site.ts`. Homepage becomes hero → concept → screenshots → download → community. `/forum` defaults to operator checklist + mock threads until `forumLive` is true (production proxy to Answer Overflow is a later AWS cycle).

**Tech Stack:** React 19, TanStack Start/Router, Vite, Tailwind CSS 4, TypeScript, Lucide icons.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-06-realm-marketing-forum-design.md`
- Only two public routes: `/` and `/forum`
- Do **not** label screenshot art as placeholders
- Do **not** provision AWS, Discord, or Answer Overflow in this plan
- No secrets in the repo; links live in `src/config/site.ts`
- Preserve existing Realm visual system (Cinzel/Barlow, ember primary, dark navy background)
- No automated test runner in this repo — verify with `npm run dev` + browser checks listed per task
- Prefer `/usr/bin/git` for commits if `git commit` fails with `unknown option trailer` (old Homebrew git vs Apple git)

## File map

| File | Responsibility |
|---|---|
| `src/config/site.ts` | Site name, links, downloads, `forumLive`, Discord-ready helper |
| `src/components/SiteHeader.tsx` | Nav: brand, Forum, Download only |
| `src/components/SiteFooter.tsx` | Unchanged links (GitHub, Discord, Forum) unless Discord placeholder copy needed |
| `src/routes/index.tsx` | Slim marketing page (5 sections) |
| `src/routes/forum.tsx` | Mode A checklist + mock; Mode B “live / proxy” shell |
| `docs/superpowers/specs/2026-08-06-answer-overflow-branding-tokens.md` | Handoff tokens for later AO fork theming |

---

### Task 1: Site config helpers

**Files:**
- Modify: `src/config/site.ts`
- Delete usage later: hosted `answerOverflowUrl` iframe helper (replace with `forumLive`)

**Interfaces:**
- Produces:
  - `site.forumLive: boolean` (default `false`)
  - `isDiscordConfigured(): boolean` — false when URL still contains `your-invite`
  - `isForumLive(): boolean` — reads `site.forumLive`

- [ ] **Step 1: Replace `src/config/site.ts` with:**

```ts
// Central place to swap in real links once they exist.
export const site = {
  name: "Realm",
  tagline: "Open-source RTS maps and community-driven arcade gameplay.",
  discordUrl: "https://discord.gg/your-invite",
  githubUrl: "https://github.com/speige/Realm",
  websiteRepoUrl: "https://github.com/speige/Realm.Website",
  releasesUrl: "https://github.com/speige/Realm/releases",
  version: "0.0.1 Pre-Alpha",
  downloads: {
    windows:
      "https://github.com/speige/Realm/releases/download/0.0.1_Pre-Alpha_rev2/Realm-Godot-Windows-x64_0.0.1_Pre-Alpha.7z",
  },
  /**
   * When true, /forum shows the "live archive" shell.
   * In production, a reverse proxy will serve Answer Overflow at /forum;
   * this flag is for cutover messaging in the marketing app.
   */
  forumLive: false,
} as const;

/** False while the Discord invite is still the scaffold placeholder. */
export function isDiscordConfigured(): boolean {
  return !site.discordUrl.includes("your-invite");
}

export function isForumLive(): boolean {
  return site.forumLive === true;
}
```

- [ ] **Step 2: Verify TypeScript still resolves the module**

Run: `npx tsc --noEmit 2>&1 | head -40`  
Expected: errors only from files still importing `answerOverflowUrl` / `answerOverflowCommunity` (fixed in Task 4), or clean if nothing else imports them yet.

- [ ] **Step 3: Commit**

```bash
/usr/bin/git add src/config/site.ts
/usr/bin/git commit -m "config: add forumLive and Discord invite helpers"
```

---

### Task 2: Slim the site header nav

**Files:**
- Modify: `src/components/SiteHeader.tsx`

**Interfaces:**
- Consumes: `site` from `@/config/site`
- Produces: nav with brand → `/`, Forum → `/forum`, Download → `/#download` only

- [ ] **Step 1: Observe current nav**

Run: `npm run dev`  
Open `http://localhost:3000` (or the port Vite prints).  
Expected: header shows Arcade, Modding (sm+), Forum, Download.

- [ ] **Step 2: Replace `SiteHeader` with:**

```tsx
import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="font-display text-lg font-bold tracking-[0.22em] uppercase">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/forum" className="transition-colors hover:text-foreground">
            Forum
          </Link>
          <a
            href="/#download"
            className="rounded-sm border border-primary/60 px-3 py-1.5 text-primary transition-colors hover:bg-primary/10"
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify in browser**

Reload home.  
Expected: Arcade and Modding gone; Forum + Download remain; brand links home.

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/components/SiteHeader.tsx
/usr/bin/git commit -m "nav: keep only Forum and Download links"
```

---

### Task 3: Trim homepage to five sections

**Files:**
- Modify: `src/routes/index.tsx` (full rewrite of the page body)

**Interfaces:**
- Consumes: `site`, `isDiscordConfigured` from `@/config/site`; assets under `src/assets/`
- Produces: sections `#concept`, screenshots (no placeholder label), `#download`, community CTAs

- [ ] **Step 1: Replace `src/routes/index.tsx` with:**

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, Monitor, Terminal } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { isDiscordConfigured, site } from "@/config/site";
import heroBattle from "@/assets/hero-battle.jpg";
import arcadeTd from "@/assets/arcade-td.jpg";
import arcadeArena from "@/assets/arcade-arena.jpg";
import editorShot from "@/assets/editor.jpg";

const title = `Realm — Open-source RTS engine built for custom maps`;
const description =
  "Realm is an open-source real-time strategy engine built around an Arcade of player-made mini-games and maps. Download the pre-alpha, join Discord, and build your own.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

const screenshots = [
  {
    src: arcadeTd,
    alt: "Tower defense Arcade map with creep lanes and rune towers",
  },
  {
    src: arcadeArena,
    alt: "Chaos Arena free-for-all battle on an isometric map",
  },
  {
    src: editorShot,
    alt: "Realm map editor with terrain tools and trigger graph",
  },
];

function Index() {
  const discordReady = isDiscordConfigured();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <img
            src={heroBattle}
            alt={`${site.name} gameplay: armies clashing on an isometric battlefield`}
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-veil)" }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-5 pt-24 pb-28 sm:pt-36 sm:pb-40">
            <p className="rule-heading">
              <span className="h-px w-10 bg-accent/60" /> {site.version} · MIT licensed
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] font-black sm:text-7xl">
              {site.name}
            </h1>
            <p className="mt-4 max-w-2xl text-2xl font-semibold text-foreground/90 sm:text-3xl">
              Command an army.{" "}
              <span className="text-gradient-ember">Then build the map.</span>
            </p>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{description}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#download"
                className="rounded-sm px-7 py-3.5 font-semibold text-primary-foreground"
                style={{
                  backgroundImage: "var(--gradient-ember)",
                  boxShadow: "var(--shadow-ember)",
                }}
              >
                Download pre-alpha
              </a>
              <a
                href={site.githubUrl}
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-card/70 px-7 py-3.5 font-semibold transition-colors hover:border-accent/60"
              >
                <Github className="h-4 w-4" /> Source on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Concept */}
        <section id="concept" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <p className="rule-heading">
            <span className="h-px w-10 bg-accent/60" /> The idea
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-black sm:text-5xl">
            An open-source RTS built for the Arcade
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Inspired by classic Warcraft and StarCraft custom maps: play quick arcade-style
            matches, then publish your own mini-games for others to host. Maps travel with the
            lobby — no storefront gatekeeper. The engine and editor are MIT-licensed so creators
            can fork, mod, and ship.
          </p>
        </section>

        {/* Screenshots */}
        <section className="mx-auto max-w-6xl px-5 pb-8">
          <p className="rule-heading">
            <span className="h-px w-10 bg-accent/60" /> Beta look
          </p>
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">In-game and in the editor</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {screenshots.map((shot) => (
              <img
                key={shot.alt}
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                width={1024}
                height={768}
                className="panel h-48 w-full rounded-sm object-cover sm:h-56"
              />
            ))}
          </div>
        </section>

        {/* Download */}
        <section id="download" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="panel rounded-sm p-8 sm:p-12">
            <p className="rule-heading">
              <span className="h-px w-10 bg-accent/60" /> Download
            </p>
            <h2 className="mt-5 text-4xl font-black">Play the pre-alpha</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Free and unfinished. Expect rough edges — bug reports in Discord help a lot.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {site.downloads.windows ? (
                <a
                  href={site.downloads.windows}
                  className="flex items-center gap-4 rounded-sm border border-border bg-background/60 p-5 transition-colors hover:border-primary/70"
                >
                  <Monitor className="h-6 w-6 text-primary" />
                  <span>
                    <span className="block font-semibold">Windows x64</span>
                    <span className="block text-xs text-muted-foreground">
                      {site.version} · .7z archive
                    </span>
                  </span>
                </a>
              ) : null}
              <a
                href={site.githubUrl}
                className="flex items-center gap-4 rounded-sm border border-border bg-background/60 p-5 transition-colors hover:border-primary/70"
              >
                <Terminal className="h-6 w-6 text-primary" />
                <span>
                  <span className="block font-semibold">Build from source</span>
                  <span className="block text-xs text-muted-foreground">
                    Clone recursively, then build
                  </span>
                </span>
              </a>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              macOS and Linux builds aren&apos;t published yet.{" "}
              <a href={site.releasesUrl} className="text-primary underline-offset-4 hover:underline">
                All releases on GitHub
              </a>
              .
            </p>
          </div>
        </section>

        {/* Community */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="flex flex-col gap-6 rounded-sm border border-accent/30 bg-accent/5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-black">Build with the community</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Creators discuss maps and mods in Discord. Public help threads will be mirrored
                read-only on the forum.
              </p>
              {!discordReady ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Discord invite not set yet — update <code className="text-foreground">discordUrl</code>{" "}
                  in <code className="text-foreground">src/config/site.ts</code>.
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              {discordReady ? (
                <a
                  href={site.discordUrl}
                  className="rounded-sm px-6 py-3 font-semibold text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-ember)" }}
                >
                  Join Discord
                </a>
              ) : (
                <span
                  className="cursor-not-allowed rounded-sm px-6 py-3 font-semibold text-primary-foreground/70 opacity-60"
                  style={{ backgroundImage: "var(--gradient-ember)" }}
                  title="Set discordUrl in site.ts"
                >
                  Join Discord
                </span>
              )}
              <Link
                to="/forum"
                className="rounded-sm border border-border bg-card px-6 py-3 font-semibold transition-colors hover:border-accent/60"
              >
                Browse the forum
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Reload `/`.  
Expected:
- Brand **Realm** is prominent in the hero
- No three-pillar grid
- No separate Arcade / Editor marketing sections
- Three screenshot images with **no** “Placeholder art” caption
- Download + community sections present
- Join Discord is disabled-looking with config hint while invite is placeholder

- [ ] **Step 3: Commit**

```bash
/usr/bin/git add src/routes/index.tsx
/usr/bin/git commit -m "home: trim marketing page to five sections"
```

---

### Task 4: Forum Mode A checklist + branded mock

**Files:**
- Modify: `src/routes/forum.tsx` (full rewrite)

**Interfaces:**
- Consumes: `site`, `isDiscordConfigured`, `isForumLive` from `@/config/site`
- Produces: Mode A (default) checklist + mock cards; Mode B live shell when `forumLive`

- [ ] **Step 1: Replace `src/routes/forum.tsx` with:**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { isDiscordConfigured, isForumLive, site } from "@/config/site";

const title = `Forum — ${site.name} community archive`;
const description = `A read-only, searchable mirror of the ${site.name} Discord: modding help, Arcade feedback and beta bug reports.`;

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ForumPage,
});

const setupSteps = [
  {
    title: "Create or obtain the Discord server",
    body: "If the community Discord does not exist yet, create it (or ask your supervisor for the invite). Put the invite URL in src/config/site.ts as discordUrl.",
  },
  {
    title: "Invite the Answer Overflow bot",
    body: "Add the bot from answeroverflow.com/onboarding (Manage Server permission). Index help, modding, and bug channels only — not every channel.",
  },
  {
    title: "Enable consent / read-the-rules",
    body: "Complete Answer Overflow account consent steps so member messages can appear on the public archive.",
  },
  {
    title: "Deploy the Answer Overflow fork (later)",
    body: "Self-host the AO web app + bot with Realm theme tokens (see docs/superpowers/specs/2026-08-06-answer-overflow-branding-tokens.md). Reverse-proxy yoursite.com/forum to that app.",
  },
  {
    title: "Flip forumLive in site config",
    body: "Set forumLive to true in src/config/site.ts when the proxy is ready so this shell shows the live cutover state.",
  },
];

const mockThreads = [
  {
    channel: "#modding-help",
    q: "How do I make a trigger fire once per wave?",
    meta: "12 replies · answered",
  },
  {
    channel: "#arcade-feedback",
    q: "Rune Defense wave 18 difficulty spike",
    meta: "7 replies · open",
  },
  {
    channel: "#beta-bugs",
    q: "Editor crashes on hot reload with 4k terrain",
    meta: "3 replies · fixed in v0.4.2",
  },
];

function ForumPage() {
  const live = isForumLive();
  const discordReady = isDiscordConfigured();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p className="rule-heading">
          <span className="h-px w-10 bg-accent/60" /> Community archive
        </p>
        <h1 className="mt-5 text-4xl font-black sm:text-5xl">Forum</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Reading happens here. Posting happens in{" "}
          {discordReady ? (
            <a href={site.discordUrl} className="text-primary underline-offset-4 hover:underline">
              Discord
            </a>
          ) : (
            <span>Discord (invite not configured yet)</span>
          )}
          .
        </p>

        {live ? <ForumLiveShell discordReady={discordReady} /> : <ForumSetupShell />}
      </main>
      <SiteFooter />
    </div>
  );
}

function ForumLiveShell({ discordReady }: { discordReady: boolean }) {
  return (
    <div className="panel mt-10 rounded-sm p-8">
      <div className="flex items-center gap-3">
        <MessagesSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Archive is marked live</h2>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        In production, a reverse proxy should serve the branded Answer Overflow app at{" "}
        <code className="text-foreground">/forum</code>. If you still see this marketing shell,
        the proxy is not routing yet — check AWS / edge config in the follow-up deploy cycle.
      </p>
      {discordReady ? (
        <a
          href={site.discordUrl}
          className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          Meanwhile, join the Discord
        </a>
      ) : null}
    </div>
  );
}

function ForumSetupShell() {
  return (
    <>
      <div className="panel mt-10 rounded-sm p-8">
        <div className="flex items-center gap-3">
          <MessagesSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Mirror not connected yet</h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          This page will become a read-only Discord snapshot via{" "}
          <a
            href="https://github.com/AnswerOverflow/AnswerOverflow"
            className="text-primary underline-offset-4 hover:underline"
          >
            Answer Overflow
          </a>
          . Follow these steps when you have Discord access:
        </p>
        <ol className="mt-6 space-y-4">
          {setupSteps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-primary/50 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="block text-sm text-muted-foreground">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-black">What the archive will look like</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {mockThreads.map((t) => (
            <article key={t.q} className="panel rounded-sm p-5">
              <p className="text-xs tracking-widest text-accent uppercase">{t.channel}</p>
              <h3 className="mt-2 font-semibold">{t.q}</h3>
              <p className="mt-3 text-xs text-muted-foreground">{t.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify Mode A**

Open `/forum` with `forumLive: false`.  
Expected: five setup steps (Discord → bot → consent → deploy/proxy → flip flag); three branded mock cards; **no** Answer Overflow iframe; **no** “example threads / placeholder” disclaimer line.

- [ ] **Step 3: Spot-check Mode B**

Temporarily set `forumLive: true`, reload `/forum`, confirm live shell copy appears, then set it back to `false` before committing.

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/routes/forum.tsx src/config/site.ts
/usr/bin/git commit -m "forum: setup checklist and branded mock for Mode A"
```

---

### Task 5: Answer Overflow branding handoff doc

**Files:**
- Create: `docs/superpowers/specs/2026-08-06-answer-overflow-branding-tokens.md`

**Interfaces:**
- Produces: exact token values for a future AO fork theme (no AO code in this cycle)

- [ ] **Step 1: Create the handoff doc**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
/usr/bin/git add docs/superpowers/specs/2026-08-06-answer-overflow-branding-tokens.md
/usr/bin/git commit -m "docs: Answer Overflow Realm branding token handoff"
```

---

### Task 6: Smoke-check + README touch-up

**Files:**
- Modify: `README.md` (short description of pages + config)

- [ ] **Step 1: Update `README.md` to:**

````markdown
# Realm Website

Marketing site for Realm — an open-source RTS engine focused on quick Arcade matches and community maps.

## Pages

- `/` — concept, screenshots, downloads, Discord/forum CTAs
- `/forum` — Answer Overflow setup checklist + branded mock until the self-hosted archive is proxied live

## Config

Edit `src/config/site.ts` for Discord invite, download URLs, version, and `forumLive`.

## Development

```sh
npm install
npm run dev
```

## Built with

- React
- TanStack Start
- Vite
- Tailwind CSS
````

- [ ] **Step 2: Final browser smoke check**

Run: `npm run dev`  
Check:
- `/` — five sections only; Realm brand in hero; downloads work; Discord CTA respects placeholder
- `/forum` — checklist + mock
- Header: Forum + Download only
- Footer: GitHub / Discord / Forum still present

- [ ] **Step 3: Commit**

```bash
/usr/bin/git add README.md
/usr/bin/git commit -m "docs: align README with slim marketing site"
```

---

## Out of scope (do not implement in this plan)

- AWS / DNS / TLS / reverse proxy
- Forking or deploying Answer Overflow
- Creating the production Discord server
- Hosted answeroverflow.com iframe integration

---

## Spec coverage checklist (plan self-review)

| Spec requirement | Task |
|---|---|
| Slim `/` (hero, concept, screenshots, download, community) | Task 3 |
| No placeholder labels on screenshots | Task 3 |
| Drop pillars / heavy Arcade / Editor sections | Task 3 |
| Nav: Forum + Download only | Task 2 |
| `/forum` Mode A checklist + branded mock | Task 4 |
| Mode B live / proxy messaging | Task 4 |
| Config in `site.ts` (`forumLive`, Discord) | Task 1 |
| AO branding specified for later | Task 5 |
| AWS / AO deploy deferred | Out of scope section |
