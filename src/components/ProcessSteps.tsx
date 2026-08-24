import type { SiteContent } from "@/content/types";
import { Section } from "./Section";

export function ProcessSteps({
  section,
  id,
}: {
  section: SiteContent["process"];
  id?: string;
}) {
  return (
    <Section id={id} eyebrow={section.eyebrow} title={section.title} intro={section.intro}>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {section.steps.map((step) => (
          <li key={step.number} className="rounded-2xl border border-border bg-surface p-5">
            <span className="font-script text-3xl font-semibold text-gradient">{step.number}</span>
            <h3 className="mt-3 text-base font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
