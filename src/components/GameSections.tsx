import { Link } from "react-router-dom";
import { games, type Game } from "../data/catalog";
import { getGameDetails } from "../data/gameDetails";
import type { GameDetails } from "../data/gameTypes";

function statusLabel(details: GameDetails | undefined) {
  if (!details) return "In development";
  if (details.comingSoon) return "Coming soon";
  return details.isFree ? "Free to Play" : "Out now";
}

/** One full-width section per game, in catalog order. */
export default function GameSections() {
  return (
    <>
      {games.map((game, i) => (
        <GameSection key={game.slug} game={game} index={i} />
      ))}
    </>
  );
}

function GameSection({ game, index }: { game: Game; index: number }) {
  const details = getGameDetails(game);
  const artFirst = index % 2 === 1;
  const href = `/games/${game.slug}`;

  return (
    <section className="relative isolate overflow-hidden border-t border-bss-800 bg-bss-900">
      {details?.background && (
        <>
          <img src={details.background} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
          {/* Darkest behind the text so it stays readable over any backdrop */}
          <div
            className={`absolute inset-0 -z-10 from-bss-950 via-bss-950/85 to-bss-950/55 ${
              artFirst ? "bg-gradient-to-l" : "bg-gradient-to-r"
            }`}
          />
        </>
      )}

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <Link to={href} className={`group block ${artFirst ? "" : "lg:order-2"}`} tabIndex={-1} aria-hidden="true">
          {details ? (
            <img
              src={details.headerImage}
              alt=""
              loading="lazy"
              className="w-full border border-bss-700 shadow-2xl shadow-black/50 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex aspect-[920/430] items-center justify-center border border-dashed border-bss-600 bg-bss-950/60">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-bss-400">Title art coming soon</span>
            </div>
          )}
        </Link>

        <div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-bss-400">{String(index + 1).padStart(2, "0")}</span>
            <span className="rounded-sm border border-bss-500 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-bss-100">
              {statusLabel(details)}
            </span>
          </div>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{game.title}</h2>
          {details?.shortDescription && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-bss-200">{details.shortDescription}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={href}
              className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              View {game.title}
            </Link>
            {details?.storeUrl ? (
              <a
                href={details.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-bss-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Get it on Steam
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Not available on Steam yet"
                className="cursor-not-allowed rounded-sm border border-bss-700 px-6 py-3 text-sm font-semibold text-bss-500"
              >
                Get it on Steam
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
