import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface WhyBoxProps {
  explanation: string;
}

export function WhyBox({ explanation }: WhyBoxProps) {
  return (
    <Alert className="border-border bg-secondary/50">
      <Info className="size-4 text-primary shrink-0" />
      <AlertDescription className="font-sans text-sm text-foreground leading-relaxed">
        <strong className="font-semibold text-primary">Why: </strong>
        {explanation}
      </AlertDescription>
    </Alert>
  );
}
