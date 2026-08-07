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
