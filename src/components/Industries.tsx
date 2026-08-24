import type { SiteContent } from "@/content/types";
import { Section } from "./Section";

export function Industries({
  section,
  id,
}: {
  section: SiteContent["industries"];
  id?: string;
}) {
  return (
    <Section id={id} eyebrow={section.eyebrow} title={section.title} intro={section.intro}>
      <div className="flex flex-wrap gap-3">
        {section.items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:border-pink/40"
          >
            {item}
          </span>
        ))}
      </div>
    </Section>
  );
}
