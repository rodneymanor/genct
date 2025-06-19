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
  type?: 'message' | 'system' | 'progress' | 'script-component' | 'component-selection' | 'script-complete';
  metadata?: any;
}

interface ScriptChatEditorProps {
  initialPrompt?: string;
  scriptState: any;
  onStartGeneration: (prompt: string) => void;
  onComponentSelection: (type: string, component: any) => void;
  onFinalGeneration: () => void;
  sourcesCount: number;
  extractedSourcesCount: number;
  canGenerateScript: boolean;
  isGenerating: boolean;
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

// Progress Timeline Component
function ProgressTimeline({ step, sourcesCount, extractedSourcesCount }: { 
  step: string; 
  sourcesCount: number; 
  extractedSourcesCount: number; 
}) {
  const stages = [
    {
      id: 'gathering-sources',
      title: 'Research',
      description: 'Gathering resources and information',
      status: step === 'gathering-sources' ? 'active' : 
              ['extracting-content', 'generating-components', 'selecting-components', 'generating-script', 'complete'].includes(step) ? 'complete' : 'pending'
    },
    {
      id: 'extracting-content',
      title: 'Analysis',
      description: 'Extracting content and insights',
      status: step === 'extracting-content' ? 'active' : 
              ['generating-components', 'selecting-components', 'generating-script', 'complete'].includes(step) ? 'complete' : 'pending'
    },
    {
      id: 'generating-components',
      title: 'Component Generation',
      description: 'Creating script components',
      status: step === 'generating-components' ? 'active' : 
              ['selecting-components', 'generating-script', 'complete'].includes(step) ? 'complete' : 'pending'
    },
    {
      id: 'selecting-components',
      title: 'Component Selection',
      description: 'Selecting best components',
      status: step === 'selecting-components' ? 'active' : 
              ['generating-script', 'complete'].includes(step) ? 'complete' : 'pending'
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-sm text-blue-800">Script Generation Progress</span>
      </div>
      
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              stage.status === 'complete' && "bg-green-500 border-green-500 text-white",
              stage.status === 'active' && "bg-blue-500 border-blue-500 text-white animate-pulse",
              stage.status === 'pending' && "border-gray-300 bg-white"
            )}>
              {stage.status === 'complete' && <CheckCircle className="w-3 h-3" />}
              {stage.status === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
              {stage.status === 'pending' && <span className="w-2 h-2 bg-gray-300 rounded-full" />}
            </div>
            {index < stages.length - 1 && (
              <div className={cn(
                "w-0.5 h-6 mt-1",
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
              {stage.status === 'active' && stage.id === 'gathering-sources' && sourcesCount > 0 && (
                <span className="text-xs text-blue-600">({sourcesCount} sources)</span>
              )}
              {stage.status === 'active' && stage.id === 'extracting-content' && extractedSourcesCount > 0 && (
                <span className="text-xs text-blue-600">({extractedSourcesCount} extracted)</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component Selection Display
function ComponentSelectionDisplay({ 
  components, 
  onSelection 
}: { 
  components: any[]; 
  onSelection: (type: string, component: any) => void; 
}) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-sm text-blue-800">Select Script Components</span>
      </div>
      
      {Object.entries(components).map(([type, options]: [string, any]) => (
        <div key={type} className="space-y-2">
          <h4 className="font-medium text-sm capitalize text-blue-800">{type}</h4>
          <div className="grid gap-2">
            {options.map((option: any, index: number) => (
              <button
                key={index}
                onClick={() => onSelection(type, option)}
                className="text-left p-3 bg-white rounded border hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-sm">{option.title}</div>
                <div className="text-xs text-gray-600 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScriptChatEditor({
  initialPrompt,
  scriptState,
  onStartGeneration,
  onComponentSelection,
  onFinalGeneration,
  sourcesCount,
  extractedSourcesCount,
  canGenerateScript,
  isGenerating
}: ScriptChatEditorProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Initialize with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: "Hi! I'm your script writing assistant. I'll help you create compelling content step by step. What would you like to create a script about?",
        user: { name: "Script Assistant" },
        createdAt: new Date().toISOString(),
        isOwnMessage: false,
        type: 'system'
      };
      setChatMessages([welcomeMessage]);
    }
  }, []);

  // Auto-start if initial prompt is provided
  useEffect(() => {
    if (initialPrompt && !hasStarted && chatMessages.length > 0) {
      setTimeout(() => {
        handleStartGeneration(initialPrompt);
      }, 1000);
    }
  }, [initialPrompt, hasStarted, chatMessages.length]);

  // Handle script state changes
  useEffect(() => {
    if (scriptState.step && hasStarted) {
      updateChatForState(scriptState);
    }
  }, [scriptState.step, scriptState.error, sourcesCount, extractedSourcesCount, hasStarted]);

  const updateChatForState = (state: any) => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    // Avoid duplicate progress messages
    if (lastMessage?.type === 'progress' && 
        ['gathering-sources', 'extracting-content', 'generating-components'].includes(state.step)) {
      return;
    }

    switch (state.step) {
      case 'gathering-sources':
        if (lastMessage?.type !== 'progress') {
          addProgressMessage();
        }
        break;
      case 'extracting-content':
        if (sourcesCount > 0 && lastMessage?.content !== `Great! I found ${sourcesCount} relevant sources. Now I'm analyzing the content to extract key insights.`) {
          addSystemMessage(`Great! I found ${sourcesCount} relevant sources. Now I'm analyzing the content to extract key insights.`);
        }
        break;
      case 'generating-components':
        if (extractedSourcesCount > 0 && lastMessage?.content !== `Perfect! I've analyzed ${extractedSourcesCount} sources and extracted valuable insights. Now I'm generating script components based on this research.`) {
          addSystemMessage(`Perfect! I've analyzed ${extractedSourcesCount} sources and extracted valuable insights. Now I'm generating script components based on this research.`);
        }
        break;
      case 'selecting-components':
        if (state.components && lastMessage?.type !== 'component-selection') {
          addSystemMessage("Excellent! I've generated several script components. Please select your preferred options for each section:");
          addComponentSelectionMessage(state.components);
        }
        break;
      case 'generating-script':
        if (lastMessage?.content !== "Perfect! I'm now generating your final script with the selected components.") {
          addSystemMessage("Perfect! I'm now generating your final script with the selected components.");
        }
        break;
      case 'complete':
        if (state.finalScript && lastMessage?.type !== 'script-complete') {
          addSystemMessage("Your script is complete! Here's what I've created for you:");
          addScriptCompleteMessage(state.finalScript);
        }
        break;
      case 'error':
        if (state.error) {
          addSystemMessage(`I encountered an issue: ${state.error}. Let me try a different approach. Could you provide more details about your script idea?`);
        }
        break;
    }
  };

  const addSystemMessage = (content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'system'
    };
    setChatMessages(prev => [...prev, message]);
  };

  const addProgressMessage = () => {
    const message: ChatMessage = {
      id: `progress-${Date.now()}`,
      content: '',
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'progress'
    };
    setChatMessages(prev => [...prev, message]);
  };

  const addComponentSelectionMessage = (components: any) => {
    const message: ChatMessage = {
      id: `components-${Date.now()}`,
      content: '',
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'component-selection',
      metadata: { components }
    };
    setChatMessages(prev => [...prev, message]);
  };

  const addScriptCompleteMessage = (script: string) => {
    const message: ChatMessage = {
      id: `script-${Date.now()}`,
      content: script,
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'script-complete'
    };
    setChatMessages(prev => [...prev, message]);
  };

  const handleStartGeneration = (prompt: string) => {
    if (hasStarted) return;
    
    setHasStarted(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: prompt,
      user: { name: "You" },
      createdAt: new Date().toISOString(),
      isOwnMessage: true,
      type: 'message'
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Add system response
    setTimeout(() => {
      addSystemMessage("Perfect! I'll help you create a script about that. Let me start by researching and analyzing the topic to build the best possible content.");
      onStartGeneration(prompt);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!hasStarted) {
      handleStartGeneration(newMessage.trim());
    } else {
      // Handle regular chat during process
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        user: { name: "You" },
        createdAt: new Date().toISOString(),
        isOwnMessage: true,
        type: 'message'
      };
      setChatMessages(prev => [...prev, userMessage]);

      // Auto-respond based on current state
      setTimeout(() => {
        if (scriptState.step === 'selecting-components') {
          addSystemMessage("Please select your preferred components from the options above, then I'll generate your final script.");
        } else if (scriptState.step === 'complete') {
          addSystemMessage("Your script is ready! Is there anything you'd like me to adjust or improve?");
        } else {
          addSystemMessage("I'm working on your script. Please wait while I complete the current step.");
        }
      }, 1000);
    }

    setNewMessage("");
  };

  const handleComponentSelect = (type: string, component: any) => {
    onComponentSelection(type, component);
    addSystemMessage(`Great choice! I've selected "${component.title}" for the ${type} section.`);
    
    // Check if we can generate the final script
    if (canGenerateScript) {
      setTimeout(() => {
        addSystemMessage("All components selected! Generating your final script now...");
        onFinalGeneration();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto h-[600px] flex flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {message.type === 'progress' ? (
              <div className="max-w-md">
                <ProgressTimeline 
                  step={scriptState.step} 
                  sourcesCount={sourcesCount}
                  extractedSourcesCount={extractedSourcesCount}
                />
              </div>
            ) : message.type === 'component-selection' ? (
              <div className="max-w-full">
                <ComponentSelectionDisplay 
                  components={message.metadata.components}
                  onSelection={handleComponentSelect}
                />
              </div>
            ) : message.type === 'script-complete' ? (
              <div className="max-w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm text-green-800">Your Script is Ready!</span>
                  </div>
                  <div className="bg-white rounded p-3 text-sm whitespace-pre-wrap font-mono">
                    {message.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={cn('max-w-[85%] w-fit flex flex-col gap-1', {
                  'items-end': message.isOwnMessage,
                })}>
                  <div className={cn(
                    'py-2 px-3 rounded-lg text-sm w-fit',
                    message.isOwnMessage 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  )}>
                    {message.content}
                  </div>
                  <span className="text-xs text-gray-500 px-2">
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
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-200 p-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            !hasStarted
              ? "Describe your script idea..."
              : scriptState.step === 'selecting-components'
              ? "Select components above or ask questions..."
              : scriptState.step === 'complete'
              ? "Ask for changes or improvements..."
              : "Please wait for the current step to complete..."
          }
          disabled={isGenerating && scriptState.step !== 'selecting-components' && scriptState.step !== 'complete'}
          className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || (isGenerating && scriptState.step !== 'selecting-components' && scriptState.step !== 'complete')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 