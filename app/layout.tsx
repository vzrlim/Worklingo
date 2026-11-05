import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import { XpChip } from "@/components/XpChip";
import { MeanderBand } from "@/components/greek";
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME, SDG_LABEL, IG_HANDLE } from "@/lib/config";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Workplace Skills & Interview Coach`,
  description:
    "Free mobile-first AI interview simulator and scenario quiz helping university students master workplace communication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="max-w-md mx-auto px-4 h-full flex items-center justify-between">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-wider text-primary hover:opacity-90 transition-opacity"
            >
              {APP_NAME}
            </Link>
            <XpChip />
          </div>
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="bg-card/70 mt-auto pb-6">
          <MeanderBand className="text-bronze/60" />
          <div className="max-w-md mx-auto px-4 pt-6 text-center space-y-3">
            <div>
              <Badge
                variant="outline"
                className="text-xs font-sans text-muted-foreground border-border"
              >
                {SDG_LABEL}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Campaign updates on Instagram:{" "}
              <a
                href={`https://instagram.com/${IG_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                @{IG_HANDLE}
              </a>
            </p>
            <p className="text-xs font-serif font-semibold text-foreground">
              {APP_NAME} — free workplace skills practice for students
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-sans">
              Answers are sent to Google&apos;s Gemini (free tier) to generate
              feedback and may be used by Google to improve its products.
              Don&apos;t type personal or sensitive information. We don&apos;t
              store your answers.
            </p>
          </div>
        </footer>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
