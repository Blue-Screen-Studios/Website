export interface Game {
  slug: string;
  title: string;
  /** When set, the game page is built from this app's store data in src/data/steam/<appId>.json. */
  steamAppId?: number;
}

export interface Software {
  slug: string;
  title: string;
  description: string;
  platform: string;
}

// Listed in this order on the Games page.
export const games: Game[] = [
  { slug: "drain-the-swamp", title: "Drain the Swamp!" },
  { slug: "orbital-physics-simulator", title: "Orbital Physics Simulator", steamAppId: 4798040 },
  { slug: "hextek", title: "HexTek" },
];

export const software: Software[] = [
  {
    slug: "aviation-weather",
    title: "Aviation Weather",
    description: "METARs, TAFs, and route weather in one readable view for pilots.",
    platform: "Web",
  },
];
