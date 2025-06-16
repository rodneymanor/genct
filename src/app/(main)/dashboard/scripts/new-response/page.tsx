"use client";

import { useState } from "react";

import { Send, RefreshCw, Save, CheckCircle, Copy, Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialScript = {
  hook: [
    "What if I told you that 5 simple morning habits could completely transform your productivity?",
    "The most successful entrepreneurs all share these 5 morning rituals...",
    "I used to struggle with productivity until I discovered these 5 game-changing habits",
  ],
  bridge:
    "In this video, I'll walk you through the exact 5-step morning routine that helped me increase my productivity by 300% and how you can implement it starting tomorrow. These aren't just random tips - they're scientifically-backed strategies that top performers use every single day.",
  cta: [
    "What's your current morning routine? Drop it in the comments below!",
    "Try this routine for 7 days and let me know how it goes!",
    "Which of these habits will you start with? Comment your choice!",
  ],
  fullScript: `What if I told you that 5 simple morning habits could completely transform your productivity?

In this video, I'll walk you through the exact 5-step morning routine that helped me increase my productivity by 300% and how you can implement it starting tomorrow. These aren't just random tips - they're scientifically-backed strategies that top performers use every single day.

**Habit 1: Wake up at the same time every day**
Your circadian rhythm loves consistency. When you wake up at the same time, your body naturally prepares for peak performance.

**Habit 2: Hydrate immediately**
After 8 hours without water, your body is dehydrated. Start with 16-20oz of water to kickstart your metabolism.

**Habit 3: Move your body for 10 minutes**
Whether it's stretching, yoga, or jumping jacks - movement increases blood flow and mental clarity.

**Habit 4: Practice gratitude**
Write down 3 things you're grateful for. This simple practice rewires your brain for positivity and focus.

**Habit 5: Plan your top 3 priorities**
Before checking emails or social media, decide on your 3 most important tasks for the day.

These 5 habits take less than 30 minutes but will transform your entire day.

What's your current morning routine? Drop it in the comments below!`,
};

const chatHistory = [
  {
    type: "user",
    message: "5 morning habits that changed my life",
    timestamp: "2 minutes ago",
  },
  {
    type: "ai",
    message:
      "Great idea! I've created a comprehensive script about 5 transformative morning habits. The script focuses on practical, science-backed strategies that top performers use. I've structured it with a compelling hook, detailed explanations for each habit, and an engaging call-to-action. You can see the full script and individual elements on the right. Feel free to ask me to modify any part!",
    timestamp: "1 minute ago",
  },
];

export default function ScriptResponsePage() {
  const [messages, setMessages] = useState(chatHistory);
  const [newMessage, setNewMessage] = useState("");
  const [selectedHook, setSelectedHook] = useState(0);
  const [selectedCta, setSelectedCta] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      type: "user" as const,
      message: newMessage,
      timestamp: "Just now",
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "ai" as const,
        message: "I've updated the script based on your feedback. Check out the changes in the script elements panel!",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleRegenerate = (section: string) => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      // In a real app, this would call the AI API
    }, 1500);
  };

  const handleFinalize = () => {
    // Navigate to final editor
    window.location.href = "/dashboard/scripts/editor/new";
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Script Generation</h1>
          <p className="text-muted-foreground">Refine your script with AI assistance</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button onClick={handleFinalize} size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalize Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 @5xl/main:grid-cols-5">
        {/* Chat Interface */}
        <div className="@5xl/main:col-span-3">
          <Card className="flex h-[600px] flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chat with AI</CardTitle>
              <CardDescription>Ask for changes, improvements, or variations</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
              <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask for changes, improvements, or new ideas..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Script Elements Panel */}
        <div className="space-y-4 @5xl/main:col-span-2">
          {/* Hook Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Hook</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleRegenerate("hook")} disabled={isRegenerating}>
                  <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {initialScript.hook.map((hook, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedHook === index ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedHook(index)}
                >
                  <p className="text-sm">{hook}</p>
                  {selectedHook === index && (
                    <Badge variant="outline" className="mt-2">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bridge Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Bridge/Body</CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg border p-3">
                <p className="text-sm">{initialScript.bridge}</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Call to Action</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleRegenerate("cta")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {initialScript.cta.map((cta, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedCta === index ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedCta(index)}
                >
                  <p className="text-sm">{cta}</p>
                  {selectedCta === index && (
                    <Badge variant="outline" className="mt-2">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
