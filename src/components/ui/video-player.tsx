"use client";

import { useState, useEffect } from "react";
import { Play, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  url: string;
  platform: 'tiktok' | 'instagram' | 'other';
  thumbnail?: string | null;
  title?: string;
  author?: string;
  className?: string;
}

export function VideoPlayer({ 
  url, 
  platform, 
  thumbnail, 
  title, 
  author, 
  className = "" 
}: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateEmbedUrl();
  }, [url, platform]);

  const generateEmbedUrl = () => {
    try {
      if (platform === 'tiktok') {
        // Extract TikTok video ID for embed
        const videoIdMatch = url.match(/video\/(\d+)/);
        if (videoIdMatch) {
          const videoId = videoIdMatch[1];
          setEmbedUrl(`https://www.tiktok.com/embed/v2/${videoId}`);
        } else {
          setError(true);
        }
      } else if (platform === 'instagram') {
        // Instagram embed URL
        const postIdMatch = url.match(/\/p\/([^\/]+)/);
        if (postIdMatch) {
          const postId = postIdMatch[1];
          setEmbedUrl(`https://www.instagram.com/p/${postId}/embed/`);
        } else {
          setError(true);
        }
      }
    } catch (err) {
      console.error('Error generating embed URL:', err);
      setError(true);
    }
  };

  const handlePlayClick = () => {
    setShowPlayer(true);
  };

  const handleOpenOriginal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (error || !embedUrl) {
    return (
      <Card className={`relative overflow-hidden bg-gray-100 ${className}`}>
        <div className="aspect-[9/16] flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-4">
            <Play className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Unable to embed {platform} video
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenOriginal}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Original
          </Button>
          {thumbnail && (
            <img 
              src={thumbnail} 
              alt={title || 'Video thumbnail'} 
              className="mt-4 max-w-full max-h-32 object-cover rounded"
            />
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {!showPlayer ? (
        // Thumbnail/Preview State
        <div className="aspect-[9/16] relative group cursor-pointer" onClick={handlePlayClick}>
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title || 'Video thumbnail'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Play className="h-16 w-16 text-gray-500" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-gray-800 ml-1" />
            </div>
          </div>

          {/* Video Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white">
              {author && (
                <p className="text-sm font-medium mb-1">@{author}</p>
              )}
              {title && (
                <p className="text-xs opacity-90 line-clamp-2">{title}</p>
              )}
            </div>
          </div>

          {/* Platform Badge */}
          <div className="absolute top-2 right-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              platform === 'tiktok' 
                ? 'bg-black text-white' 
                : 'bg-purple-600 text-white'
            }`}>
              {platform === 'tiktok' ? 'TikTok' : 'Instagram'}
            </div>
          </div>
        </div>
      ) : (
        // Video Player State
        <div className="aspect-[9/16] relative">
          <iframe
            src={`${embedUrl}${isMuted ? '?muted=1' : ''}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || `${platform} video`}
          />
          
          {/* Player Controls */}
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenOriginal}
              className="bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
} 