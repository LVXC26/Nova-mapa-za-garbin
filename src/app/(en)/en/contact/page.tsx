import type { Metadata } from "next";
import { en } from "@/content/en";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `Contact — ${en.meta.title}`,
};

export default function ContactPage() {
  return <ContactSection contact={en.contact} />;
}
