import { Link } from "react-router-dom";
import Logo from "./Logo";
import { contactMailto } from "../data/contact";
import { sdkLibraries } from "../data/sdk";

// With no navbar, the footer is the site's navigation.
type FooterLink = { label: string } & ({ to: string } | { href: string });

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Community",
    links: [
      { to: "/discord", label: "Discord" },
      { href: "https://github.com/Blue-Screen-Studios", label: "GitHub" },
    ],
  },
  {
    title: "Developers",
    links: [{ to: "/sdk", label: "Blue SDK" }, ...sdkLibraries.map((lib) => ({ to: `/sdk/${lib.slug}`, label: lib.name }))],
  },
  {
    title: "Studio",
    links: [
      { to: "/", label: "Games" },
      { to: "/software", label: "Software" },
      { to: "/about", label: "About" },
      { href: contactMailto(), label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-bss-800 bg-bss-950 text-bss-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8">
        <div className="sm:col-span-3 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bss-400">
            We make stuff!
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-mono text-xs uppercase tracking-wider text-bss-500">{col.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  {"href" in l && l.href.startsWith("mailto:") ? (
                    <a href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </a>
                  ) : "href" in l ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link to={l.to} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-bss-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-bss-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Blue Screen Studios. All rights reserved.</p>
          <p className="font-mono">v0.1</p>
        </div>
      </div>
    </footer>
  );
}
