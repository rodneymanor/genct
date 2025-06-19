"use client";

import { useState, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useScriptwriting } from "@/hooks/use-scriptwriting";

import { ScriptChatEditor } from "./components/script-chat-editor";

export default function ScriptEditorPage() {
  const searchParams = useSearchParams();
  const promptFromUrl = searchParams.get("prompt");

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

  const handleStartOver = () => {
    reset();
    window.location.href = window.location.pathname;
  };

  const handleScriptGeneration = (prompt: string) => {
    startScriptwriting(prompt);
  };

  const handleComponentSelection = (type: string, component: any) => {
    updateSelectedComponent(type as any, component);
  };

  const handleFinalGeneration = () => {
    if (canGenerateScript) {
      generateFinalScript();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Script Editor</h1>
        </div>
        <Button onClick={handleStartOver} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[700px]">
          <ScriptChatEditor
            initialPrompt={promptFromUrl || undefined}
            scriptState={state}
            onStartGeneration={handleScriptGeneration}
            onComponentSelection={handleComponentSelection}
            onFinalGeneration={handleFinalGeneration}
            sourcesCount={sourcesCount}
            extractedSourcesCount={extractedSourcesCount}
            canGenerateScript={canGenerateScript}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
} 