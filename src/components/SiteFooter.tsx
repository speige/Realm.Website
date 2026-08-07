import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display tracking-[0.22em] uppercase">{site.name}</p>
        <div className="flex flex-wrap gap-5">
          <a href={site.githubUrl} className="transition-colors hover:text-foreground">
            GitHub
          </a>
          <a href={site.discordUrl} className="transition-colors hover:text-foreground">
            Discord
          </a>
          <Link to="/forum" className="transition-colors hover:text-foreground">
            Forum
          </Link>
        </div>
        <p>MIT licensed. Built with its community.</p>
      </div>
    </footer>
  );
}