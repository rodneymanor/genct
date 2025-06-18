"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Clock,
  Target,
  MessageCircle,
  Heart,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScriptTweetCardProps {
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
    avatar?: string;
  };
  timestamp?: string;
  stats?: {
    likes: number;
    retweets: number;
    replies: number;
  };
  className?: string;
}

const categoryColors = {
  Trending: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Educational: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Quick Tips": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Personal: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  Seasonal: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const difficultyColors = {
  Easy: "text-green-600 dark:text-green-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  Advanced: "text-red-600 dark:text-red-400",
};

export function ScriptTweetCard({
  id,
  category,
  title,
  description,
  estimatedLength,
  difficulty,
  tags,
  icon: IconComponent,
  trending,
  engagement,
  author = {
    name: "Script Studio",
    handle: "@scriptstudio",
  },
  timestamp = "2h",
  stats = {
    likes: Math.floor(Math.random() * 100) + 20,
    retweets: Math.floor(Math.random() * 50) + 5,
    replies: Math.floor(Math.random() * 30) + 3,
  },
  className,
}: ScriptTweetCardProps) {
  const router = useRouter();

  const handleUseIdea = () => {
    const prompt = `Create a ${estimatedLength} script about "${title}". ${description}`;
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/dashboard/scripts/editor/new?prompt=${encodedPrompt}`);
  };

  return (
    <article
      className={cn(
        "group relative cursor-pointer border-b border-border/50 bg-background p-4 transition-all duration-200 hover:bg-muted/30",
        className
      )}
      onClick={handleUseIdea}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-border">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{author.name}</span>
            <span className="text-muted-foreground">{author.handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{timestamp}</span>
            {trending && (
              <>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1 text-orange-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Trending</span>
                </div>
              </>
            )}
          </div>

          {/* Tweet Content */}
          <div className="mt-2 space-y-3">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs font-medium", categoryColors[category])}>
                {category}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", difficultyColors[difficulty])}>
                {difficulty}
              </Badge>
            </div>

            {/* Main Content */}
            <div className="space-y-2">
              <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{estimatedLength}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>{difficulty}</span>
              </div>
              {engagement && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{engagement} Engagement</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="text-primary text-xs hover:underline">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                size="sm"
                className="gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseIdea();
                }}
              >
                <Play className="h-3 w-3" />
                Create Script
              </Button>
            </div>
          </div>

          {/* Tweet Actions */}
          <div className="mt-4 flex items-center justify-between max-w-md">
            <button className="group/action flex items-center gap-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-blue-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{stats.replies}</span>
            </button>
            
            <button className="group/action flex items-center gap-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-green-500/10 hover:text-green-500">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{stats.retweets}</span>
            </button>
            
            <button className="group/action flex items-center gap-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{stats.likes}</span>
            </button>
            
            <button className="group/action rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-blue-500">
              <Share className="h-4 w-4" />
            </button>
            
            <button className="group/action rounded-full p-2 text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-blue-500">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* More Options */}
        <button className="rounded-full p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted group-hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
} 