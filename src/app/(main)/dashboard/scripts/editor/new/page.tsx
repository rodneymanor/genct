"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Copy, Save, Eye, Type, Sparkles, ArrowLeft, Loader2, RefreshCw, Search, FileText, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScriptComponentSelectors } from "@/components/ui/script-component-selector";
import { useScriptwriting } from "@/hooks/use-scriptwriting";

export default function ScriptEditorPage() {
  const searchParams = useSearchParams();
  const promptFromUrl = searchParams.get("prompt");
  
  const [scriptTitle, setScriptTitle] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");

  const {
    state,
    startScriptwriting,
    updateSelectedComponent,
    generateFinalScript,
    reset,
    backToSelection,
    canGenerateScript,
    isGenerating,
    hasError,
    isComplete,
    currentStep,
    sourcesCount,
    extractedSourcesCount
  } = useScriptwriting();

  // Initialize scriptwriting process when prompt is provided
  useEffect(() => {
    if (promptFromUrl && state.step === 'idle') {
      setScriptTitle("New Script");
      startScriptwriting(promptFromUrl);
    }
  }, [promptFromUrl, state.step, startScriptwriting]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved("Just now");
    }, 1000);
  };

  const handleExport = (format: "pdf" | "txt") => {
    alert(`Exporting as ${format.toUpperCase()}...`);
  };

  const handleCopyToClipboard = () => {
    const contentToCopy = state.finalScript || "No script generated yet";
    navigator.clipboard.writeText(contentToCopy);
    alert("Script copied to clipboard!");
  };

  const handleComponentSelect = (type: string, component: any) => {
    updateSelectedComponent(type as any, component);
  };

  const handleStartOver = () => {
    reset();
    setScriptTitle("");
  };

  // Get progress percentage based on current step
  const getProgressPercentage = () => {
    switch (state.step) {
      case 'idle': return 0;
      case 'gathering-sources': return 20;
      case 'extracting-content': return 40;
      case 'generating-components': return 60;
      case 'selecting-components': return 80;
      case 'generating-script': return 90;
      case 'complete': return 100;
      default: return 0;
    }
  };

  // Get step description
  const getStepDescription = () => {
    switch (state.step) {
      case 'gathering-sources': return 'Finding relevant research sources...';
      case 'extracting-content': return `Extracting content from ${sourcesCount} sources...`;
      case 'generating-components': return 'Creating script components from research...';
      case 'selecting-components': return 'Ready for component selection';
      case 'generating-script': return 'Assembling final script...';
      case 'complete': return 'Script generation complete!';
      default: return 'Ready to start';
    }
  };

  // Render different phases of the scriptwriting process
  const renderContent = () => {
    switch (state.step) {
      case 'gathering-sources':
        return (
          <Card className="flex h-[500px] flex-col items-center justify-center">
            <CardContent className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Gathering Research Sources
                </h3>
                <p className="text-muted-foreground">
                  Finding relevant articles, studies, and expert insights for your video idea...
                </p>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
              <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
            </CardContent>
          </Card>
        );

      case 'extracting-content':
        return (
          <Card className="flex h-[500px] flex-col items-center justify-center">
            <CardContent className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Extracting Content
                </h3>
                <p className="text-muted-foreground">
                  Analyzing and extracting valuable information from {sourcesCount} research sources...
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Sources found: <span className="font-medium text-foreground">{sourcesCount}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Extracted: <span className="font-medium text-foreground">{extractedSourcesCount}</span>
                  </span>
                </div>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
              <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
            </CardContent>
          </Card>
        );

      case 'generating-components':
        return (
          <Card className="flex h-[500px] flex-col items-center justify-center">
            <CardContent className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Generating Script Components
                </h3>
                <p className="text-muted-foreground">
                  Creating hooks, bridges, golden nuggets, and calls-to-action based on your research...
                </p>
                <div className="text-sm text-muted-foreground">
                  Using insights from {extractedSourcesCount} research sources
                </div>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
              <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
            </CardContent>
          </Card>
        );

      case 'selecting-components':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Choose Your Script Components
                </CardTitle>
                <CardDescription>
                  Select the best options for each part of your script. These components were generated using insights from {extractedSourcesCount} research sources. We've pre-selected our recommendations, but feel free to explore other options.
                </CardDescription>
                {state.sources.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Research Sources Used:</h4>
                    <div className="space-y-2">
                      {state.sources.slice(0, 3).map((source, index) => (
                        <div key={index} className="text-xs p-3 bg-muted rounded border-l-2 border-primary/20 overflow-hidden">
                          <div className="font-medium truncate mb-1">{source.title}</div>
                          <div className="text-muted-foreground line-clamp-2 break-words">{source.snippet}</div>
                        </div>
                      ))}
                      {state.sources.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center py-1">
                          +{state.sources.length - 3} more sources
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>
            
            {state.components && (
              <ScriptComponentSelectors
                components={state.components}
                selectedComponents={state.selectedComponents}
                onComponentSelect={handleComponentSelect}
                onGenerateScript={generateFinalScript}
                canGenerate={canGenerateScript}
                isGenerating={isGenerating}
              />
            )}
          </div>
        );

      case 'generating-script':
        return (
          <Card className="flex h-[500px] flex-col items-center justify-center">
            <CardContent className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Assembling Your Script</h3>
                <p className="text-muted-foreground">
                  Combining your selected components into a cohesive, engaging script...
                </p>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
              <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
            </CardContent>
          </Card>
        );

      case 'complete':
        return (
          <div className="space-y-4">
            {/* Script Analysis */}
            {state.analysis && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Script Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{state.analysis.wordCount}</div>
                      <div className="text-xs text-muted-foreground">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{state.analysis.estimatedDuration}s</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{state.analysis.readabilityScore}</div>
                      <div className="text-xs text-muted-foreground">Readability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{state.analysis.hookStrength}</div>
                      <div className="text-xs text-muted-foreground">Hook Strength</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Script Editor */}
            <Card className="flex h-[600px] flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="title">Script Title</Label>
                    <Input
                      id="title"
                      value={scriptTitle}
                      onChange={(e) => setScriptTitle(e.target.value)}
                      className="text-lg font-semibold"
                    />
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={backToSelection}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Edit Components
                    </Button>
                    <Button variant={isPreview ? "ghost" : "default"} size="sm" onClick={() => setIsPreview(false)}>
                      <Type className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant={isPreview ? "default" : "ghost"} size="sm" onClick={() => setIsPreview(true)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                {isPreview ? (
                  <div className="prose prose-sm h-full max-w-none overflow-y-auto p-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: state.finalScript
                          .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                          .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                          .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                          .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
                          .replace(/\*(.*)\*/gim, "<em>$1</em>")
                          .replace(/\n/gim, "<br/>"),
                      }}
                    />
                  </div>
                ) : (
                  <Textarea
                    value={state.finalScript}
                    onChange={(e) => {
                      // Allow manual editing of the final script
                      // You could update the state here if needed
                    }}
                    className="h-full resize-none border-0 p-6 text-base leading-relaxed focus-visible:ring-0"
                    placeholder="Your generated script will appear here..."
                  />
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'error':
        return (
          <Card className="flex h-[500px] flex-col items-center justify-center">
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">{state.error}</p>
              </div>
              <Button onClick={handleStartOver} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="flex h-[500px] flex-col items-center justify-center">
            <CardContent className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Ready to Create</h3>
                <p className="text-muted-foreground">
                  Enter a video idea in the search bar above to get started with AI-powered script generation.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Script Editor</h1>
              {state.videoIdea && (
                <Badge variant="secondary" className="text-xs">
                  {state.videoIdea}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {state.step === 'complete' ? `Last saved: ${lastSaved}` : 'AI-powered script generation with research'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {state.step === 'complete' && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("txt")}>
                <Download className="mr-2 h-4 w-4" />
                TXT
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          )}
          {state.step !== 'idle' && state.step !== 'complete' && (
            <Button variant="outline" size="sm" onClick={handleStartOver}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="@5xl/main:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
}
