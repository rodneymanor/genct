"use client";

import { useState } from "react";
import { Sparkles, Clock, Users, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const toneOptions = [
  { id: "witty", label: "Witty", description: "Humorous and clever" },
  { id: "inspirational", label: "Inspirational", description: "Motivating and uplifting" },
  { id: "educational", label: "Educational", description: "Informative and teaching" },
  { id: "casual", label: "Casual", description: "Relaxed and friendly" },
  { id: "professional", label: "Professional", description: "Formal and authoritative" }
];

const examplePrompts = [
  "5 morning habits that changed my life",
  "The psychology behind viral content",
  "3 editing tricks for better engagement",
  "Why 99% of creators fail (and how to be the 1%)",
  "My biggest social media mistake"
];

export default function NewScriptPage() {
  const [idea, setIdea] = useState("");
  const [selectedTone, setSelectedTone] = useState("educational");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      // Navigate to script response page
      window.location.href = "/dashboard/scripts/new-response";
    }, 2000);
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Create New Script</h1>
        <p className="text-muted-foreground">
          Let&apos;s create something amazing together! Choose your content style and provide some details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 @5xl/main:grid-cols-3">
        {/* Main Input Form */}
        <div className="@5xl/main:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                What's your next video idea?
              </CardTitle>
              <CardDescription>
                Describe your concept and let AI craft the perfect script for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idea">Video Concept</Label>
                <Textarea
                  id="idea"
                  placeholder="e.g., A 3-step morning routine for busy entrepreneurs..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about your target audience and key takeaways
                </p>
              </div>

              <div className="space-y-3">
                <Label>Tone of Voice</Label>
                <div className="grid grid-cols-2 gap-2 @md/main:grid-cols-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`rounded-lg border-2 p-3 text-left transition-colors ${
                        selectedTone === tone.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-sm">{tone.label}</div>
                      <div className="text-xs text-muted-foreground">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!idea.trim() || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Scripts Created</span>
                </div>
                <Badge variant="secondary">42</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <Badge variant="secondary">89%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg. Views</span>
                </div>
                <Badge variant="secondary">12.4K</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Need Inspiration?</CardTitle>
              <CardDescription className="text-xs">
                Click any example to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setIdea(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <p className="text-sm font-medium line-clamp-2">{prompt}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 