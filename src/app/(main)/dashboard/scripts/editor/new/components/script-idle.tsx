import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ScriptIdle() {
  return (
    <Card className="flex h-[500px] flex-col items-center justify-center">
      <CardContent className="space-y-4 text-center">
        <div className="text-muted-foreground mx-auto h-16 w-16">
          <Sparkles className="h-full w-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Ready to Generate</h3>
          <p className="text-muted-foreground text-sm">Enter a video idea to start the scriptwriting process</p>
        </div>
      </CardContent>
    </Card>
  );
}
