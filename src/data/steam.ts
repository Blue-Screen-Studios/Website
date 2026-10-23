import type { GameDetails } from "./gameTypes";

// Hardcoded store data; a game without a file here just has no Steam page.
const files = import.meta.glob<GameDetails>("./steam/*.json", { eager: true, import: "default" });

export function getSteamApp(appId: number): GameDetails | undefined {
  return files[`./steam/${appId}.json`];
}
