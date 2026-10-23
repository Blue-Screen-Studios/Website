import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  body?: string;
}

export default function PlaceholderPage({ eyebrow, title, body = "This page is coming soon." }: PlaceholderPageProps) {
  return (
    <section className="bg-bss-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-6 text-bss-300">{body}</p>
        <Link to="/" className="mt-10 inline-block text-sm font-semibold text-accent-soft hover:text-white">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
