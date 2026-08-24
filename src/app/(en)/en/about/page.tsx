import type { Metadata } from "next";
import { en } from "@/content/en";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSteps } from "@/components/ProcessSteps";

export const metadata: Metadata = {
  title: `About — ${en.meta.title}`,
};

export default function AboutPage() {
  return (
    <>
      <AboutSection about={en.about} />
      <ProcessSteps section={en.process} />
    </>
  );
}
