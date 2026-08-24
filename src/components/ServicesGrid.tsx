import type { SiteContent } from "@/content/types";
import { Section } from "./Section";

export function ServicesGrid({
  section,
  id,
}: {
  section: SiteContent["servicesSection"];
  id?: string;
}) {
  return (
    <Section id={id} eyebrow={section.eyebrow} title={section.title} intro={section.intro}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-cyan/40 hover:bg-surface-2"
          >
            <span className="inline-block rounded-full border border-border px-3 py-1 text-xs font-medium text-cyan">
              {item.tag}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
            <ul className="mt-4 space-y-1.5">
              {item.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-violet to-pink" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
