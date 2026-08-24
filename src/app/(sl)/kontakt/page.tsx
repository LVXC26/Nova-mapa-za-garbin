import type { Metadata } from "next";
import { sl } from "@/content/sl";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `Kontakt — ${sl.meta.title}`,
};

export default function KontaktPage() {
  return <ContactSection contact={sl.contact} />;
}
