import type { Metadata } from "next";
import { sl } from "@/content/sl";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Industries } from "@/components/Industries";
import { ProcessSteps } from "@/components/ProcessSteps";

export const metadata: Metadata = {
  title: `Storitve — ${sl.meta.title}`,
};

export default function StoritvePage() {
  return (
    <>
      <ServicesGrid section={sl.servicesSection} />
      <Industries section={sl.industries} />
      <ProcessSteps section={sl.process} />
    </>
  );
}
