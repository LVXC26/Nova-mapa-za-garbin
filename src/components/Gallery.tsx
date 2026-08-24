import type { SiteContent } from "@/content/types";
import { Section } from "./Section";
import { MediaLightboxGrid } from "./MediaLightboxGrid";

export function Gallery({ section, id }: { section: SiteContent["gallery"]; id?: string }) {
  return (
    <Section id={id} eyebrow={section.eyebrow} title={section.title} intro={section.intro}>
      <MediaLightboxGrid items={section.items} />
    </Section>
  );
}
