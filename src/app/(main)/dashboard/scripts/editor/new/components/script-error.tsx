import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ScriptErrorProps {
  error: string;
  onReset: () => void;
}

export function ScriptError({ error, onReset }: ScriptErrorProps) {
  return (
    <Card className="flex h-[500px] flex-col items-center justify-center">
      <CardContent className="space-y-4 text-center">
        <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <RefreshCw className="text-destructive h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <Button onClick={onReset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
