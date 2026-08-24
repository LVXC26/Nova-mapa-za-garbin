"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/content/types";
import { Section } from "./Section";

export function ProjectsGrid({ section, id }: { section: SiteContent["projects"]; id?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const project = openIndex !== null ? section.items[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrevImage = useCallback(() => {
    setImageIndex((i) => (project ? (i - 1 + project.images.length) % project.images.length : i));
  }, [project]);
  const showNextImage = useCallback(() => {
    setImageIndex((i) => (project ? (i + 1) % project.images.length : i));
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "ArrowRight") showNextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, close, showPrevImage, showNextImage]);

  return (
    <Section id={id} eyebrow={section.eyebrow} title={section.title} intro={section.intro}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item, index) => (
          <button
            key={item.title}
            onClick={() => {
              setOpenIndex(index);
              setImageIndex(0);
            }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface text-left"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              {item.images.length > 1 && (
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  +{item.images.length - 1}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan">
                {item.category}
              </span>
              <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted">{section.note}</p>

      {project && (
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

          {project.images.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-white/80 hover:text-white sm:left-6"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-white/80 hover:text-white sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full">
              <Image
                src={project.images[imageIndex]}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-cyan">
                  {project.category}
                </span>
                {project.images.length > 1 && (
                  <span className="text-xs text-muted">
                    {imageIndex + 1} / {project.images.length}
                  </span>
                )}
              </div>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{project.title}</h3>
              <p className="mt-2 text-sm text-muted">{project.description}</p>

              {project.images.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {project.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setImageIndex(i)}
                      aria-label={`Slika ${i + 1}`}
                      className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition ${
                        i === imageIndex ? "border-cyan" : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
