import type { Metadata } from "next";
import { en } from "@/content/en";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { Gallery } from "@/components/Gallery";

export const metadata: Metadata = {
  title: `Projects — ${en.meta.title}`,
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsGrid section={en.projects} />
      <Gallery section={en.gallery} />
    </>
  );
}
