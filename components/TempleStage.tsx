"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * CSS-3D stage for the landing temple: swings up on load (CSS), and with a mouse
 * it tilts toward the pointer while its layers (.depth-1/2/3) separate in depth.
 * Touch devices get the entrance only. No library — just perspective + transforms.
 */
export function TempleStage({ children }: { children: ReactNode }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 9).toFixed(2)}deg`);
    el.dataset.tilt = "on";
  };

  const onLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.tilt;
  };

  return (
    <div className="temple-stage">
      <div className="temple-enter">
        <div
          ref={tiltRef}
          className="temple-tilt"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
