"use client";

import React from "react";

import { useRouter } from "next/navigation";

import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  Clock,
  Users,
  Heart,
  ArrowRight,
  Sparkles,
  Target,
  MessageCircle,
  Calendar,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScriptSuggestion {
  id: string;
  category: "Trending" | "Educational" | "Quick Tips" | "Personal" | "Seasonal";
  title: string;
  description: string;
  estimatedLength: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  tags: string[];
  icon: React.ElementType;
  trending?: boolean;
  engagement?: string;
}

const scriptSuggestions: ScriptSuggestion[] = [
  {
    id: "morning-habits",
    category: "Trending",
    title: "5 Morning Habits That Changed My Life",
    description: "Share personal transformation through simple morning routines that boost productivity and mindset.",
    estimatedLength: "3-5 min",
    difficulty: "Easy",
    tags: ["lifestyle", "productivity", "wellness"],
    icon: TrendingUp,
    trending: true,
    engagement: "High",
  },
  {
    id: "viral-psychology",
    category: "Educational",
    title: "The Psychology Behind Viral Content",
    description: "Break down the mental triggers and patterns that make content spread across social platforms.",
    estimatedLength: "7-10 min",
    difficulty: "Medium",
    tags: ["psychology", "marketing", "social media"],
    icon: BookOpen,
    engagement: "Medium",
  },
  {
    id: "editing-tricks",
    category: "Quick Tips",
    title: "3 Editing Tricks for Better Engagement",
    description: "Simple video editing techniques that keep viewers watching until the end.",
    estimatedLength: "2-3 min",
    difficulty: "Easy",
    tags: ["editing", "engagement", "tutorial"],
    icon: Lightbulb,
    engagement: "High",
  },
  {
    id: "content-burnout",
    category: "Personal",
    title: "How I Overcame Content Creator Burnout",
    description: "Personal story about managing creative exhaustion and finding renewed passion for content creation.",
    estimatedLength: "5-7 min",
    difficulty: "Medium",
    tags: ["personal", "mental health", "creativity"],
    icon: Heart,
    engagement: "High",
  },
  {
    id: "audience-growth",
    category: "Educational",
    title: "Why Most People Fail at Growing Their Audience",
    description: "Common mistakes creators make and proven strategies for sustainable audience growth.",
    estimatedLength: "8-12 min",
    difficulty: "Advanced",
    tags: ["growth", "strategy", "audience"],
    icon: Users,
    engagement: "Medium",
  },
  {
    id: "holiday-content",
    category: "Seasonal",
    title: "Holiday Content That Actually Converts",
    description: "Create seasonal content that drives engagement while staying authentic to your brand.",
    estimatedLength: "4-6 min",
    difficulty: "Medium",
    tags: ["seasonal", "conversion", "branding"],
    icon: Calendar,
    trending: true,
    engagement: "High",
  },
];

const categoryColors = {
  Trending: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Educational: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Quick Tips": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Personal: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  Seasonal: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const difficultyColors = {
  Easy: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800",
  Medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-800",
  Advanced: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800",
};

interface ScriptSuggestionCardsProps {
  className?: string;
}

export function ScriptSuggestionCards({ className }: ScriptSuggestionCardsProps) {
  const router = useRouter();

  const handleUseIdea = (suggestion: ScriptSuggestion) => {
    const prompt = `Create a ${suggestion.estimatedLength} script about "${suggestion.title}". ${suggestion.description}`;
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/dashboard/scripts/editor/new?prompt=${encodedPrompt}`);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">Script Ideas to Get You Started</h2>
        <p className="text-muted-foreground text-lg">Choose from trending topics and proven content formats</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scriptSuggestions.map((suggestion) => {
          const IconComponent = suggestion.icon;

          return (
            <Card
              key={suggestion.id}
              className="group hover:border-primary/20 cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleUseIdea(suggestion)}
            >
              <CardHeader className="pb-3">
                <div className="mb-2 flex items-start justify-between">
                  <Badge className={cn("text-xs font-medium", categoryColors[suggestion.category])}>
                    {suggestion.category}
                  </Badge>
                  {suggestion.trending && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                    <IconComponent className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-primary text-lg leading-tight transition-colors">
                      {suggestion.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">{suggestion.description}</CardDescription>

                {/* Metadata */}
                <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {suggestion.estimatedLength}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span
                      className={cn("rounded border px-1.5 py-0.5 text-xs", difficultyColors[suggestion.difficulty])}
                    >
                      {suggestion.difficulty}
                    </span>
                  </div>
                  {suggestion.engagement && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {suggestion.engagement} Engagement
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {suggestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  className="group-hover:bg-primary group-hover:text-primary-foreground w-full gap-2 transition-colors"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseIdea(suggestion);
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Use This Idea
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View More Button */}
      <div className="mt-8 text-center">
        <Button variant="outline" size="lg" onClick={() => router.push("/dashboard/inspiration")} className="gap-2">
          <Star className="h-4 w-4" />
          Explore More Ideas
        </Button>
      </div>
    </div>
  );
}
