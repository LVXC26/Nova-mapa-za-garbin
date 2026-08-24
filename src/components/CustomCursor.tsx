"use client";

import { useEffect, useRef } from "react";

const GLOWS = [
  { color: "124,92,255", alpha: 0.5, size: 280, lag: 0.16, offsetX: 0, offsetY: 0 },
  { color: "34,211,238", alpha: 0.38, size: 250, lag: 0.1, offsetX: 35, offsetY: -25 },
  { color: "244,114,182", alpha: 0.3, size: 230, lag: 0.06, offsetX: -40, offsetY: 30 },
];

const RING_SIZE = 38;
const RING_HOVER_SIZE = 64;

export function CustomCursor() {
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const glowPos = GLOWS.map(() => ({ x: target.x, y: target.y }));
    const ringPos = { x: target.x, y: target.y };
    let raf = 0;
    let started = false;

    const reveal = () => {
      ringRef.current?.style.setProperty("opacity", "1");
      dotRef.current?.style.setProperty("opacity", "1");
      glowRefs.current.forEach((el) => el?.style.setProperty("opacity", "1"));
    };

    const handleMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!started) {
        started = true;
        ringPos.x = target.x;
        ringPos.y = target.y;
        glowPos.forEach((p) => {
          p.x = target.x;
          p.y = target.y;
        });
        reveal();
      }
      dotRef.current?.style.setProperty("transform", `translate(${target.x}px, ${target.y}px)`);
    };

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.22;
      ringPos.y += (target.y - ringPos.y) * 0.22;
      ringRef.current?.style.setProperty("transform", `translate(${ringPos.x}px, ${ringPos.y}px)`);

      glowPos.forEach((p, i) => {
        const g = GLOWS[i];
        p.x += (target.x + g.offsetX - p.x) * g.lag;
        p.y += (target.y + g.offsetY - p.y) * g.lag;
        glowRefs.current[i]?.style.setProperty(
          "transform",
          `translate(${p.x - g.size / 2}px, ${p.y - g.size / 2}px)`
        );
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const grow = () => {
      const ring = ringRef.current;
      if (!ring) return;
      ring.style.width = `${RING_HOVER_SIZE}px`;
      ring.style.height = `${RING_HOVER_SIZE}px`;
      ring.style.marginLeft = `${-RING_HOVER_SIZE / 2}px`;
      ring.style.marginTop = `${-RING_HOVER_SIZE / 2}px`;
      ring.style.borderColor = "rgba(34,211,238,0.9)";
    };

    const shrink = () => {
      const ring = ringRef.current;
      if (!ring) return;
      ring.style.width = `${RING_SIZE}px`;
      ring.style.height = `${RING_SIZE}px`;
      ring.style.marginLeft = `${-RING_SIZE / 2}px`;
      ring.style.marginTop = `${-RING_SIZE / 2}px`;
      ring.style.borderColor = "rgba(255,255,255,0.7)";
    };

    const attach = () => {
      const hoverables = document.querySelectorAll("a, button, [role='button']");
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
      return hoverables;
    };

    let hoverables = attach();
    const observer = new MutationObserver(() => {
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
      hoverables = attach();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      {GLOWS.map((g, i) => (
        <div
          key={g.color}
          ref={(el) => {
            glowRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-0 rounded-full opacity-0 transition-opacity duration-700"
          style={{
            width: g.size,
            height: g.size,
            background: `radial-gradient(circle, rgba(${g.color},${g.alpha}), rgba(0,0,0,0) 62%)`,
            filter: "blur(46px)",
            mixBlendMode: "screen",
          }}
        />
      ))}

      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full opacity-0"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          border: "1px solid rgba(255,255,255,0.7)",
          mixBlendMode: "difference",
          transition:
            "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), margin 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.3s, border-color 0.3s",
        }}
      />

      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white opacity-0"
        style={{
          width: 7,
          height: 7,
          marginLeft: -3.5,
          marginTop: -3.5,
          mixBlendMode: "difference",
          transition: "opacity 0.3s",
        }}
      />
    </>
  );
}
