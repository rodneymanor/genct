"use client";

import { useState, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { Save, Eye, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScriptwriting } from "@/hooks/use-scriptwriting";

import { ScriptComplete } from "./components/script-complete";
import { ScriptComponentSelection } from "./components/script-component-selection";
import { ScriptError } from "./components/script-error";
import { ScriptIdle } from "./components/script-idle";
import { ScriptLoadingStates } from "./components/script-loading-states";

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
    canGenerateScript,
    isGenerating,
    sourcesCount,
    extractedSourcesCount,
  } = useScriptwriting();

  // Initialize scriptwriting process when prompt is provided
  useEffect(() => {
    if (promptFromUrl && state.step === "idle") {
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

  // Main render content function
  const renderContent = () => {
    switch (state.step) {
      case "gathering-sources":
      case "extracting-content":
      case "generating-components":
      case "generating-script":
        return (
          <ScriptLoadingStates
            step={state.step}
            sourcesCount={sourcesCount}
            extractedSourcesCount={extractedSourcesCount}
          />
        );
      case "selecting-components":
        return (
          <ScriptComponentSelection
            state={state}
            extractedSourcesCount={extractedSourcesCount}
            onComponentSelect={handleComponentSelect}
          />
        );
      case "complete":
        return (
          <ScriptComplete
            state={state}
            sourcesCount={sourcesCount}
            extractedSourcesCount={extractedSourcesCount}
            onCopyToClipboard={handleCopyToClipboard}
            onExport={handleExport}
          />
        );
      case "error":
        return <ScriptError error={state.error ?? "An unknown error occurred"} onReset={reset} />;
      default:
        return <ScriptIdle />;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Script Editor</h1>
            <p className="text-muted-foreground text-sm">
              {state.step === "complete" ? `Last saved: ${lastSaved}` : "AI-powered script generation with research"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {state.step === "complete" && (
            <>
              <Button onClick={handleSave} disabled={isSaving} variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={() => setIsPreview(!isPreview)} variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                {isPreview ? "Edit" : "Preview"}
              </Button>
            </>
          )}
          {state.step === "selecting-components" && (
            <Button onClick={generateFinalScript} disabled={!canGenerateScript || isGenerating}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Script"}
            </Button>
          )}
          {state.step !== "idle" && state.step !== "complete" && (
            <Button onClick={handleStartOver} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </div>

      {/* Title Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Script Title</Label>
            <Input
              id="title"
              placeholder="Enter your script title..."
              value={scriptTitle}
              onChange={(e) => setScriptTitle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}
