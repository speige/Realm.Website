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
  return site.forumLive;
}
