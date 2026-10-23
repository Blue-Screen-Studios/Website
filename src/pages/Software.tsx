import { Link } from "react-router-dom";
import { software } from "../data/catalog";

export default function Software() {
  return (
    <section className="min-h-[60vh] bg-bss-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">Our work</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Software</h1>

        <ul className="mt-12 border-t border-bss-800">
          {software.map((item, i) => (
            <li key={item.slug}>
              <Link
                to={`/software/${item.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-b border-bss-800 py-7 transition-colors hover:bg-bss-900 sm:px-4 md:grid-cols-[3rem_1.2fr_2fr_6rem_2rem]"
              >
                <span className="font-mono text-sm text-bss-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg font-semibold text-white">{item.title}</span>
                <span className="col-span-3 col-start-2 row-start-2 text-sm leading-relaxed text-bss-300 md:col-span-1 md:col-start-auto md:row-start-auto">
                  {item.description}
                </span>
                <span className="hidden font-mono text-xs uppercase tracking-wider text-bss-400 md:block">{item.platform}</span>
                <span aria-hidden="true" className="text-bss-400 transition-transform group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
