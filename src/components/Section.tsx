import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-6 py-20 sm:py-24 ${className}`}>
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-cyan uppercase">{eyebrow}</p>
        <h2 className="mt-3 font-script text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-base text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
