import Link from "next/link";
import type { SiteContent } from "@/content/types";
import { RenderHud } from "./RenderHud";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-noise" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold tracking-widest text-cyan uppercase">{hero.eyebrow}</p>
          <h1 className="mt-4 font-script text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {hero.titleLines[0]}
            <br />
            <span className="text-gradient">{hero.titleLines[1]}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">{hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={hero.ctaPrimary.href}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-85"
            >
              {hero.ctaPrimary.label}
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-cyan hover:text-cyan"
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {hero.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <RenderHud hud={hero.hud} />
        </div>
      </div>
    </section>
  );
}
