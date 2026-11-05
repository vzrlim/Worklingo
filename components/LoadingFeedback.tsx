import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export function LoadingFeedback() {
  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="size-5 animate-spin" />
          <h3 className="font-serif text-lg font-bold">
            Coach is reviewing your answer…
          </h3>
        </div>
        <p className="text-xs text-muted-foreground font-sans">
          Analyzing structure, keyword clarity, and tailoring feedback.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}
