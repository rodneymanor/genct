"use client";

import { useState } from "react";

import { 
  FolderOpen, 
  Plus, 
  ArrowLeft, 
  Play, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Video,
  Users,
  Calendar,
  Eye
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Mock data for collections
const mockCollections = [
  {
    id: "1",
    title: "Tech Explained",
    description: "Educational content about technology and programming",
    videoCount: 24,
    thumbnail: "/api/placeholder/300/200",
    color: "bg-blue-100",
    tags: ["tech", "education"]
  },
  {
    id: "2",
    title: "Wellness Tips",
    description: "Health and wellness advice for daily life",
    videoCount: 18,
    thumbnail: "/api/placeholder/300/200",
    color: "bg-green-100",
    tags: ["wellness", "health"]
  },
  {
    id: "3",
    title: "Creative Inspiration",
    description: "Creative projects and artistic inspiration",
    videoCount: 32,
    thumbnail: "/api/placeholder/300/200",
    color: "bg-purple-100",
    tags: ["creative", "art"]
  },
  {
    id: "4",
    title: "Business Growth",
    description: "Strategies for business development and growth",
    videoCount: 15,
    thumbnail: "/api/placeholder/300/200",
    color: "bg-orange-100",
    tags: ["business", "growth"]
  }
];

// Mock data for videos in a collection
const mockVideos = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    description: "Learn the basics of React Hooks and how to use them in your applications. This comprehensive guide covers useState, useEffect, and custom hooks.",
    thumbnail: "/api/placeholder/400/300",
    duration: "12:34",
    views: "2.3K",
    likes: 156,
    comments: 23,
    publishedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    description: "Explore advanced TypeScript patterns and techniques that will help you write better, more maintainable code.",
    thumbnail: "/api/placeholder/400/300",
    duration: "18:45",
    views: "1.8K",
    likes: 124,
    comments: 15,
    publishedAt: "2024-01-12"
  },
  {
    id: "3",
    title: "Building Scalable APIs",
    description: "Best practices for building scalable and maintainable APIs using modern frameworks and design patterns.",
    thumbnail: "/api/placeholder/400/300",
    duration: "25:12",
    views: "3.1K",
    likes: 234,
    comments: 45,
    publishedAt: "2024-01-10"
  },
  {
    id: "4",
    title: "Database Optimization Tips",
    description: "Learn how to optimize your database queries and improve performance with these practical tips and techniques.",
    thumbnail: "/api/placeholder/400/300",
    duration: "15:30",
    views: "1.5K",
    likes: 89,
    comments: 12,
    publishedAt: "2024-01-08"
  }
];

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCollectionData = selectedCollection 
    ? mockCollections.find(c => c.id === selectedCollection)
    : null;

  const filteredCollections = mockCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Collections List View
  if (!selectedCollection) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 @lg:px-6 @xl:px-12 @2xl:px-20 @3xl:px-24 my-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Organize your content into themed collections for easy discovery.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <Card 
              key={collection.id} 
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedCollection(collection.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
                <div className={`absolute inset-0 ${collection.color} opacity-20`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderOpen className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {collection.videoCount} videos
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {collection.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">
                  {collection.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {collection.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    {collection.videoCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Create your first collection to get started"}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Video Feed View
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 @lg:px-6 @xl:px-12 @2xl:px-20 @3xl:px-24 my-8 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSelectedCollection(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {selectedCollectionData?.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {selectedCollectionData?.videoCount} videos • {selectedCollectionData?.description}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {mockVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full">
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                    {video.duration}
                  </Badge>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {video.description}
                  </p>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {video.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Video className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos in this collection</h3>
          <p className="text-muted-foreground mb-4">
            Start adding videos to build your collection
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </div>
      )}
    </div>
  );
} 