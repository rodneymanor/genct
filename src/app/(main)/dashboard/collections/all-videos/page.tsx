"use client";

import { useState, useEffect } from "react";

import { Play, Grid, List, Filter, Search, SortAsc, Video } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoMetadata } from "@/components/ui/video-metadata";
import { VideoPlayer } from "@/components/ui/video-player";
import { useAuth } from "@/contexts/auth-context";
import { useCollections } from "@/hooks/use-collections";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  platform: 'tiktok' | 'instagram' | 'other';
  thumbnail?: string | null;
  author?: string;
  likes?: number;
  views?: number;
  duration?: number;
  hashtags?: string[];
  extractedAt?: string;
  addedAt: string;
  userId: string;
  videoType?: string;
  source?: string;
}

export default function AllVideosPage() {
  const { user } = useAuth();
  const { collections, loading } = useCollections();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Find the "All Videos" collection and fetch its items
  useEffect(() => {
    const fetchAllVideos = async () => {
      if (!user || !collections.length) return;

      try {
        setIsLoading(true);
        const allVideosCollection = collections.find(c => c.name === 'All Videos');
        
        if (!allVideosCollection) {
          console.log('All Videos collection not found');
          setVideos([]);
          setFilteredVideos([]);
          return;
        }

        // Fetch items from the All Videos collection
        const response = await fetch(`/api/collections/${allVideosCollection.id}/items?userId=${user.uid}`);
        const data = await response.json();

        if (data.success) {
          const videoItems: VideoItem[] = data.items.map((item: any) => ({
            id: item.id,
            title: item.title || 'Untitled Video',
            description: item.description,
            url: item.url,
            platform: item.platform,
            thumbnail: item.thumbnail,
            author: item.author,
            likes: item.likes || 0,
            views: item.views || 0,
            duration: item.duration || 0,
            hashtags: item.hashtags || [],
            extractedAt: item.extractedAt,
            addedAt: item.addedAt,
            userId: item.userId,
            videoType: item.videoType,
            source: item.source,
          }));

          setVideos(videoItems);
          setFilteredVideos(videoItems);
          
          // Auto-select first video if none selected
          if (videoItems.length > 0 && !selectedVideo) {
            setSelectedVideo(videoItems[0]);
          }
        } else {
          toast.error('Failed to load videos');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVideos();
  }, [user, collections, selectedVideo]);

  // Filter and sort videos
  useEffect(() => {
    let filtered = [...videos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(video => video.platform === platformFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
        break;
      case 'most_liked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'most_viewed':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, platformFilter, sortBy]);

  if (loading || isLoading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Loading videos...</p>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your video collection</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Please log in</p>
            <p className="text-sm text-muted-foreground">You need to be logged in to view your video collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Video className="h-6 w-6" />
            All Videos
          </h1>
          <p className="text-muted-foreground">
            Your complete collection of TikTok and Instagram videos ({filteredVideos.length} videos)
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most_liked">Most Liked</SelectItem>
              <SelectItem value="most_viewed">Most Viewed</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredVideos.length === 0 ? (
        <Card className="flex items-center justify-center min-h-[400px]">
          <CardContent className="text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No videos found</CardTitle>
            <p className="text-sm text-muted-foreground mb-4">
              {videos.length === 0 
                ? "Start adding videos by sending emails with TikTok or Instagram links to your email alias."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {videos.length === 0 && (
              <Button variant="outline" onClick={() => window.location.href = '/dashboard/inspiration/email-demo'}>
                Test Email Processing
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
          {/* Video Player Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Now Playing</h2>
              {selectedVideo && (
                <Badge variant="outline">
                  {selectedVideo.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                </Badge>
              )}
            </div>
            
            {selectedVideo ? (
              <VideoPlayer
                url={selectedVideo.url}
                platform={selectedVideo.platform}
                thumbnail={selectedVideo.thumbnail}
                title={selectedVideo.title}
                author={selectedVideo.author}
                className="w-full max-w-sm mx-auto"
              />
            ) : (
              <Card className="aspect-[9/16] max-w-sm mx-auto flex items-center justify-center">
                <CardContent className="text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Select a video to play</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Video List/Metadata Section */}
          <div className="space-y-4">
            {selectedVideo && (
              <VideoMetadata
                title={selectedVideo.title}
                description={selectedVideo.description}
                author={selectedVideo.author}
                platform={selectedVideo.platform}
                likes={selectedVideo.likes}
                views={selectedVideo.views}
                duration={selectedVideo.duration}
                hashtags={selectedVideo.hashtags}
                extractedAt={selectedVideo.extractedAt}
                addedAt={selectedVideo.addedAt}
                url={selectedVideo.url}
                className="h-[600px] overflow-auto"
              />
            )}
          </div>
        </div>
      )}

      {/* Video Grid/List (when not in player mode) */}
      {filteredVideos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">All Videos ({filteredVideos.length})</h2>
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' 
              : 'grid-cols-1'
          }`}>
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedVideo?.id === video.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVideo(video)}
              >
                <CardContent className="p-3">
                  {viewMode === 'grid' ? (
                    <div className="space-y-2">
                      <div className="aspect-[9/16] relative">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="text-xs">
                            {video.platform === 'tiktok' ? 'TT' : 'IG'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium line-clamp-2">{video.title}</p>
                        <p className="text-xs text-muted-foreground">@{video.author}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                            <Play className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{video.title}</p>
                        <p className="text-sm text-muted-foreground">@{video.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {video.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {video.likes} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 