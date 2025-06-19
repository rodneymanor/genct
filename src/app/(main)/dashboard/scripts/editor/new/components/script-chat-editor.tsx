"use client";

import { useState, useEffect, useRef } from "react";

import { Send, Sparkles, Clock, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  user: { name: string };
  createdAt: string;
  isOwnMessage?: boolean;
  type?: 'message' | 'system' | 'progress' | 'script-component';
  metadata?: any;
}

interface ScriptChatEditorProps {
  roomName: string;
  username: string;
  onScriptUpdate?: (script: any) => void;
  initialPrompt?: string;
}

interface ScriptGenerationStage {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
  progress?: number;
  details?: string[];
}

// Timeline Progress Component
function ScriptGenerationTimeline({ stages }: { stages: ScriptGenerationStage[] }) {
  return (
    <div className="space-y-4 py-4">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center",
              stage.status === 'complete' && "bg-green-500 border-green-500 text-white",
              stage.status === 'active' && "bg-blue-500 border-blue-500 text-white animate-pulse",
              stage.status === 'pending' && "border-gray-300 bg-background"
            )}>
              {stage.status === 'complete' && <CheckCircle className="w-3 h-3" />}
              {stage.status === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
              {stage.status === 'pending' && <span className="w-2 h-2 bg-gray-300 rounded-full" />}
            </div>
            {index < stages.length - 1 && (
              <div className={cn(
                "w-0.5 h-8 mt-1",
                stage.status === 'complete' ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={cn(
                "font-medium text-sm",
                stage.status === 'complete' && "text-green-700",
                stage.status === 'active' && "text-blue-700"
              )}>
                {stage.title}
              </h4>
              {stage.status === 'active' && stage.progress !== undefined && (
                <span className="text-xs text-blue-600">({stage.progress}%)</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
            {stage.details && stage.details.length > 0 && (
              <div className="mt-2 space-y-1">
                {stage.details.map((detail, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    {detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Script Component Display
function ScriptComponentDisplay({ component }: { component: any }) {
  return (
    <div className="border-l-2 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <h4 className="font-semibold text-sm text-blue-800">{component.type}</h4>
      </div>
      <div className="space-y-2">
        <div>
          <h5 className="font-medium text-sm">{component.title}</h5>
          <p className="text-sm text-gray-700 mt-1">{component.content}</p>
        </div>
        {component.details && (
          <div className="text-xs text-gray-600 bg-white/50 rounded p-2">
            <strong>Details:</strong> {component.details}
          </div>
        )}
      </div>
    </div>
  );
}

export function ScriptChatEditor({ roomName, username, onScriptUpdate, initialPrompt }: ScriptChatEditorProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStages, setGenerationStages] = useState<ScriptGenerationStage[]>([]);
  const [scriptComponents, setScriptComponents] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showOutline, setShowOutline] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      content: "Hi! I'm your script writing assistant. I'll help you create compelling content step by step. What would you like to create a script about?",
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'system'
    };
    setChatMessages([welcomeMessage]);

    // Auto-start if initial prompt is provided
    if (initialPrompt) {
      setTimeout(() => {
        handleStartGeneration(initialPrompt);
      }, 1000);
    }
  }, [initialPrompt]);

  const handleStartGeneration = async (prompt: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: prompt,
      user: { name: username },
      createdAt: new Date().toISOString(),
      isOwnMessage: true,
      type: 'message'
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Add system response
    const systemMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "Perfect! I'll help you create a script about that. Let me start by researching and analyzing the topic to build the best possible content.",
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'system'
    };
    setChatMessages(prev => [...prev, systemMessage]);

    // Initialize generation stages
    const stages: ScriptGenerationStage[] = [
      {
        id: 'research',
        title: 'Research',
        description: 'Gathering resources and information',
        status: 'active',
        progress: 0,
        details: []
      },
      {
        id: 'analysis',
        title: 'Analysis',
        description: 'Analyzing content and extracting insights',
        status: 'pending'
      },
      {
        id: 'generation',
        title: 'Script Creation',
        description: 'Generating script components',
        status: 'pending'
      },
      {
        id: 'completion',
        title: 'Finalization',
        description: 'Completing your script',
        status: 'pending'
      }
    ];

    setGenerationStages(stages);
    setIsGenerating(true);

    // Add progress message
    const progressMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      content: '',
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'progress',
      metadata: { stages }
    };
    setChatMessages(prev => [...prev, progressMessage]);

    // Simulate the actual script generation process
    await simulateScriptGeneration(prompt);
  };

  const simulateScriptGeneration = async (prompt: string) => {
    try {
      // Stage 1: Research
      await simulateResearchStage();
      
      // Stage 2: Analysis  
      await simulateAnalysisStage();
      
      // Stage 3: Generation
      await simulateGenerationStage(prompt);
      
      // Stage 4: Completion
      await simulateCompletionStage();
      
    } catch (error) {
      console.error('Script generation error:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I encountered an issue while generating your script. Let me try a different approach. Could you provide a bit more detail about what you'd like to focus on?",
        user: { name: "Script Assistant" },
        createdAt: new Date().toISOString(),
        isOwnMessage: false,
        type: 'system'
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setIsGenerating(false);
    }
  };

  const simulateResearchStage = async () => {
    const resourcesFound = ['Academic articles', 'Industry reports', 'Expert interviews', 'Case studies', 'Recent news'];
    
    for (let i = 0; i < resourcesFound.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGenerationStages(prev => prev.map(stage => 
        stage.id === 'research' 
          ? { 
              ...stage, 
              progress: ((i + 1) / resourcesFound.length) * 100,
              details: [...(stage.details || []), `Found ${i + 1} resource: ${resourcesFound[i]}`]
            }
          : stage
      ));

      // Update progress message
      setChatMessages(prev => prev.map(msg => 
        msg.type === 'progress' 
          ? { ...msg, metadata: { ...msg.metadata, stages: generationStages } }
          : msg
      ));
    }

    // Complete research stage
    setGenerationStages(prev => prev.map(stage => 
      stage.id === 'research' 
        ? { ...stage, status: 'complete' as const }
        : stage.id === 'analysis'
        ? { ...stage, status: 'active' as const }
        : stage
    ));
  };

  const simulateAnalysisStage = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGenerationStages(prev => prev.map(stage => 
      stage.id === 'analysis' 
        ? { ...stage, status: 'complete' as const }
        : stage.id === 'generation'
        ? { ...stage, status: 'active' as const }
        : stage
    ));

    const analysisMessage: ChatMessage = {
      id: Date.now().toString(),
      content: "Great! I've analyzed the research and identified key themes and compelling angles for your script. Now I'll start creating the script components.",
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'system'
    };
    setChatMessages(prev => [...prev, analysisMessage]);
  };

  const simulateGenerationStage = async (prompt: string) => {
    const components = [
      {
        type: 'Hook',
        title: 'Opening Question',
        content: `What if I told you that ${prompt.toLowerCase()} is about to change everything we thought we knew?`,
        details: 'This hook uses curiosity and contradiction to immediately grab attention'
      },
      {
        type: 'Context',
        title: 'Background Setup',
        content: `To understand why this matters, we need to look at the current landscape and what most people are missing.`,
        details: 'Provides necessary context while building anticipation'
      },
      {
        type: 'Main Content',
        title: 'Core Insights',
        content: `Here are the three key insights that will reshape how you think about ${prompt.toLowerCase()}...`,
        details: 'Delivers the main value proposition with structured insights'
      },
      {
        type: 'Call to Action',
        title: 'Next Steps',
        content: `Now that you understand this, here's what you should do next to take advantage of this knowledge.`,
        details: 'Provides clear, actionable next steps for the audience'
      }
    ];

    for (let i = 0; i < components.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const component = components[i];
      setScriptComponents(prev => [...prev, component]);
      
      // Add component message
      const componentMessage: ChatMessage = {
        id: Date.now().toString() + i,
        content: '',
        user: { name: "Script Assistant" },
        createdAt: new Date().toISOString(),
        isOwnMessage: false,
        type: 'script-component',
        metadata: { component }
      };
      setChatMessages(prev => [...prev, componentMessage]);
      
      onScriptUpdate?.(component);
    }

    setGenerationStages(prev => prev.map(stage => 
      stage.id === 'generation' 
        ? { ...stage, status: 'complete' as const }
        : stage.id === 'completion'
        ? { ...stage, status: 'active' as const }
        : stage
    ));
  };

  const simulateCompletionStage = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setGenerationStages(prev => prev.map(stage => 
      stage.id === 'completion' 
        ? { ...stage, status: 'complete' as const }
        : stage
    ));

    const completionMessage: ChatMessage = {
      id: Date.now().toString(),
      content: "Perfect! Your script is complete. I've created a compelling narrative flow with all the essential components. You can now review each section, make adjustments, or ask me to modify any part. What would you like to work on next?",
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'system'
    };
    setChatMessages(prev => [...prev, completionMessage]);
    setIsGenerating(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isGenerating) return;

    if (!isGenerating && scriptComponents.length === 0) {
      handleStartGeneration(newMessage.trim());
    } else {
      // Handle regular chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        user: { name: username },
        createdAt: new Date().toISOString(),
        isOwnMessage: true,
        type: 'message'
      };
      setChatMessages(prev => [...prev, userMessage]);

      // Auto-respond
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I can help you refine that part of your script. Which specific section would you like me to adjust or improve?",
          user: { name: "Script Assistant" },
          createdAt: new Date().toISOString(),
          isOwnMessage: false,
          type: 'system'
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-background border-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {message.type === 'progress' ? (
              <div className="max-w-md">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm text-blue-800">Script Generation Progress</span>
                  </div>
                  <ScriptGenerationTimeline stages={generationStages} />
                </div>
              </div>
            ) : message.type === 'script-component' ? (
              <div className="max-w-2xl">
                <ScriptComponentDisplay component={message.metadata.component} />
              </div>
            ) : (
              <div className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
                  'items-end': message.isOwnMessage,
                })}>
                  <div className={cn(
                    'py-2 px-3 rounded-xl text-sm w-fit',
                    message.isOwnMessage 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'system'
                      ? 'bg-blue-50 text-blue-900 border border-blue-200'
                      : 'bg-muted text-foreground'
                  )}>
                    {message.content}
                  </div>
                  <span className="text-xs text-muted-foreground px-2">
                    {new Date(message.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border p-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            isGenerating 
              ? "Script generation in progress..." 
              : scriptComponents.length === 0
              ? "Describe your script idea..."
              : "Ask for changes or improvements..."
          }
          disabled={isGenerating}
          className="flex-1 border-0 shadow-none focus-visible:ring-1"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || isGenerating}
          className="rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 