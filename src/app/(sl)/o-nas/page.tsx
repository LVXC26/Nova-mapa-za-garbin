import type { Metadata } from "next";
import { sl } from "@/content/sl";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSteps } from "@/components/ProcessSteps";

export const metadata: Metadata = {
  title: `O nas — ${sl.meta.title}`,
};

export default function ONasPage() {
  return (
    <>
      <AboutSection about={sl.about} />
      <ProcessSteps section={sl.process} />
    </>
  );
}
