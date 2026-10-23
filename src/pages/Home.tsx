import GameSections from "../components/GameSections";

// Swap the hero image for the real one when it's ready.
const HERO_IMAGE = "/hero-placeholder.svg";
const LOGO_IMAGE = "/logo.png";

export default function Home() {
  return (
    <>
      <Hero />
      <GameSections />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-bss-950">
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bss-950/95 via-bss-950/75 to-bss-950/30" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:flex-row sm:items-center sm:gap-10 sm:px-6 lg:px-8 lg:py-20">
        <img src={LOGO_IMAGE} alt="Blue Screen Studios logo" className="size-28 shrink-0 mix-blend-lighten sm:size-40" />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">Game &amp; Software Studio</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Blue Screen Studios
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-bss-200">
            We make stuff!
          </p>
        </div>
      </div>
    </section>
  );
}
