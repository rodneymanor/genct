import { Search, FileText, Zap, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScriptLoadingStatesProps {
  step: string;
  sourcesCount: number;
  extractedSourcesCount: number;
}

export function ScriptLoadingStates({ step, sourcesCount, extractedSourcesCount }: ScriptLoadingStatesProps) {
  const getProgressPercentage = () => {
    switch (step) {
      case "gathering-sources":
        return 20;
      case "extracting-content":
        return 40;
      case "generating-components":
        return 60;
      case "generating-script":
        return 90;
      default:
        return 0;
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "gathering-sources":
        return "Finding relevant research sources...";
      case "extracting-content":
        return `Extracting content from ${sourcesCount} sources...`;
      case "generating-components":
        return "Creating script components from research...";
      case "generating-script":
        return "Assembling final script...";
      default:
        return "Processing...";
    }
  };

  const getStepConfig = () => {
    switch (step) {
      case "gathering-sources":
        return {
          icon: <Search className="h-5 w-5" />,
          title: "Gathering Research Sources",
          description: "Finding relevant articles, studies, and expert insights for your video idea...",
        };
      case "extracting-content":
        return {
          icon: <FileText className="h-5 w-5" />,
          title: "Extracting Content",
          description: `Analyzing and extracting valuable information from ${sourcesCount} research sources...`,
          showStats: true,
        };
      case "generating-components":
        return {
          icon: <Zap className="h-5 w-5" />,
          title: "Generating Script Components",
          description: "Creating hooks, bridges, golden nuggets, and calls-to-action based on your research...",
        };
      case "generating-script":
        return {
          icon: <Sparkles className="h-5 w-5" />,
          title: "Generating Final Script",
          description: "Assembling your components into a cohesive, engaging script...",
        };
      default:
        return {
          icon: <div className="h-5 w-5" />,
          title: "Processing",
          description: "Please wait...",
        };
    }
  };

  const config = getStepConfig();

  return (
    <Card className="flex h-[500px] flex-col items-center justify-center">
      <CardContent className="max-w-md space-y-6 text-center">
        <div className="border-primary mx-auto h-16 w-16 animate-spin rounded-full border-4 border-t-transparent" />
        <div className="space-y-2">
          <h3 className="flex items-center justify-center gap-2 text-lg font-semibold">
            {config.icon}
            {config.title}
          </h3>
          <p className="text-muted-foreground">{config.description}</p>
          {config.showStats && (
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Sources found: <span className="text-foreground font-medium">{sourcesCount}</span>
              </span>
              <span className="text-muted-foreground">
                Extracted: <span className="text-foreground font-medium">{extractedSourcesCount}</span>
              </span>
            </div>
          )}
        </div>
        <Progress value={getProgressPercentage()} className="w-full" />
        <p className="text-muted-foreground text-sm">{getStepDescription()}</p>
      </CardContent>
    </Card>
  );
}
