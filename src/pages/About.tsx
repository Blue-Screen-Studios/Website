import { contactMailto } from "../data/contact";
import { openRoles, team } from "../data/team";

export default function About() {
  return (
    <section className="bg-bss-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">About</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Our Team</h1>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {team.map((member) => (
            <li key={member.name}>
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-bss-800">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="size-full object-cover" />
                ) : (
                  <span className="text-4xl font-semibold tracking-tight text-bss-300" aria-hidden="true">
                    {initials(member.name)}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-semibold text-white">{member.name}</h3>
              <p className="mt-1 text-sm leading-snug text-bss-300">{member.role}</p>
            </li>
          ))}
          {openRoles.map((role) => (
            <li key={role}>
              <a
                href={contactMailto(`Application: ${role}`)}
                className="group flex aspect-square flex-col items-center justify-center gap-2 border-2 border-dashed border-bss-600 text-accent-soft transition-colors hover:border-accent-soft hover:bg-bss-900"
              >
                <span className="text-5xl font-light leading-none" aria-hidden="true">+</span>
                <span className="font-mono text-xs uppercase tracking-[0.18em]">Apply</span>
              </a>
              <h3 className="mt-4 font-semibold text-white">{role}</h3>
              <p className="mt-1 text-sm font-medium leading-snug text-emerald-400">This could be you!</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
