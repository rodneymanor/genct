"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCcw, Play, Pause, RotateCw, Mic } from "lucide-react"

interface RecordingComponentProps {
  className?: string
}

export function RecordingComponent({ className }: RecordingComponentProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState("1x")
  const [isPlaying, setIsPlaying] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setHasAccess(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const startRecording = async () => {
    if (!streamRef.current) {
      await requestMicrophoneAccess()
    }
    
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      setDuration(currentTime)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    }
  }

  const handleRecordingToggle = () => {
    if (!isRecording) {
      startRecording()
    } else if (isPaused) {
      resumeRecording()
    } else {
      pauseRecording()
    }
  }

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRewind = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const handleFastForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const handleSliderChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className={`flex flex-col p-3 gap-3 ${className}`}>
      {/* Top row - Recording controls */}
      <div className="flex items-center justify-between">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button
              onClick={handleRecordingToggle}
              variant="destructive"
              size="sm"
              className="h-8 px-2 py-1 gap-2"
            >
              <div className="w-[9px] h-[9px] bg-white rounded-full"></div>
              {!isRecording ? 'Start recording' : isPaused ? 'Resume' : 'Pause'}
            </Button>
            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="outline"
                size="sm"
                className="h-8 px-2 py-1"
              >
                Stop
              </Button>
            )}
          </div>
          <Button
            onClick={requestMicrophoneAccess}
            variant="secondary"
            size="sm"
            className="h-8 px-2 py-1 ml-auto"
          >
            {hasAccess ? 'Access granted' : 'Allow access'}
          </Button>
        </div>
      </div>

      {/* Bottom row - Playback controls */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-2">
        {/* Playback control buttons */}
        <div className="flex items-center max-sm:w-[150px] max-sm:justify-between">
          <Button
            onClick={handleRewind}
            variant="ghost"
            size="sm"
            className="h-8 px-2 py-1"
          >
            <RotateCcw size={15} />
          </Button>
          
          <Button
            onClick={handlePlayToggle}
            variant="ghost"
            size="sm"
            className="h-8 px-2 py-1"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </Button>
          
          <Button
            onClick={handleFastForward}
            variant="ghost"
            size="sm"
            className="h-8 px-2 py-1"
          >
            <RotateCw size={15} />
          </Button>
        </div>

        {/* Timeline and controls */}
        <div className="flex items-center w-full gap-2">
          <p className="text-xs text-muted-foreground w-12">{formatTime(currentTime)}</p>
          
          <Slider
            value={[currentTime]}
            max={Math.max(duration, currentTime)}
            step={1}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          
          <p className="text-xs text-muted-foreground">{formatTime(Math.max(duration, currentTime))}</p>
          
          <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
            <SelectTrigger className="h-[22px] text-[13px] w-12 px-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5x">0.5x</SelectItem>
              <SelectItem value="0.75x">0.75x</SelectItem>
              <SelectItem value="1x">1x</SelectItem>
              <SelectItem value="1.25x">1.25x</SelectItem>
              <SelectItem value="1.5x">1.5x</SelectItem>
              <SelectItem value="2x">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 