"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteContent } from "@/content/types";

export function Header({ content, homeHref }: { content: SiteContent["nav"]; homeHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={homeHref} className="font-script text-2xl font-semibold tracking-tight">
          <span className="text-gradient">LVX</span>{" "}
          <span className="text-muted">Experience</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {content.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={content.langSwitch.href}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition hover:border-cyan hover:text-cyan"
          >
            {content.langSwitch.label}
          </Link>
          <Link
            href={content.cta.href}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-85"
          >
            {content.cta.label}
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className="h-px w-6 bg-foreground" />
          <span className="h-px w-6 bg-foreground" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {content.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={content.langSwitch.href}
              onClick={() => setOpen(false)}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {content.langSwitch.label === "EN" ? "English" : "Slovenščina"}
            </Link>
            <Link
              href={content.cta.href}
              onClick={() => setOpen(false)}
              className="rounded-full bg-foreground px-4 py-2 text-center text-sm font-medium text-background"
            >
              {content.cta.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
