import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function OfflineNotice() {
  return (
    <Alert className="border-warn/40 bg-warn-soft text-warn">
      <AlertCircle className="size-4 text-warn shrink-0" />
      <AlertDescription className="font-sans text-xs font-medium leading-normal text-warn">
        Offline coach mode — AI is busy or offline, here is a structured checklist review based on proven interview frameworks.
      </AlertDescription>
    </Alert>
  );
}
