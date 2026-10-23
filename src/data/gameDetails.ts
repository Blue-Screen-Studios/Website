import type { Game } from "./catalog";
import type { GameDetails } from "./gameTypes";
import { getSteamApp } from "./steam";
import drainTheSwamp from "./games/drainTheSwamp";

// Hand-written details for games without a Steam page yet, keyed by slug.
const local: Record<string, GameDetails> = {
  "drain-the-swamp": drainTheSwamp,
};

export function getGameDetails(game: Game): GameDetails | undefined {
  return local[game.slug] ?? (game.steamAppId ? getSteamApp(game.steamAppId) : undefined);
}
