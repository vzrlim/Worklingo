import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MeanderBand } from "@/components/greek";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center space-y-5 py-16">
      <h1 className="font-serif text-3xl font-bold tracking-tight">
        Page not found
      </h1>
      <MeanderBand className="mx-auto w-28 text-bronze/70" />
      <p className="font-sans text-base text-muted-foreground leading-relaxed">
        This page doesn&apos;t exist. Head back to the start and pick a
        practice mode.
      </p>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        size="lg"
        className="w-full sm:w-auto"
      >
        Back to home
      </Button>
    </div>
  );
}
