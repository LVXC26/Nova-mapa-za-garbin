"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface LightboxItem {
  src: string;
  alt: string;
  title: string;
  tag: string;
  description: string;
}

export function MediaLightboxGrid({ items }: { items: LightboxItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.src}
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface text-left"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan">
                {item.tag}
              </span>
              <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Close"
            onClick={close}
            className="absolute right-5 top-5 rounded-full border border-white/20 px-3 py-1 text-sm text-white/80 hover:text-white"
          >
            ✕
          </button>
          <button
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-white/80 hover:text-white sm:left-6"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-white/80 hover:text-white sm:right-6"
          >
            ›
          </button>

          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full">
              <Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-cyan">
                {active.tag}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{active.title}</h3>
              <p className="mt-2 text-sm text-muted">{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
