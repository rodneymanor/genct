"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share, Eye, Clock, Hash, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoMetadataProps {
  title: string;
  description?: string;
  author?: string;
  platform: 'tiktok' | 'instagram' | 'other';
  likes?: number;
  views?: number;
  duration?: number;
  hashtags?: string[];
  extractedAt?: string;
  addedAt?: string;
  url: string;
  className?: string;
}

export function VideoMetadata({
  title,
  description,
  author,
  platform,
  likes = 0,
  views = 0,
  duration = 0,
  hashtags = [],
  extractedAt,
  addedAt,
  url,
  className = ""
}: VideoMetadataProps) {
  const [activeTab, setActiveTab] = useState("details");

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  // Extract hashtags from title/description if not provided
  const extractedHashtags = hashtags.length > 0 ? hashtags : 
    [...(title?.match(/#[\w]+/g) || []), ...(description?.match(/#[\w]+/g) || [])]
      .map(tag => tag.substring(1));

  // Mock data for demonstration (in real app, this would come from API)
  const mockTranscription = title || description || "No transcription available for this video.";
  const mockComments = [
    { author: "user123", text: "Love this content! 🔥", likes: 12, time: "2h ago" },
    { author: "creator_fan", text: "So inspiring! Thanks for sharing", likes: 8, time: "4h ago" },
    { author: "video_lover", text: "This is amazing quality", likes: 5, time: "6h ago" },
  ];

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">{title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>@{author || 'Unknown'}</span>
              <Badge variant="outline" className="ml-2">
                {platform === 'tiktok' ? 'TikTok' : 'Instagram'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{formatNumber(likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatNumber(views)}</span>
          </div>
          {duration > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(duration)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="hashtags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description || title || "No description available."}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Added:</span>
                <p className="text-muted-foreground">{formatDate(addedAt)}</p>
              </div>
              <div>
                <span className="font-medium">Extracted:</span>
                <p className="text-muted-foreground">{formatDate(extractedAt)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(url, '_blank')}
                className="w-full"
              >
                <Share className="h-4 w-4 mr-2" />
                View Original
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="mt-4">
            <div>
              <h4 className="font-medium mb-3">Video Transcript</h4>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm leading-relaxed">{mockTranscription}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * Auto-generated from video content and captions
              </p>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <div className="space-y-3">
              <h4 className="font-medium">Comments ({mockComments.length})</h4>
              {mockComments.map((comment, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">@{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm mb-2">{comment.text}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center mt-4">
                * Sample comments for demonstration
              </p>
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-4">
            <div>
              <h4 className="font-medium mb-3">Hashtags & Topics</h4>
              {extractedHashtags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {extractedHashtags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      <Hash className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hashtags found in this video.
                </p>
              )}

              <Separator className="my-4" />

              <div>
                <h5 className="font-medium text-sm mb-2">Video Info</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Platform: {platform}</div>
                  <div>Author: @{author || 'Unknown'}</div>
                  <div>Likes: {formatNumber(likes)}</div>
                  <div>Views: {formatNumber(views)}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 