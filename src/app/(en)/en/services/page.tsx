import type { Metadata } from "next";
import { en } from "@/content/en";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Industries } from "@/components/Industries";
import { ProcessSteps } from "@/components/ProcessSteps";

export const metadata: Metadata = {
  title: `Services — ${en.meta.title}`,
};

export default function ServicesPage() {
  return (
    <>
      <ServicesGrid section={en.servicesSection} />
      <Industries section={en.industries} />
      <ProcessSteps section={en.process} />
    </>
  );
}
