import type { Metadata } from "next";
import { sl } from "@/content/sl";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { Gallery } from "@/components/Gallery";

export const metadata: Metadata = {
  title: `Projekti — ${sl.meta.title}`,
};

export default function ProjektiPage() {
  return (
    <>
      <ProjectsGrid section={sl.projects} />
      <Gallery section={sl.gallery} />
    </>
  );
}
