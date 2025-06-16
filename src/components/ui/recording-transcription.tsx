"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Search, 
  Settings, 
  Save,
  Download,
  Trash2,
  Volume2,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface AudioDevice {
  deviceId: string
  label: string
}

interface TranscriptionChunk {
  text: string
  timestamp: number
  confidence?: number
  id: string
}

export function RecordingTranscription() {
  // State management
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcription, setTranscription] = useState<TranscriptionChunk[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [recordingTitle, setRecordingTitle] = useState('')
  const [waveformData, setWaveformData] = useState<number[]>([])

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Get available audio devices
  const getAudioDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputDevices = devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`
        }))
      
      setAudioDevices(audioInputDevices)
      if (audioInputDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(audioInputDevices[0].deviceId)
      }
    } catch (error) {
      console.error('Error getting audio devices:', error)
    }
  }, [selectedDevice])

  // Initialize audio context and analyser for volume visualization
  const initializeAudioContext = useCallback(async (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setAudioLevel(average)
          
          // Update waveform for visualization
          const waveform = Array.from(dataArray.slice(0, 50))
          setWaveformData(waveform)
        }
        if (isRecording && !isPaused) {
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      
      updateAudioLevel()
    } catch (error) {
      console.error('Error initializing audio context:', error)
    }
  }, [isRecording, isPaused])

  // Connect to Gemini Live API (mock implementation)
  const connectToGemini = useCallback(() => {
    // Mock WebSocket connection - replace with your actual Gemini endpoint
    // const wsUrl = 'wss://your-gemini-backend.com/ws'
    // wsRef.current = new WebSocket(wsUrl)
    
    // For now, we'll simulate transcription
    setIsConnected(true)
    
    // Mock transcription generation
    const mockTranscription = () => {
      if (isRecording && !isPaused) {
        const mockTexts = [
          "Hello, this is a test recording.",
          "The weather today is quite nice.",
          "I'm testing the transcription functionality.",
          "This component works really well.",
          "Recording quality is excellent."
        ]
        
        const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)]
        const newChunk: TranscriptionChunk = {
          id: Date.now().toString(),
          text: randomText,
          timestamp: Date.now(),
          confidence: 0.85 + Math.random() * 0.15
        }
        
        setTranscription(prev => [...prev, newChunk])
      }
    }

    // Generate mock transcription every 3-5 seconds
    const interval = setInterval(mockTranscription, Math.random() * 2000 + 3000)
    
    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [isRecording, isPaused])

  // Check permissions
  const checkPermissions = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      if (result.state === 'denied') {
        alert('Microphone permission is required for recording')
        return false
      }
      return true
    } catch (error) {
      console.error('Error checking permissions:', error)
      return true // Fallback to attempting access
    }
  }, [])

  // Start recording
  const startRecording = useCallback(async () => {
    const hasPermission = await checkPermissions()
    if (!hasPermission) return

    try {
      const constraints = {
        audio: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          sampleRate: 16000,
          channelCount: 1
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      // Initialize audio context for visualization
      await initializeAudioContext(stream)
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      
      // Handle recorded data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Here you would send audio data to your Gemini backend
          console.log('Audio data available:', event.data.size, 'bytes')
        }
      }
      
      // Start recording with 1-second intervals for streaming
      mediaRecorder.start(1000)
      setIsRecording(true)
      
      // Connect to Gemini for transcription
      connectToGemini()
      
      // Start timer
      startTimer()
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Please check your microphone permissions.')
    }
  }, [selectedDevice, initializeAudioContext, connectToGemini, checkPermissions])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (wsRef.current) {
      wsRef.current.close()
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    setIsRecording(false)
    setIsPaused(false)
    setIsConnected(false)
    stopTimer()
  }, [])

  // Pause/Resume recording
  const togglePause = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }, [isPaused])

  // Timer functionality
  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRecordingTime(0)
  }, [])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Filter transcription based on search
  const filteredTranscription = transcription.filter(chunk =>
    chunk.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Save recording
  const saveRecording = useCallback(() => {
    const title = recordingTitle || `Recording ${new Date().toLocaleDateString()}`
    // Here you would save to your backend
    console.log('Saving recording:', title, transcription)
    alert(`Recording "${title}" saved successfully!`)
  }, [recordingTitle, transcription])

  // Download transcription
  const downloadTranscription = useCallback(() => {
    const text = transcription.map(chunk => 
      `[${new Date(chunk.timestamp).toLocaleTimeString()}] ${chunk.text}`
    ).join('\n\n')
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcription-${Date.now()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }, [transcription])

  // Clear transcription
  const clearTranscription = useCallback(() => {
    if (confirm('Are you sure you want to clear the transcription?')) {
      setTranscription([])
    }
  }, [])

  // Initialize component
  useEffect(() => {
    getAudioDevices()
    
    // Cleanup on unmount
    return () => {
      stopRecording()
    }
  }, [getAudioDevices, stopRecording])

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/capture">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Capture
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Recording Studio</h1>
            <p className="text-muted-foreground">
              Record audio with real-time transcription
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <div className="text-lg font-mono font-bold">
            {formatTime(recordingTime)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Recording Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Recording Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recording Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Recording Title</label>
                <Input
                  placeholder="Enter recording title"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                />
              </div>

              {/* Device Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Microphone</label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {audioDevices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Audio Level Indicator */}
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Audio Level</label>
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <Progress value={audioLevel} className="w-full" />
                </div>
              )}

              {/* Waveform Visualization */}
              {isRecording && waveformData.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Waveform</label>
                  <div className="flex items-end gap-1 h-16 bg-muted rounded p-2">
                    {waveformData.map((value, index) => (
                      <div
                        key={index}
                        className="bg-primary rounded-sm flex-1 transition-all duration-100"
                        style={{ height: `${(value / 255) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Recording Buttons */}
              <div className="space-y-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="w-full" size="lg">
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      onClick={togglePause} 
                      variant="secondary" 
                      className="w-full"
                      size="lg"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={stopRecording} 
                      variant="destructive" 
                      className="w-full"
                      size="lg"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {transcription.length > 0 && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={saveRecording} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={downloadTranscription} variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <Button onClick={clearTranscription} variant="destructive" size="sm" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transcription Display */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MicOff className="h-5 w-5" />
                  Live Transcription
                </CardTitle>
                <Badge variant="outline">
                  {transcription.length} segments
                </Badge>
              </div>
              
              {/* Search Interface */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transcription..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTranscription.length > 0 ? (
                  filteredTranscription.map((chunk) => (
                    <div key={chunk.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(chunk.timestamp).toLocaleTimeString()}
                        </span>
                        {chunk.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(chunk.confidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{chunk.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    {isRecording ? (
                      <div className="space-y-2">
                        <Mic className="h-12 w-12 mx-auto animate-pulse" />
                        <p>Listening... Start speaking to see transcription</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <MicOff className="h-12 w-12 mx-auto" />
                        <p>Start recording to see transcription</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 