import type { SiteContent } from "@/content/types";

export function AboutSection({ about, id }: { about: SiteContent["about"]; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <p className="text-xs font-semibold tracking-widest text-cyan uppercase">{about.eyebrow}</p>
      <h2 className="mt-3 max-w-2xl font-script text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {about.title}
      </h2>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          {about.paragraphs.map((p) => (
            <p key={p} className="text-base text-muted">
              {p}
            </p>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {about.values.map((value) => (
            <div key={value.title} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm text-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
