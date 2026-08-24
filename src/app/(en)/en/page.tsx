import { en } from "@/content/en";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Gallery } from "@/components/Gallery";
import { Industries } from "@/components/Industries";
import { ProcessSteps } from "@/components/ProcessSteps";

export default function EnHome() {
  return (
    <>
      <Hero hero={en.hero} />
      <ServicesGrid section={en.servicesSection} id="services" />
      <Gallery section={en.gallery} id="gallery" />
      <Industries section={en.industries} id="industries" />
      <ProcessSteps section={en.process} id="process" />
    </>
  );
}
