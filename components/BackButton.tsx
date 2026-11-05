"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CLASSES =
  "-ml-3 px-3 gap-2 text-sm font-sans text-muted-foreground hover:text-foreground";

/** In-app back navigation (44 px tap target). Use `href` for pages, `onClick` for in-page steps. */
export function BackButton({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Button
        variant="ghost"
        size="lg"
        nativeButton={false}
        render={<Link href={href} />}
        className={CLASSES}
      >
        <ArrowLeft className="size-4" />
        {children}
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="lg" onClick={onClick} className={CLASSES}>
      <ArrowLeft className="size-4" />
      {children}
    </Button>
  );
}
