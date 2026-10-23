import { Link } from "react-router-dom";
import { RichText } from "../components/Code";
import { sdkLibraries } from "../data/sdk";

export default function Sdk() {
  return (
    <>
      <section className="bg-bss-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">Open source</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Blue SDK</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bss-200">
            The technology we build our games on, released under the MIT License. Each library does one job and owns
            no window, renderer or audio device, so it fits into whatever engine you already have.
          </p>
          <a
            href="https://github.com/Blue-Screen-Studios"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Blue Screen Studios on GitHub
          </a>
        </div>
      </section>

      <section className="border-t border-bss-800 bg-bss-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <ul className="grid gap-6 lg:grid-cols-3">
            {sdkLibraries.map((lib) => (
              <li key={lib.slug} className="flex flex-col border border-bss-700 bg-bss-950 p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">{lib.name}</h2>
                  <span className="font-mono text-xs uppercase tracking-wider text-bss-400">{lib.language}</span>
                </div>
                <p className="mt-3 leading-relaxed text-bss-200">
                  <RichText text={lib.tagline} />
                </p>
                <ul className="mt-6 flex-1 space-y-2 border-t border-bss-800 pt-6 text-sm text-bss-300">
                  {lib.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden="true" className="text-accent-soft">—</span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    to={`/sdk/${lib.slug}`}
                    className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Learn more
                  </Link>
                  <a href={lib.repo} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent-soft hover:text-white">
                    GitHub ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
