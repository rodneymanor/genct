'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuickRecordingCapture } from '@/components/ui/quick-recording-capture';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  Star, 
  Calendar,
  Clock,
  Mic,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recording {
  id: string;
  title: string;
  duration: number; // in seconds
  size: number; // in bytes
  createdAt: Date;
  transcription?: string;
  isFavorite: boolean;
  audioUrl: string;
}

// Mock data
const mockRecordings: Recording[] = [
  {
    id: '1',
    title: 'Team Meeting Discussion',
    duration: 1847, // 30:47
    size: 15234567,
    createdAt: new Date('2024-01-15T10:30:00'),
    transcription: 'Discussion about project timeline and resource allocation...',
    isFavorite: true,
    audioUrl: '/mock-audio-1.mp3',
  },
  {
    id: '2',
    title: 'Voice Note - Ideas',
    duration: 423, // 7:03
    size: 3456789,
    createdAt: new Date('2024-01-14T15:22:00'),
    transcription: 'Quick thoughts on the new feature implementation...',
    isFavorite: false,
    audioUrl: '/mock-audio-2.mp3',
  },
  {
    id: '3',
    title: 'Interview Recording',
    duration: 2156, // 35:56
    size: 18765432,
    createdAt: new Date('2024-01-13T14:15:00'),
    isFavorite: false,
    audioUrl: '/mock-audio-3.mp3',
  },
];

export default function RecordingsPage() {
  const searchParams = useSearchParams();
  const [recordings, setRecordings] = useState<Recording[]>(mockRecordings);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Check for quick capture trigger
  useEffect(() => {
    const trigger = searchParams.get('trigger');
    if (trigger === 'quick') {
      setIsQuickCaptureOpen(true);
    }
  }, [searchParams]);

  // Filter recordings based on search
  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (recording.transcription && recording.transcription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleQuickRecordingSave = (title: string, audioBlob: Blob, transcription?: string) => {
    const recording: Recording = {
      id: Date.now().toString(),
      title,
      duration: 60, // Mock duration
      size: audioBlob.size,
      createdAt: new Date(),
      transcription,
      isFavorite: false,
      audioUrl: URL.createObjectURL(audioBlob),
    };

    setRecordings(prev => [recording, ...prev]);
  };

  const toggleFavorite = (recordingId: string) => {
    setRecordings(prev => prev.map(recording => 
      recording.id === recordingId ? { ...recording, isFavorite: !recording.isFavorite } : recording
    ));
  };

  const deleteRecording = (recordingId: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== recordingId));
  };

  const togglePlayback = (recordingId: string) => {
    if (playingId === recordingId) {
      setPlayingId(null);
    } else {
      setPlayingId(recordingId);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // Calculate total duration and size
  const totalDuration = filteredRecordings.reduce((acc, recording) => acc + recording.duration, 0);
  const totalSize = filteredRecordings.reduce((acc, recording) => acc + recording.size, 0);

  return (
    <React.Fragment>
      <QuickRecordingCapture 
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSave={handleQuickRecordingSave}
      />
      
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Recordings</h1>
            <p className="text-muted-foreground">
              Manage your voice recordings and transcriptions
            </p>
          </div>
          <Button onClick={() => setIsQuickCaptureOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Recording
          </Button>
        </div>

        {/* Stats and Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mic className="w-4 h-4" />
              {filteredRecordings.length} recordings
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(totalDuration)} total
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4" />
              {formatFileSize(totalSize)}
            </div>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recordings List */}
        {filteredRecordings.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <Mic className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recordings found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery 
                ? "Try adjusting your search query"
                : "Create your first recording to get started"
              }
            </p>
            <Button onClick={() => setIsQuickCaptureOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecordings.map((recording) => (
              <Card key={recording.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1 mb-2">
                        {recording.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(recording.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(recording.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          {formatFileSize(recording.size)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => togglePlayback(recording.id)}
                      >
                        {playingId === recording.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(recording.id)}
                      >
                        <Star 
                          className={cn(
                            "w-4 h-4",
                            recording.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          )} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {recording.transcription && (
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {recording.transcription}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
} 