import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Game } from "../data/catalog";
import { getGameDetails } from "../data/gameDetails";
import type { PlatformRequirements, GameDetails, TextBlock } from "../data/gameTypes";
import PlaceholderPage from "./PlaceholderPage";

export default function GamePage({ game }: { game: Game }) {
  const app = getGameDetails(game);
  if (!app) return <PlaceholderPage eyebrow="Games" title={game.title} />;

  return (
    <>
      <GameHero app={app} />
      <MediaSection app={app} />
      <AboutSection app={app} />
      <RequirementsSection app={app} />
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">{children}</p>;
}

// Every game page shows the same sections; anything not announced yet reads as TBA.
const TBA = "TBA";

function Pending({ children = "To be announced." }: { children?: React.ReactNode }) {
  return <p className="mt-4 text-sm text-bss-400">{children}</p>;
}

function priceLabel(app: GameDetails) {
  if (app.comingSoon) return "Coming soon";
  if (app.isFree) return "Free to Play";
  return app.price ?? "See Steam";
}

const ctaClass =
  "mt-10 inline-block rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover";

function GameHero({ app }: { app: GameDetails }) {
  return (
    <section className="relative isolate overflow-hidden bg-bss-950">
      {app.background && <img src={app.background} alt="" className="absolute inset-0 -z-20 size-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bss-950 via-bss-950/90 to-bss-950/60" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <Link to="/" className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft hover:text-white">
            ← Games
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">{app.name}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bss-200">{app.shortDescription}</p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {[
              [app.comingSoon ? "Status" : "Price", priceLabel(app)],
              ["Released", app.releaseDate],
              ["Platforms", app.platforms.join(", ")],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-xs uppercase tracking-wider text-bss-400">{label}</dt>
                <dd className="mt-1 font-medium text-white">{value || TBA}</dd>
              </div>
            ))}
          </dl>

          {app.storeUrl ? (
            <a href={app.storeUrl} target="_blank" rel="noopener noreferrer" className={ctaClass}>
              {app.isFree ? "Play free on Steam" : "View on Steam"}
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Not available on Steam yet"
              className="mt-10 inline-block cursor-not-allowed rounded-sm border border-bss-700 px-6 py-3 text-sm font-semibold text-bss-500"
            >
              Get it on Steam
            </button>
          )}
        </div>

        <img
          src={app.headerImage}
          alt={`${app.name} key art`}
          className="w-full border border-bss-700 shadow-2xl shadow-black/50"
        />
      </div>
    </section>
  );
}

function MediaSection({ app }: { app: GameDetails }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="border-t border-bss-800 bg-bss-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Eyebrow>Media</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Trailer &amp; screenshots</h2>

        {app.trailer ? (
          <Trailer src={app.trailer.hls} poster={app.trailer.poster} title={app.name} />
        ) : (
          <div className="mt-10 flex aspect-video w-full items-center justify-center border border-dashed border-bss-600 bg-bss-950/60">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-bss-400">Trailer coming soon</span>
          </div>
        )}

        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {app.screenshots.map((shot, i) => (
            <li key={shot.full}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="group block w-full overflow-hidden border border-bss-700"
                aria-label={`Open screenshot ${i + 1} of ${app.screenshots.length}`}
              >
                <img
                  src={shot.thumb}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:opacity-90"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {lightbox !== null && (
        <Lightbox images={app.screenshots.map((s) => s.full)} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

/** Steam only serves trailers as HLS/DASH streams: Safari plays HLS natively, other browsers need hls.js. */
function Trailer({ src, poster, title }: { src: string; poster: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("hls.js/light").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      const hls = new Hls({ autoStartLoad: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      // Don't download video segments until the viewer presses play.
      video.addEventListener("play", () => hls.startLoad(), { once: true });
      destroy = () => hls.destroy();
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      preload="none"
      playsInline
      aria-label={`${title} trailer`}
      className="mt-10 aspect-video w-full border border-bss-700 bg-black"
    />
  );
}

function Lightbox({
  images,
  index,
  onChange,
  onClose,
}: {
  images: string[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const step = (delta: number) => onChange((index + delta + images.length) % images.length);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  });

  const navButton = "absolute top-1/2 -translate-y-1/2 p-3 text-3xl text-bss-200 transition-colors hover:text-white";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-12"
      onClick={onClose}
    >
      <img src={images[index]} alt={`Screenshot ${index + 1} of ${images.length}`} className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()} />
      <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 p-2 text-bss-200 hover:text-white">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      {images.length > 1 && (
        <>
          <button type="button" aria-label="Previous screenshot" className={`${navButton} left-2`} onClick={(e) => (e.stopPropagation(), step(-1))}>
            ‹
          </button>
          <button type="button" aria-label="Next screenshot" className={`${navButton} right-2`} onClick={(e) => (e.stopPropagation(), step(1))}>
            ›
          </button>
        </>
      )}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-bss-300">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}

function AboutBlock({ block }: { block: TextBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="pt-4 text-xl font-semibold tracking-tight text-white">{block.text}</h3>;
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-1 pl-5 marker:text-accent-soft">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
  }
}

function AboutSection({ app }: { app: GameDetails }) {
  const details = [
    ["Release date", app.releaseDate],
    [app.comingSoon ? "Status" : "Price", priceLabel(app)],
    ["Platforms", app.platforms.join(", ")],
    ["Genres", app.genres.join(", ")],
    ["Languages", app.languages],
  ];

  return (
    <section className="border-t border-bss-800 bg-bss-950">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <Eyebrow>About the game</Eyebrow>
          <div className="mt-6 max-w-prose space-y-4 leading-relaxed text-bss-200">
            {app.about.map((block, i) => (
              <AboutBlock key={i} block={block} />
            ))}
          </div>
        </div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">Details</h2>
            <dl className="mt-4 border-t border-bss-800">
              {details.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 border-b border-bss-800 py-3 text-sm">
                  <dt className="text-bss-400">{label}</dt>
                  <dd className="text-right font-medium text-white">{value || TBA}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">Features</h2>
            {app.features.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {app.features.map((f) => (
                  <li key={f} className="rounded-sm border border-bss-700 px-2.5 py-1 text-xs text-bss-200">
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <Pending />
            )}
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">
              {app.achievements.total ? `${app.achievements.total} Achievements` : "Achievements"}
            </h2>
            {app.achievements.highlighted.length ? (
              <ul className="mt-4 grid grid-cols-6 gap-2">
                {app.achievements.highlighted.map((a) => (
                  <li key={a.name} title={a.name}>
                    <img src={a.icon} alt={a.name} loading="lazy" className="aspect-square w-full border border-bss-700" />
                  </li>
                ))}
              </ul>
            ) : (
              <Pending />
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

type Platform = keyof GameDetails["requirements"];

function RequirementsSection({ app }: { app: GameDetails }) {
  // A tab for every supported platform, even one whose specs aren't announced yet.
  const platforms = [...new Set([...app.platforms, ...Object.keys(app.requirements)])] as Platform[];
  const [active, setActive] = useState<Platform | undefined>(platforms[0]);
  const req: PlatformRequirements | undefined = active && app.requirements[active];

  return (
    <section className="border-t border-bss-800 bg-bss-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>System requirements</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Will it run?</h2>
          </div>
          {platforms.length > 1 && (
            <div role="tablist" className="flex border border-bss-700">
              {platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={p === active}
                  onClick={() => setActive(p)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    p === active ? "bg-accent text-white" : "text-bss-300 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {(["minimum", "recommended"] as const).map((tier) =>
            !req?.[tier].length ? (
              <div key={tier}>
                <h3 className="font-mono text-xs uppercase tracking-wider text-bss-400">{tier}</h3>
                <div className="mt-4 border-t border-bss-700">
                  <Pending />
                </div>
              </div>
            ) : (
              <div key={tier}>
                <h3 className="font-mono text-xs uppercase tracking-wider text-bss-400">{tier}</h3>
                <dl className="mt-4 border-t border-bss-700">
                  {req[tier].map((row, i) => (
                    <div key={i} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-bss-700 py-3 text-sm">
                      <dt className="text-bss-400">{row.label ?? ""}</dt>
                      <dd className="text-bss-100">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
