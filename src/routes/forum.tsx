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
