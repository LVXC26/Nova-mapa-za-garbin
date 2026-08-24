import { sl } from "@/content/sl";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Gallery } from "@/components/Gallery";
import { Industries } from "@/components/Industries";
import { ProcessSteps } from "@/components/ProcessSteps";

export default function Home() {
  return (
    <>
      <Hero hero={sl.hero} />
      <ServicesGrid section={sl.servicesSection} id="storitve" />
      <Gallery section={sl.gallery} id="galerija" />
      <Industries section={sl.industries} id="panoge" />
      <ProcessSteps section={sl.process} id="proces" />
    </>
  );
}
