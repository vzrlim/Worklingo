import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Greek / Aegean motifs — pure SVG + CSS, no images, colour via currentColor tokens. */

/** Greek key (meander) band. Height sets the scale; colour comes from text-* classes. */
export function MeanderBand({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("meander h-3.5 w-full", className)} />;
}

/** Temple pediment: outer gable, inner tympanum and a central shield. Draws in once on load. */
export function Pediment({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 92"
      preserveAspectRatio="none"
      className={cn("draw-in block w-full overflow-visible", className)}
      fill="none"
      stroke="currentColor"
    >
      <path pathLength={1} vectorEffect="non-scaling-stroke" strokeWidth={2.5} d="M2 90 L200 4 L398 90 Z" />
      <path pathLength={1} vectorEffect="non-scaling-stroke" strokeWidth={1.25} d="M46 82 L200 17 L354 82 Z" />
      <path pathLength={1} vectorEffect="non-scaling-stroke" strokeWidth={1.25} d="M188 66 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0" />
      <path pathLength={1} vectorEffect="non-scaling-stroke" strokeWidth={1.25} d="M194 66 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0" />
    </svg>
  );
}

/** Ionic column that stretches to its container's height (fluted shaft is CSS). */
export function IonicColumn({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col text-primary", className)}>
      <svg viewBox="0 0 40 22" className="block w-full" fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d="M1 1.5 H39 V5.5 H1 Z" />
        <path d="M6 5.5 Q20 15 34 5.5" />
        <circle cx="6.5" cy="10" r="4" />
        <circle cx="6.5" cy="10" r="1.3" fill="currentColor" />
        <circle cx="33.5" cy="10" r="4" />
        <circle cx="33.5" cy="10" r="1.3" fill="currentColor" />
        <path d="M9 20.5 H31" />
      </svg>
      <div className="fluting mx-[22%] flex-1 border-x border-primary/70" />
      <svg viewBox="0 0 40 12" className="block w-full" fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d="M7 1 H33" />
        <path d="M5 4.5 Q20 1.5 35 4.5" />
        <path d="M2 7 H38 V11 H2 Z" />
      </svg>
    </div>
  );
}

/** Stylobate: the stepped base of a temple. */
export function TempleSteps({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("space-y-[3px]", className)}>
      <div className="mx-4 h-1.5 bg-primary/80" />
      <div className="mx-2 h-1.5 bg-primary/55" />
      <div className="h-1.5 bg-primary/35" />
    </div>
  );
}

/* Laurel wreath: leaves placed along two mirrored arcs. Computed once at module load. */
const CX = 60;
const CY = 52;
const R = 42;
const rad = (d: number) => (d * Math.PI) / 180;
const round = (n: number) => Math.round(n * 100) / 100;
const LEAVES = Array.from({ length: 8 }, (_, i) => {
  const a = 112 + i * 19;
  const side = i % 2 === 0 ? -1 : 1;
  const r = R + side * 4.5;
  return {
    x: round(CX + r * Math.cos(rad(a))),
    y: round(CY + r * Math.sin(rad(a))),
    rot: round(a + 90 + side * 28),
  };
});
const STEM_FROM = { x: round(CX + R * Math.cos(rad(108))), y: round(CY + R * Math.sin(rad(108))) };
const STEM_TO = { x: round(CX + R * Math.cos(rad(250))), y: round(CY + R * Math.sin(rad(250))) };

function LaurelBranch() {
  return (
    <g>
      <path
        d={`M${STEM_FROM.x} ${STEM_FROM.y} A${R} ${R} 0 0 1 ${STEM_TO.x} ${STEM_TO.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      {LEAVES.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx={7.5}
          ry={2.9}
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
          fill="currentColor"
        />
      ))}
    </g>
  );
}

/** Wraps content (e.g. a score) in a bronze laurel wreath — used only for scores of 8+. */
export function Laurel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 104"
        className="absolute inset-0 h-full w-full text-bronze/85"
      >
        <LaurelBranch />
        <g transform="translate(120 0) scale(-1 1)">
          <LaurelBranch />
        </g>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
export function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}
