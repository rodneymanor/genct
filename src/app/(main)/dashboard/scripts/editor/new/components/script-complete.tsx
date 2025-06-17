import { Download, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ScriptCompleteProps {
  state: any;
  sourcesCount: number;
  extractedSourcesCount: number;
  onCopyToClipboard: () => void;
  onExport: (format: "pdf" | "txt") => void;
}

export function ScriptComplete({
  state,
  sourcesCount,
  extractedSourcesCount,
  onCopyToClipboard,
  onExport,
}: ScriptCompleteProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Script Complete!</CardTitle>
              <CardDescription>Your script has been generated successfully.</CardDescription>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">{sourcesCount}</div>
                <div className="text-muted-foreground text-xs">Sources</div>
              </div>
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">{extractedSourcesCount}</div>
                <div className="text-muted-foreground text-xs">Extracted</div>
              </div>
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">{state.components?.hooks?.length ?? 0}</div>
                <div className="text-muted-foreground text-xs">Components</div>
              </div>
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">1</div>
                <div className="text-muted-foreground text-xs">Final Script</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={onCopyToClipboard} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy Script
              </Button>
              <Button onClick={() => onExport("pdf")} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={() => onExport("txt")} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export TXT
              </Button>
            </div>
            <div className="rounded-lg border bg-gray-50 p-4">
              <pre className="text-sm whitespace-pre-wrap">{state.finalScript}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
