import { Link } from "react-router-dom";
import { CodeBlock, RichText } from "../components/Code";
import type { SdkLibrary as Library } from "../data/sdk";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">{children}</p>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{title}</h2>
    </>
  );
}

const container = "mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8";

export default function SdkLibrary({ lib }: { lib: Library }) {
  return (
    <>
      <section className="bg-bss-950">
        <div className={`${container} lg:py-24`}>
          <Link to="/sdk" className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft hover:text-white">
            ← Blue SDK
          </Link>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">{lib.name}</h1>
          <p className="mt-4 text-xl text-bss-200">{lib.tagline}</p>

          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="max-w-prose space-y-4 leading-relaxed text-bss-300 lg:col-span-7">
              {lib.summary.map((p) => (
                <p key={p}>
                  <RichText text={p} />
                </p>
              ))}
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <dl className="border-t border-bss-800 text-sm">
                {[
                  ["Language", lib.language],
                  ["License", "MIT"],
                  ["Build", "CMake"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 border-b border-bss-800 py-3">
                    <dt className="text-bss-400">{label}</dt>
                    <dd className="font-medium text-white">{value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={lib.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-bss-800 bg-bss-900">
        <div className={container}>
          <SectionTitle eyebrow="How it fits" title="Who does what" />
          <div className="mt-10 border-t border-bss-700">
            <div className="hidden grid-cols-2 gap-8 border-b border-bss-700 py-3 font-mono text-xs uppercase tracking-wider text-bss-400 md:grid">
              <span>{lib.split.left}</span>
              <span>{lib.split.right}</span>
            </div>
            {lib.split.rows.map(([left, right]) => (
              <div key={left} className="grid gap-2 border-b border-bss-700 py-4 text-sm leading-relaxed md:grid-cols-2 md:gap-8">
                <p className="font-medium text-white">
                  <RichText text={left} />
                </p>
                <p className="text-bss-300">
                  <RichText text={right} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bss-800 bg-bss-950">
        <div className={container}>
          <SectionTitle eyebrow="Features" title={`What ${lib.name} gives you`} />
          <ul className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {lib.features.map((f) => (
              <li key={f.title} className="border-l-2 border-accent pl-5">
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bss-300">
                  <RichText text={f.text} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-bss-800 bg-bss-900">
        <div className={`${container} grid gap-12 lg:grid-cols-12`}>
          <div className="min-w-0 lg:col-span-7">
            <SectionTitle eyebrow="Quick start" title="A minimal setup" />
            <div className="mt-10">
              <CodeBlock code={lib.quickStart.code} label={lib.quickStart.language} />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <SectionTitle eyebrow="Building" title="Build and test" />
            <ul className="mt-10 space-y-2 text-sm leading-relaxed text-bss-300">
              {lib.requirements.map((r) => (
                <li key={r} className="flex gap-3">
                  <span aria-hidden="true" className="text-accent-soft">—</span>
                  <span>
                    <RichText text={r} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CodeBlock code={lib.build} label="Shell" />
            </div>
            {lib.notes && (
              <div className="mt-8 space-y-3 text-sm leading-relaxed text-bss-400">
                {lib.notes.map((n) => (
                  <p key={n}>
                    <RichText text={n} />
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-bss-800 bg-bss-950">
        <div className={container}>
          <SectionTitle eyebrow="Documentation" title="Read the guides" />
          <ul className="mt-10 grid gap-px border border-bss-800 bg-bss-800 sm:grid-cols-2 lg:grid-cols-3">
            {lib.docs.map((doc) => (
              <li key={doc.path} className="bg-bss-950">
                <a
                  href={`${lib.repo}/blob/main/${doc.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full p-6 transition-colors hover:bg-bss-900"
                >
                  <span className="flex items-center justify-between font-semibold text-white">
                    {doc.title}
                    <span aria-hidden="true" className="text-bss-400 transition-colors group-hover:text-accent-soft">
                      ↗
                    </span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-bss-300">{doc.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
