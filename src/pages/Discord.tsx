import { useEffect, useState } from "react";
import { DISCORD_INVITE_URL, fetchMemberCount, fetchWidget, type Widget } from "../data/discord";

const REFRESH_MS = 60_000;
const AVATAR_SLOTS = 100;

interface Segment {
  key: string;
  label: string;
  value: number;
  color: string;
}

export default function Discord() {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = () =>
      fetchWidget(controller.signal)
        .then((w) => {
          setWidget(w);
          setError(false);
        })
        .catch((e) => {
          if (!controller.signal.aborted) setError(true);
          console.error(e);
        });
    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  const inviteUrl = widget?.instant_invite ?? (DISCORD_INVITE_URL || null);

  useEffect(() => {
    if (!inviteUrl) return;
    const controller = new AbortController();
    fetchMemberCount(inviteUrl, controller.signal)
      .then(setMemberCount)
      .catch(() => {});
    return () => controller.abort();
  }, [inviteUrl]);

  return (
    <section className="min-h-[70vh] bg-bss-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-bss-300">Community</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Discord</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-bss-200">
          Talk with the team, follow development, and find people to play with.
        </p>
        <div className="mt-10">
          {inviteUrl ? (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Join the Discord
            </a>
          ) : (
            <span className="inline-block cursor-not-allowed rounded-sm border border-bss-700 px-6 py-3 text-sm font-semibold text-bss-400">
              {widget || error ? "Invite link unavailable" : "Loading…"}
            </span>
          )}
        </div>

        <div className="mt-16 border-t border-bss-800 pt-10">
          {widget ? (
            <MemberBar widget={widget} total={memberCount} />
          ) : (
            <div className="h-28 animate-pulse rounded-sm bg-bss-900" aria-label="Loading community stats" />
          )}
          {error && (
            <p className="mt-6 text-sm text-bss-300">
              Couldn't reach Discord right now. The numbers will update when the connection comes back.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MemberBar({ widget, total }: { widget: Widget; total: number | null }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const inVoice = widget.members.filter((m) => m.channel_id).length;
  const online = widget.presence_count;

  const segments: Segment[] = [
    { key: "voice", label: "In voice", value: inVoice, color: "#4a8dff" },
    { key: "online", label: "Online", value: Math.max(online - inVoice, 0), color: "#25a862" },
    ...(total !== null ? [{ key: "offline", label: "Offline", value: Math.max(total - online, 0), color: "#56657d" }] : []),
  ];
  const sum = segments.reduce((n, s) => n + s.value, 0) || 1;
  const pct = (v: number) => `${Math.round((v / sum) * 100)}%`;

  return (
    <figure>
      <figcaption className="text-center">
        <span className="block text-6xl font-semibold tracking-tight tabular-nums text-white sm:text-7xl">
          {(total ?? online).toLocaleString()}
        </span>
        <span className="mt-2 block font-mono text-xs uppercase tracking-[0.18em] text-bss-400">
          {total !== null ? "Total members" : "Members online"}
        </span>
      </figcaption>

      <div
        className="mt-6 flex h-10 gap-0.5"
        role="img"
        aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
      >
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.key}
              className="group relative min-w-1 first:rounded-l last:rounded-r transition-opacity"
              style={{
                flexGrow: s.value,
                backgroundColor: s.color,
                opacity: hovered && hovered !== s.key ? 0.4 : 1,
              }}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === s.key && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-bss-700 bg-bss-900 px-3 py-2 text-xs text-white shadow-lg">
                  <span className="font-semibold">{s.label}</span>
                  <span className="ml-2 tabular-nums text-bss-200">
                    {s.value.toLocaleString()} · {pct(s.value)}
                  </span>
                </div>
              )}
            </div>
          ))}
      </div>

      <ul className="mt-8 flex flex-wrap justify-center gap-x-14 gap-y-6">
        {segments.map((s) => (
          <li
            key={s.key}
            className="flex flex-col items-center"
            onMouseEnter={() => setHovered(s.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="text-3xl font-semibold tabular-nums text-white sm:text-4xl">{s.value.toLocaleString()}</span>
            <span className="mt-2 flex items-center gap-2">
              <span className="size-3 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="font-mono text-xs uppercase tracking-wider text-bss-300">{s.label}</span>
              <span className="text-sm tabular-nums text-bss-400">{pct(s.value)}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* The widget API returns at most 100 online members: a fixed 25×4 grid */}
      <ul className="mt-14 grid grid-cols-25 gap-0.5 sm:gap-1.5" aria-label="Members online">
        {widget.members.slice(0, AVATAR_SLOTS).map((m) => (
          <li key={m.id + m.username} className="aspect-square" title={m.username}>
            <img
              src={m.avatar_url}
              alt={m.username}
              loading="lazy"
              className={`size-full rounded-full bg-bss-800 ${m.channel_id ? "ring-2 ring-[#4a8dff]" : ""}`}
            />
          </li>
        ))}
      </ul>
    </figure>
  );
}
