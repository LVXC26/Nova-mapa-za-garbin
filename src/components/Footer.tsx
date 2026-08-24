import Link from "next/link";
import type { SiteContent } from "@/content/types";

export function Footer({
  nav,
  contact,
  footer,
  homeHref,
}: {
  nav: SiteContent["nav"];
  contact: SiteContent["contact"];
  footer: SiteContent["footer"];
  homeHref: string;
}) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Link href={homeHref} className="font-script text-2xl font-semibold">
              <span className="text-gradient">LVX</span>{" "}
              <span className="text-muted">Experience</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">{footer.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Menu</p>
            <ul className="mt-4 space-y-2">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted transition hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Kontakt</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={`mailto:${contact.email}`} className="text-sm text-muted transition hover:text-foreground">
                  {contact.email}
                </a>
              </li>
              {contact.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LVX Experience. {footer.rights}</p>
          <p>{contact.location}</p>
        </div>
      </div>
    </footer>
  );
}
