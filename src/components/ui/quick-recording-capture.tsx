"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save, Mic, Square, Play, Pause, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickRecordingCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, audioBlob: Blob, transcription?: string) => void;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export function QuickRecordingCapture({ isOpen, onClose, onSave }: QuickRecordingCaptureProps) {
  const [title, setTitle] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Auto-start recording when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        startRecording();
      }, 500); // Wait for animation to complete
    } else {
      cleanup();
    }
  }, [isOpen]);

  // Update duration timer
  useEffect(() => {
    if (recordingState === 'recording') {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recordingState]);

  // Waveform animation
  useEffect(() => {
    if (recordingState === 'recording') {
      animateWaveform();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [recordingState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === ' ') {
        event.preventDefault();
        toggleRecording();
      } else if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, recordingState, audioBlob]);

  const animateWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Generate random waveform data
    const newData = Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.1);
    setWaveformData(newData);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get CSS custom property for primary color
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    
    // Draw waveform using theme primary color
    ctx.fillStyle = `oklch(${primaryColor})`;
    const barWidth = width / newData.length;
    
    newData.forEach((value, index) => {
      const barHeight = value * height;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });

    animationRef.current = requestAnimationFrame(animateWaveform);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        transcribeAudio();
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setDuration(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
    }
  };

  const toggleRecording = () => {
    if (recordingState === 'recording') {
      stopRecording();
    } else if (recordingState === 'idle') {
      startRecording();
    }
  };

  const transcribeAudio = async () => {
    setIsTranscribing(true);
    
    // Simulate AI transcription
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockTranscriptions = [
      "This is a quick voice note about the project meeting we had today.",
      "Remember to follow up on the client requirements and send the proposal.",
      "Ideas for the new feature: user authentication, dashboard improvements, and mobile optimization.",
      "Meeting notes: discussed budget allocation, timeline adjustments, and team responsibilities."
    ];
    
    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    setTranscription(randomTranscription);
    
    // Generate title from transcription
    if (!title) {
      const words = randomTranscription.split(' ').slice(0, 4);
      setTitle(words.join(' ') + '...');
    }
    
    setIsTranscribing(false);
  };

  const handleSave = () => {
    if (!audioBlob) return;
    
    const finalTitle = title.trim() || 'Voice Recording';
    onSave(finalTitle, audioBlob, transcription);
    handleClose();
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  const cleanup = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setTitle('');
    setRecordingState('idle');
    setDuration(0);
    setAudioBlob(null);
    setTranscription('');
    setIsTranscribing(false);
    setWaveformData([]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Slide-down panel */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-lg",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Voice Recording</h2>
              {isTranscribing && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Transcribing...</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Recording Controls */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={recordingState === 'recording' ? 'destructive' : 'default'}
                  size="lg"
                  onClick={toggleRecording}
                  className={cn(
                    "h-16 w-16 rounded-full shadow-lg transition-all duration-200",
                    recordingState === 'recording' 
                      ? "animate-pulse hover:scale-105" 
                      : "hover:scale-105"
                  )}
                >
                  {recordingState === 'recording' ? (
                    <Square className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold">
                    {formatDuration(duration)}
                  </div>
                  <div className={cn(
                    "text-sm transition-colors duration-200",
                    recordingState === 'recording' 
                      ? 'text-destructive font-medium' 
                      : 'text-muted-foreground'
                  )}>
                    {recordingState === 'recording' ? 'Recording...' : 
                     recordingState === 'stopped' ? 'Recording complete' : 'Ready to record'}
                  </div>
                </div>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="flex justify-center mb-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={60}
                className="border border-border rounded-lg bg-muted/30"
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <Input
              ref={titleRef}
              placeholder="Recording title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-medium border-gray-200"
            />
          </div>

          {/* Transcription */}
          {(transcription || isTranscribing) && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Transcription</label>
              <div className="bg-muted/50 rounded-lg p-3 min-h-[80px]">
                {isTranscribing ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing audio...</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{transcription}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to record • 
              <kbd className="px-2 py-1 bg-muted rounded text-xs ml-1">Esc</kbd> to close • 
              <kbd className="px-2 py-1 bg-muted rounded text-xs ml-1">⌘ Enter</kbd> to save
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleClose} className="border-gray-200">
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!audioBlob || isTranscribing}
                className="min-w-[80px] border-gray-200"
              >
                {isTranscribing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Recording
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 