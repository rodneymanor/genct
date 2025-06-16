"use client";

import { useState } from "react";
import { 
  Download, 
  Copy, 
  Save, 
  Eye, 
  EyeOff, 
  Bold, 
  Italic, 
  List, 
  Link,
  Type,
  Sparkles,
  ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialScript = `# 5 Morning Habits That Changed My Life

**Hook:** What if I told you that 5 simple morning habits could completely transform your productivity?

## Introduction

In this video, I'll walk you through the exact 5-step morning routine that helped me increase my productivity by 300% and how you can implement it starting tomorrow. These aren't just random tips - they're scientifically-backed strategies that top performers use every single day.

## The 5 Habits

### Habit 1: Wake up at the same time every day
Your circadian rhythm loves consistency. When you wake up at the same time, your body naturally prepares for peak performance.

### Habit 2: Hydrate immediately
After 8 hours without water, your body is dehydrated. Start with 16-20oz of water to kickstart your metabolism.

### Habit 3: Move your body for 10 minutes
Whether it's stretching, yoga, or jumping jacks - movement increases blood flow and mental clarity.

### Habit 4: Practice gratitude
Write down 3 things you're grateful for. This simple practice rewires your brain for positivity and focus.

### Habit 5: Plan your top 3 priorities
Before checking emails or social media, decide on your 3 most important tasks for the day.

## Conclusion

These 5 habits take less than 30 minutes but will transform your entire day.

**Call to Action:** What's your current morning routine? Drop it in the comments below!`;

export default function ScriptEditorPage() {
  const [scriptTitle, setScriptTitle] = useState("5 Morning Habits That Changed My Life");
  const [scriptContent, setScriptContent] = useState(initialScript);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved("Just now");
    }, 1000);
  };

  const handleExport = (format: "pdf" | "txt") => {
    // In a real app, this would trigger file download
    alert(`Exporting as ${format.toUpperCase()}...`);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(scriptContent);
    alert("Script copied to clipboard!");
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = scriptContent.substring(start, end);
    
    let replacement = "";
    switch (syntax) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "list":
        replacement = `\n- ${selectedText || "list item"}`;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](url)`;
        break;
      default:
        replacement = selectedText;
    }
    
    const newContent = scriptContent.substring(0, start) + replacement + scriptContent.substring(end);
    setScriptContent(newContent);
  };

  const aiSuggestions = [
    { type: "rephrase", text: "Make the introduction more engaging" },
    { type: "expand", text: "Add more details to Habit 3" },
    { type: "shorten", text: "Condense the conclusion" },
  ];

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
            <h1 className="text-2xl font-bold tracking-tight">Script Editor</h1>
            <p className="text-sm text-muted-foreground">
              Last saved: {lastSaved}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 @5xl/main:grid-cols-4">
        {/* Main Editor */}
        <div className="@5xl/main:col-span-3">
          <Card className="h-[700px] flex flex-col">
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
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant={isPreview ? "ghost" : "default"}
                    size="sm"
                    onClick={() => setIsPreview(false)}
                  >
                    <Type className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant={isPreview ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsPreview(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Toolbar */}
              {!isPreview && (
                <div className="flex items-center gap-1 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown("bold")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown("italic")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown("link")}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              {isPreview ? (
                <div className="h-full overflow-y-auto p-6 prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{
                    __html: scriptContent
                      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                      .replace(/\*(.*)\*/gim, '<em>$1</em>')
                      .replace(/\n/gim, '<br/>')
                  }} />
                </div>
              ) : (
                <Textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="Start writing your script..."
                  className="h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Script Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Script Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Words</span>
                <Badge variant="secondary">{scriptContent.split(' ').length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Characters</span>
                <Badge variant="secondary">{scriptContent.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Est. Reading Time</span>
                <Badge variant="secondary">{Math.ceil(scriptContent.split(' ').length / 200)} min</Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Writing Tools */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Rewrite Tools
              </CardTitle>
              <CardDescription className="text-xs">
                Select text and click to improve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => alert(`AI suggestion: ${suggestion.text}`)}
                >
                  <div className="text-left">
                    <div className="font-medium text-xs capitalize">{suggestion.type}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.text}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Version History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Version</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
                <Badge variant="outline">Latest</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Draft v2</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  Restore
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 