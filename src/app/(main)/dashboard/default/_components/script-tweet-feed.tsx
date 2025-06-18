"use client";

import React from "react";

import { useRouter } from "next/navigation";

import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  Heart,
  Users,
  Calendar,
  Star,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScriptTweetCard } from "@/components/ui/script-tweet-card";
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
  author?: {
    name: string;
    handle: string;
  };
  timestamp?: string;
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
    author: {
      name: "Wellness Creator",
      handle: "@wellnesscreator",
    },
    timestamp: "2h",
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
    author: {
      name: "Content Strategist",
      handle: "@contentstrat",
    },
    timestamp: "4h",
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
    author: {
      name: "Video Editor Pro",
      handle: "@videoeditor",
    },
    timestamp: "6h",
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
    author: {
      name: "Creator Stories",
      handle: "@creatorstories",
    },
    timestamp: "8h",
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
    author: {
      name: "Growth Expert",
      handle: "@growthexpert",
    },
    timestamp: "12h",
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
    author: {
      name: "Brand Builder",
      handle: "@brandbuilder",
    },
    timestamp: "1d",
  },
];

interface ScriptTweetFeedProps {
  className?: string;
}

export function ScriptTweetFeed({ className }: ScriptTweetFeedProps) {
  const router = useRouter();

  return (
    <div id="script-tweet-feed" className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Feed Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Script Ideas</h2>
            <p className="text-sm text-muted-foreground">Trending content ideas for creators</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/inspiration")}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            More Ideas
          </Button>
        </div>
      </div>

      {/* Tweet-style Feed */}
      <div className="divide-y divide-border/50">
        {scriptSuggestions.map((suggestion) => (
          <ScriptTweetCard
            key={suggestion.id}
            id={suggestion.id}
            category={suggestion.category}
            title={suggestion.title}
            description={suggestion.description}
            estimatedLength={suggestion.estimatedLength}
            difficulty={suggestion.difficulty}
            tags={suggestion.tags}
            icon={suggestion.icon}
            trending={suggestion.trending}
            engagement={suggestion.engagement}
            author={suggestion.author}
            timestamp={suggestion.timestamp}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="border-t border-border/50 p-4 text-center">
        <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard/inspiration")}>
          <Star className="h-4 w-4" />
          Show more script ideas
        </Button>
      </div>
    </div>
  );
} 