"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { SiteContent } from "@/content/types";

const REEL_IMAGES = [
  "/images/gallery/martinova-2.jpg",
  "/images/gallery/hotel-lonca-2.jpg",
  "/images/gallery/athlete-gym-2.jpg",
  "/images/gallery/mia-kozmetika-2.jpg",
  "/images/gallery/martinova-3.jpg",
  "/images/gallery/hotel-lonca-3.jpg",
];
const CARD_COUNT = REEL_IMAGES.length;

const RADIUS = 210;
const ANGLE_STEP = 24;
const TRACK_ANGLE = ANGLE_STEP * CARD_COUNT;
const RISE_STEP = 34;
const SCALE_STEP = 0.09;
const OPACITY_STEP = 0.16;
const BLUR_STEP = 0.7;

const DRAG_SENSITIVITY = 0.3;
const TILT_LIMIT = 12;
const DEFAULT_TILT = -6;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function useSpiralDrag(cardCount: number) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rotation = useRef(0);
  const tiltX = useRef(DEFAULT_TILT);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const render = () => {
    const scene = sceneRef.current;
    if (scene) scene.style.transform = `rotateX(${tiltX.current}deg)`;

    for (let i = 0; i < cardCount; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;

      const phase = mod(i * ANGLE_STEP + rotation.current, TRACK_ANGLE);
      const depth = phase / ANGLE_STEP;
      const angleRad = (phase * Math.PI) / 180;

      const x = RADIUS * Math.sin(angleRad);
      const z = -RADIUS * (1 - Math.cos(angleRad));
      const y = -depth * RISE_STEP;
      const scale = Math.max(0.42, 1 - depth * SCALE_STEP);
      const opacity = Math.max(0, 1 - depth * OPACITY_STEP);
      const blur = depth * BLUR_STEP;

      card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
      card.style.zIndex = String(Math.round(1000 - depth * 10));
      card.style.pointerEvents = depth < 0.5 ? "auto" : "none";
    }
  };

  useEffect(() => {
    render();

    const scene = sceneRef.current;
    if (!scene) return;

    const handlePointerDown = (e: PointerEvent) => {
      dragging.current = true;
      scene.setPointerCapture(e.pointerId);
      scene.style.cursor = "grabbing";
      last.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;

      rotation.current += dx * DRAG_SENSITIVITY;
      tiltX.current = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, tiltX.current + -dy * DRAG_SENSITIVITY));
      render();

      last.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      scene.releasePointerCapture(e.pointerId);
      scene.style.cursor = "grab";
    };

    scene.addEventListener("pointerdown", handlePointerDown);
    scene.addEventListener("pointermove", handlePointerMove);
    scene.addEventListener("pointerup", handlePointerUp);
    scene.addEventListener("pointercancel", handlePointerUp);

    return () => {
      scene.removeEventListener("pointerdown", handlePointerDown);
      scene.removeEventListener("pointermove", handlePointerMove);
      scene.removeEventListener("pointerup", handlePointerUp);
      scene.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [cardCount]);

  return { sceneRef, cardRefs };
}

function ReelCard({
  cardRef,
  index,
  src,
}: {
  cardRef: (el: HTMLDivElement | null) => void;
  index: number;
  src: string;
}) {
  return (
    <div ref={cardRef} className="absolute left-1/2 top-[62%] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:w-[320px]">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/90 p-2 shadow-2xl shadow-black/40">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image src={src} alt="" fill sizes="320px" priority={index === 0} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function RenderHud({ hud }: { hud: SiteContent["hero"]["hud"] }) {
  const { sceneRef, cardRefs } = useSpiralDrag(CARD_COUNT);

  return (
    <div>
      <div className="h-[380px] [perspective:1400px] sm:h-[420px]">
        <div
          ref={sceneRef}
          className="relative h-full w-full cursor-grab touch-none select-none [transform-style:preserve-3d]"
        >
          {REEL_IMAGES.map((src, i) => (
            <ReelCard
              key={src}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
              index={i}
              src={src}
            />
          ))}
        </div>
      </div>

      <p className="mt-1 flex items-center justify-center gap-2 text-center text-xs text-muted">
        <span aria-hidden="true">↔</span>
        {hud.flipHint}
      </p>

      <div className="mt-2 text-center">
        <Link
          href={hud.backCta.href}
          className="text-sm font-medium text-foreground underline decoration-cyan/50 underline-offset-4 hover:text-cyan"
        >
          {hud.backCta.label}
        </Link>
      </div>
    </div>
  );
}
