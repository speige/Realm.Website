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
                  Discord invite not set yet — update{" "}
                  <code className="text-foreground">discordUrl</code> in{" "}
                  <code className="text-foreground">src/config/site.ts</code>.
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
