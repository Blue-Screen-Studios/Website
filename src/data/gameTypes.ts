// Everything a game page shows. Released games get this from a hardcoded, trimmed copy of their
// Steam store data (src/data/steam/<appId>.json); unreleased ones are written by hand (src/data/games/).

export type TextBlock = { type: "heading"; text: string } | { type: "paragraph"; text: string } | { type: "list"; items: string[] };

export interface RequirementRow {
  label: string | null;
  value: string;
}

export interface PlatformRequirements {
  minimum: RequirementRow[];
  recommended: RequirementRow[];
}

export interface GameDetails {
  appId?: number;
  name: string;
  /** Steam store page; when missing, the page links to the Discord instead. */
  storeUrl?: string;
  shortDescription: string;
  about: TextBlock[];
  releaseDate: string;
  comingSoon: boolean;
  price: string | null;
  isFree: boolean;
  platforms: string[];
  genres: string[];
  features: string[];
  languages: string;
  headerImage: string;
  background: string | null;
  screenshots: { thumb: string; full: string }[];
  trailer: { hls: string; poster: string } | null;
  achievements: { total: number; highlighted: { name: string; icon: string }[] };
  requirements: Partial<Record<"Windows" | "macOS" | "Linux", PlatformRequirements>>;
  fetchedAt?: string;
}
