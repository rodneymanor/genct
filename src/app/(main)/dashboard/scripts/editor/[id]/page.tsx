"use client";

import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft, Save, Download, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ScriptAnalysis {
  wordCount: number;
  estimatedDuration: number;
  readabilityScore: number;
  hookStrength: number;
}

export default function ScriptEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [script, setScript] = useState("");
  const [originalScript, setOriginalScript] = useState("");
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Get script data from URL params or localStorage
  useEffect(() => {
    const scriptFromUrl = searchParams.get("script");
    const titleFromUrl = searchParams.get("title");
    const analysisFromUrl = searchParams.get("analysis");

    if (scriptFromUrl) {
      const decodedScript = decodeURIComponent(scriptFromUrl);
      setScript(decodedScript);
      setOriginalScript(decodedScript);
    }

    if (titleFromUrl) {
      setTitle(decodeURIComponent(titleFromUrl));
    }

    if (analysisFromUrl) {
      try {
        const decodedAnalysis = JSON.parse(decodeURIComponent(analysisFromUrl));
        setAnalysis(decodedAnalysis);
      } catch (error) {
        console.error("Failed to parse analysis:", error);
      }
    }

    // Fallback: try to get from localStorage
    if (!scriptFromUrl) {
      const savedScript = localStorage.getItem(`script-${params.id}`);
      if (savedScript) {
        try {
          const scriptData = JSON.parse(savedScript);
          setScript(scriptData.content);
          setOriginalScript(scriptData.content);
          setTitle(scriptData.title || "Untitled Script");
          setAnalysis(scriptData.analysis || null);
        } catch (error) {
          console.error("Failed to load script from localStorage:", error);
        }
      }
    }
  }, [params.id, searchParams]);

  // Track changes
  useEffect(() => {
    setHasChanges(script !== originalScript);
  }, [script, originalScript]);

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [script, hasChanges]);

  const handleAutoSave = async () => {
    if (!hasChanges) return;

    try {
      const scriptData = {
        content: script,
        title,
        analysis,
        lastModified: new Date().toISOString()
      };

      localStorage.setItem(`script-${params.id}`, JSON.stringify(scriptData));
      setOriginalScript(script);
      console.log("Script auto-saved");
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await handleAutoSave();
      toast.success("Script saved successfully!");
    } catch (error) {
      toast.error("Failed to save script");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Script copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy script");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "script"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Script downloaded!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to the original script? All changes will be lost.")) {
      setScript(originalScript);
      toast.success("Script reset to original version");
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to go back?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  // Calculate real-time analysis
  const calculateAnalysis = (text: string): ScriptAnalysis => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const estimatedDuration = Math.round((wordCount / 150) * 60); // 150 WPM average
    
    // Simple readability score (Flesch-like)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));
    
    // Hook strength based on first 50 words
    const firstWords = words.slice(0, 50).join(" ").toLowerCase();
    const hookWords = ["you", "imagine", "what if", "did you know", "picture this", "have you ever"];
    const hookMatches = hookWords.filter(word => firstWords.includes(word)).length;
    const hookStrength = Math.min(100, (hookMatches / hookWords.length) * 100 + 20);

    return {
      wordCount,
      estimatedDuration,
      readabilityScore: Math.round(readabilityScore),
      hookStrength: Math.round(hookStrength)
    };
  };

  const currentAnalysis = script ? calculateAnalysis(script) : analysis;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{title || "Script Editor"}</h1>
              {hasChanges && (
                <p className="text-xs text-muted-foreground">Unsaved changes</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* Script Editor */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Script Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Your script content will appear here..."
                className="min-h-[600px] font-mono text-sm leading-relaxed resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Script Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentAnalysis ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentAnalysis.wordCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Words</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.floor(currentAnalysis.estimatedDuration / 60)}:
                        {(currentAnalysis.estimatedDuration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Readability</span>
                        <span>{currentAnalysis.readabilityScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${currentAnalysis.readabilityScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hook Strength</span>
                        <span>{currentAnalysis.hookStrength}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${currentAnalysis.hookStrength}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Quality Indicators</h4>
                    <div className="space-y-2">
                      <Badge variant={currentAnalysis.wordCount >= 100 ? "default" : "secondary"}>
                        {currentAnalysis.wordCount >= 100 ? "✓" : "○"} Word Count
                      </Badge>
                      <Badge variant={currentAnalysis.readabilityScore >= 60 ? "default" : "secondary"}>
                        {currentAnalysis.readabilityScore >= 60 ? "✓" : "○"} Readability
                      </Badge>
                      <Badge variant={currentAnalysis.hookStrength >= 50 ? "default" : "secondary"}>
                        {currentAnalysis.hookStrength >= 50 ? "✓" : "○"} Hook Strength
                      </Badge>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Start typing to see analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 