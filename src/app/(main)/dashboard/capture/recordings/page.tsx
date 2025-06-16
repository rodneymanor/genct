"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  Volume2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QuickRecordingCapture } from "@/components/ui/quick-recording-capture";
import { cn } from "@/lib/utils";

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
    id: "1",
    title: "Team Meeting Discussion",
    duration: 1847, // 30:47
    size: 15234567,
    createdAt: new Date("2024-01-15T10:30:00"),
    transcription: "Discussion about project timeline and resource allocation...",
    isFavorite: true,
    audioUrl: "/mock-audio-1.mp3",
  },
  {
    id: "2",
    title: "Voice Note - Ideas",
    duration: 423, // 7:03
    size: 3456789,
    createdAt: new Date("2024-01-14T15:22:00"),
    transcription: "Quick thoughts on the new feature implementation...",
    isFavorite: false,
    audioUrl: "/mock-audio-2.mp3",
  },
  {
    id: "3",
    title: "Interview Recording",
    duration: 2156, // 35:56
    size: 18765432,
    createdAt: new Date("2024-01-13T14:15:00"),
    isFavorite: false,
    audioUrl: "/mock-audio-3.mp3",
  },
];

export default function RecordingsPage() {
  const searchParams = useSearchParams();
  const [recordings, setRecordings] = useState<Recording[]>(mockRecordings);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Check for quick capture trigger
  useEffect(() => {
    const trigger = searchParams.get("trigger");
    if (trigger === "quick") {
      setIsQuickCaptureOpen(true);
    }
  }, [searchParams]);

  // Filter recordings based on search
  const filteredRecordings = recordings.filter((recording) => {
    const matchesSearch =
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    setRecordings((prev) => [recording, ...prev]);
  };

  const toggleFavorite = (recordingId: string) => {
    setRecordings((prev) =>
      prev.map((recording) =>
        recording.id === recordingId ? { ...recording, isFavorite: !recording.isFavorite } : recording,
      ),
    );
  };

  const deleteRecording = (recordingId: string) => {
    setRecordings((prev) => prev.filter((recording) => recording.id !== recordingId));
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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voice Recordings</h1>
            <p className="text-muted-foreground">Capture and manage your voice recordings with transcription</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/capture/record">
              <Button>
                <Mic className="mr-2 h-4 w-4" />
                Record
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats and Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              {filteredRecordings.length} recordings
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(totalDuration)} total
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="h-4 w-4" />
              {formatFileSize(totalSize)}
            </div>
          </div>

          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
            <Mic className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No recordings found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              {searchQuery ? "Try adjusting your search query" : "Create your first recording to get started"}
            </p>
            <Button onClick={() => setIsQuickCaptureOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecordings.map((recording) => (
              <Card key={recording.id} className="group transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="mb-2 line-clamp-1 text-base">{recording.title}</CardTitle>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(recording.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(recording.duration)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Volume2 className="h-3 w-3" />
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
                        {playingId === recording.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(recording.id)}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            recording.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {recording.transcription && (
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground line-clamp-3 text-sm">{recording.transcription}</p>
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
