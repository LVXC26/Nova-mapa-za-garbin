import type { SiteContent } from "@/content/types";
import { ContactForm } from "./ContactForm";

export function ContactSection({ contact, id }: { contact: SiteContent["contact"]; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-cyan uppercase">{contact.eyebrow}</p>
          <h2 className="mt-3 font-script text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {contact.title}
          </h2>
          <p className="mt-4 max-w-md text-base text-muted">{contact.intro}</p>

          <div className="mt-8 space-y-2 text-sm">
            <a href={`mailto:${contact.email}`} className="block text-cyan hover:underline">
              {contact.email}
            </a>
            <p className="text-muted">{contact.location}</p>
          </div>

          <div className="mt-6 flex gap-4">
            {contact.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <ContactForm contact={contact} />
      </div>
    </section>
  );
}
