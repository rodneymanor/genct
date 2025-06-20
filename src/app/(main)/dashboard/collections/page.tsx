"use client";

import { useState } from "react";

import { ChevronRight, Search, Grid3X3, List, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for collections in different categories
const collectionsData = {
  shared: [
    {
      id: "shared-1",
      title: "Team Projects",
      thumbnail: "/api/placeholder/400/300",
      videoCount: 12,
      isSelected: false
    },
    {
      id: "shared-2", 
      title: "Client Presentations",
      thumbnail: "/api/placeholder/400/300",
      videoCount: 8,
      isSelected: false
    }
  ],
  favorites: [
    {
      id: "fav-1",
      title: "Best Tutorials",
      thumbnail: "/api/placeholder/400/300", 
      videoCount: 24,
      isSelected: true // Default selected
    },
    {
      id: "fav-2",
      title: "Creative Inspiration",
      thumbnail: "/api/placeholder/400/300",
      videoCount: 16,
      isSelected: false
    }
  ],
  private: [
    {
      id: "private-1",
      title: "Personal Archive",
      thumbnail: "/api/placeholder/400/300",
      videoCount: 45,
      isSelected: false
    },
    {
      id: "private-2",
      title: "Work in Progress",
      thumbnail: "/api/placeholder/400/300",
      videoCount: 7,
      isSelected: false
    }
  ]
};

// Mock video data for the selected collection
const mockVideos = Array.from({ length: 12 }, (_, i) => ({
  id: `video-${i + 1}`,
  title: `Video Title ${i + 1}`,
  thumbnail: `/api/placeholder/400/300?random=${i}`,
  duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  views: `${(Math.random() * 10).toFixed(1)}K`,
  uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'shared' | 'favorites' | 'private'>('favorites');
  const [selectedCollection, setSelectedCollection] = useState('fav-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentCollections = collectionsData[selectedCategory];
  const selectedCollectionData = currentCollections.find(c => c.id === selectedCollection);

  return (
    <div className="h-full flex">
      {/* Left Sidebar - 20% */}
      <div className="w-1/5 border-r border-border bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Collections</h1>
        </div>

        {/* Categories */}
        <div className="flex-1 p-4 space-y-6">
          {/* Shared Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <span>Shared</span>
            </div>
            <div className="space-y-1">
              {collectionsData.shared.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    setSelectedCategory('shared');
                    setSelectedCollection(collection.id);
                  }}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors hover:bg-muted ${
                    selectedCategory === 'shared' && selectedCollection === collection.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{collection.title}</span>
                    <span className="text-xs text-muted-foreground">{collection.videoCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <span>Favorites</span>
            </div>
            <div className="space-y-1">
              {collectionsData.favorites.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    setSelectedCategory('favorites');
                    setSelectedCollection(collection.id);
                  }}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors hover:bg-muted ${
                    selectedCategory === 'favorites' && selectedCollection === collection.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{collection.title}</span>
                    <span className="text-xs text-muted-foreground">{collection.videoCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Private Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <span>Private</span>
            </div>
            <div className="space-y-1">
              {collectionsData.private.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    setSelectedCategory('private');
                    setSelectedCollection(collection.id);
                  }}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors hover:bg-muted ${
                    selectedCategory === 'private' && selectedCollection === collection.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{collection.title}</span>
                    <span className="text-xs text-muted-foreground">{collection.videoCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Main Content - 80% */}
      <div className="w-4/5 flex flex-col">
        {/* Top Bar */}
        <div className="p-6 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedCollectionData?.videoCount} videos
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-4">
            {mockVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                      {video.duration}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-xs">
                      {video.views} views
                    </Badge>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 