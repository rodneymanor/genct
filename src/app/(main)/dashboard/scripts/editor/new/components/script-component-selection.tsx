import { Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScriptComponentSelectors } from "@/components/ui/script-component-selector";

interface ScriptComponentSelectionProps {
  state: any;
  extractedSourcesCount: number;
  onComponentSelect: (type: string, component: any) => void;
}

export function ScriptComponentSelection({
  state,
  extractedSourcesCount,
  onComponentSelect,
}: ScriptComponentSelectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            Choose Your Script Components
          </CardTitle>
          <CardDescription>
            Select the best options for each part of your script. These components were generated using insights from{" "}
            {extractedSourcesCount} research sources. We&apos;ve pre-selected our recommendations, but feel free to
            explore other options.
          </CardDescription>
          {state.sources.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Research Sources Used:</h4>
              <div className="space-y-2">
                {state.sources.slice(0, 3).map((source: any, index: number) => (
                  <div
                    key={index}
                    className="bg-muted border-primary/20 overflow-hidden rounded border-l-2 p-3 text-xs"
                  >
                    <div className="mb-1 truncate font-medium">{source.title}</div>
                    <div className="text-muted-foreground line-clamp-2 break-words">{source.snippet}</div>
                  </div>
                ))}
                {state.sources.length > 3 && (
                  <div className="text-muted-foreground py-1 text-center text-xs">
                    ...and {state.sources.length - 3} more sources
                  </div>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {state.components && (
            <ScriptComponentSelectors
              components={state.components}
              selectedComponents={state.selectedComponents}
              onComponentSelect={onComponentSelect}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
