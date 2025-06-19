"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Clock, CheckCircle, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  user: { name: string };
  createdAt: string;
  isOwnMessage?: boolean;
  type?: 'message' | 'system' | 'progress' | 'component-selection' | 'script-complete';
  metadata?: Record<string, unknown>;
}

interface ScriptChatEditorProps {
  initialPrompt?: string;
  scriptState: Record<string, unknown>;
  onStartGeneration: (prompt: string) => void;
  onComponentSelection: (type: string, component: Record<string, unknown>) => void;
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
    <div className="bg-gray-100 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-sm text-gray-800">Script Generation Progress</span>
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
                <span className="text-xs text-gray-600">({sourcesCount} sources)</span>
              )}
              {stage.status === 'active' && stage.id === 'extracting-content' && extractedSourcesCount > 0 && (
                <span className="text-xs text-gray-600">({extractedSourcesCount} extracted)</span>
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
  onSelection,
  onBack
}: { 
  components: Record<string, unknown>; 
  onSelection: (type: string, component: Record<string, unknown>) => void;
  onBack: () => void;
}) {
  console.log('🎨 Rendering ComponentSelectionDisplay with components:', components);
  
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-800">Select Script Components</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Hooks Section */}
        {components.hooks && Array.isArray(components.hooks) && components.hooks.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-base text-black">Hooks</h4>
            <div className="grid gap-3">
              {components.hooks.map((hook: Record<string, unknown>, index: number) => (
                <button
                  key={hook.id as string || index}
                  onClick={() => onSelection('hook', hook)}
                  className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {(hook.preview as string) || (hook.content as string)?.substring(0, 80) + '...' || (hook.title as string)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {hook.content && hook.content !== hook.preview ? 
                      ((hook.content as string).length > 120 ? (hook.content as string).substring(0, 120) + '...' : hook.content) : 
                      'Click to select this hook'
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bridges Section */}
        {components.bridges && Array.isArray(components.bridges) && components.bridges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-base text-black">Bridges</h4>
            <div className="grid gap-3">
              {components.bridges.map((bridge: Record<string, unknown>, index: number) => (
                <button
                  key={bridge.id as string || index}
                  onClick={() => onSelection('bridge', bridge)}
                  className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {(bridge.preview as string) || (bridge.content as string)?.substring(0, 80) + '...' || (bridge.title as string)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {bridge.content && bridge.content !== bridge.preview ? 
                      ((bridge.content as string).length > 120 ? (bridge.content as string).substring(0, 120) + '...' : bridge.content) : 
                      'Click to select this bridge'
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Golden Nuggets Section */}
        {components.goldenNuggets && Array.isArray(components.goldenNuggets) && components.goldenNuggets.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-base text-black">Golden Nuggets</h4>
            <div className="grid gap-3">
              {components.goldenNuggets.map((nugget: Record<string, unknown>, index: number) => (
                <button
                  key={nugget.id as string || index}
                  onClick={() => onSelection('goldenNugget', nugget)}
                  className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {(nugget.title as string) || `Golden Nugget ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    {nugget.bulletPoints && Array.isArray(nugget.bulletPoints) && nugget.bulletPoints.length > 0 ? 
                      (nugget.bulletPoints as string[]).slice(0, 2).join(' • ') + (nugget.bulletPoints.length > 2 ? '...' : '') :
                      nugget.content ? 
                        ((nugget.content as string).length > 120 ? (nugget.content as string).substring(0, 120) + '...' : nugget.content) :
                        'Click to select this golden nugget'
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* What to Ask (WTA) Section */}
        {components.wtas && Array.isArray(components.wtas) && components.wtas.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-base text-black">Call to Action</h4>
            <div className="grid gap-3">
              {components.wtas.map((wta: Record<string, unknown>, index: number) => (
                <button
                  key={wta.id as string || index}
                  onClick={() => onSelection('wta', wta)}
                  className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                    {(wta.preview as string) || (wta.content as string)?.substring(0, 80) + '...' || (wta.title as string)}
                    <span className="text-xs text-gray-500 px-2 py-1 rounded capitalize">
                      {(wta.actionType as string) || 'engagement'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {wta.content && wta.content !== wta.preview ? 
                      ((wta.content as string).length > 120 ? (wta.content as string).substring(0, 120) + '...' : wta.content) : 
                      'Click to select this call to action'
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
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
  const [showComponentSelection, setShowComponentSelection] = useState(false);
  const [pendingComponents, setPendingComponents] = useState<Record<string, unknown> | null>(null);
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
      console.log('🔄 Script State Update:', {
        step: scriptState.step,
        sourcesCount,
        extractedSourcesCount,
        components: scriptState.components,
        error: scriptState.error
      });
      updateChatForState(scriptState);
    }
  }, [scriptState.step, scriptState.error, sourcesCount, extractedSourcesCount, hasStarted]);

  const updateChatForState = (state: Record<string, unknown>) => {
    console.log('📝 Updating chat for state:', state.step);
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    // Avoid duplicate progress messages
    if (lastMessage?.type === 'progress' && 
        ['gathering-sources', 'extracting-content', 'generating-components'].includes(state.step as string)) {
      console.log('⏭️ Skipping duplicate progress message for:', state.step);
      return;
    }

    switch (state.step) {
      case 'gathering-sources':
        if (lastMessage?.type !== 'progress') {
          console.log('🔍 Adding progress message for gathering sources');
          addProgressMessage();
        }
        break;
      case 'extracting-content':
        if (sourcesCount > 0 && lastMessage?.content !== `Great! I found ${sourcesCount} relevant sources. Now I'm analyzing the content to extract key insights.`) {
          console.log('📊 Adding message for content extraction, sources:', sourcesCount);
          addSystemMessage(`Great! I found ${sourcesCount} relevant sources. Now I'm analyzing the content to extract key insights.`);
        }
        break;
      case 'generating-components':
        if (extractedSourcesCount > 0 && lastMessage?.content !== `Perfect! I've analyzed ${extractedSourcesCount} sources and extracted valuable insights. Now I'm generating script components based on this research.`) {
          console.log('⚙️ Adding message for component generation, extracted:', extractedSourcesCount);
          addSystemMessage(`Perfect! I've analyzed ${extractedSourcesCount} sources and extracted valuable insights. Now I'm generating script components based on this research.`);
        }
        break;
      case 'selecting-components':
        if (state.components && lastMessage?.type !== 'component-selection') {
          console.log('🎯 Adding component selection message. Components:', state.components);
          console.log('📋 Component details:', {
            hooks: (state.components as Record<string, unknown>).hooks ? Array.isArray((state.components as Record<string, unknown>).hooks) ? ((state.components as Record<string, unknown>).hooks as unknown[]).length : 0 : 0,
            bridges: (state.components as Record<string, unknown>).bridges ? Array.isArray((state.components as Record<string, unknown>).bridges) ? ((state.components as Record<string, unknown>).bridges as unknown[]).length : 0 : 0,
            goldenNuggets: (state.components as Record<string, unknown>).goldenNuggets ? Array.isArray((state.components as Record<string, unknown>).goldenNuggets) ? ((state.components as Record<string, unknown>).goldenNuggets as unknown[]).length : 0 : 0,
            wtas: (state.components as Record<string, unknown>).wtas ? Array.isArray((state.components as Record<string, unknown>).wtas) ? ((state.components as Record<string, unknown>).wtas as unknown[]).length : 0 : 0
          });
          addSystemMessage("Excellent! I've generated several script components. Click any component below to review and select your preferred options:");
          setPendingComponents(state.components as Record<string, unknown>);
          addComponentSelectionMessage(state.components as Record<string, unknown>);
        }
        break;
      case 'generating-script':
        if (lastMessage?.content !== "Perfect! I'm now generating your final script with the selected components.") {
          console.log('📜 Adding message for final script generation');
          addSystemMessage("Perfect! I'm now generating your final script with the selected components.");
        }
        break;
      case 'complete':
        if (state.finalScript && lastMessage?.type !== 'script-complete') {
          console.log('✅ Adding script completion message. Script length:', (state.finalScript as string)?.length || 0);
          addSystemMessage("Your script is complete! Here's what I've created for you:");
          addScriptCompleteMessage(state.finalScript as string);
        }
        break;
      case 'error':
        if (state.error) {
          console.error('❌ Script generation error:', state.error);
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

  const addComponentSelectionMessage = (components: Record<string, unknown>) => {
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

  const handleComponentSelect = (type: string, component: Record<string, unknown>) => {
    onComponentSelection(type, component);
    addSystemMessage(`Great choice! I've selected "${component.title as string}" for the ${type} section.`);
    setShowComponentSelection(false);
    
    // Check if we can generate the final script
    if (canGenerateScript) {
      setTimeout(() => {
        addSystemMessage("All components selected! Generating your final script now...");
        onFinalGeneration();
      }, 1000);
    }
  };

  const handleComponentSelectionClick = () => {
    if (pendingComponents) {
      setShowComponentSelection(true);
    }
  };

  const handleBackToChat = () => {
    setShowComponentSelection(false);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto h-[600px] flex bg-transparent">
      {/* Chat Container */}
      <div className={cn(
        "flex flex-col bg-transparent transition-all duration-300 ease-in-out",
        showComponentSelection ? "w-[40%]" : "w-full"
      )}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {message.type === 'progress' ? (
                <div className="max-w-md">
                  <ProgressTimeline 
                    step={scriptState.step as string} 
                    sourcesCount={sourcesCount}
                    extractedSourcesCount={extractedSourcesCount}
                  />
                </div>
              ) : message.type === 'component-selection' ? (
                <div className="max-w-full">
                  <button
                    onClick={handleComponentSelectionClick}
                    className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm text-gray-800">Click to Select Script Components</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Review and choose your preferred hooks, bridges, golden nuggets, and calls to action
                    </div>
                  </button>
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
                      'py-3 px-4 rounded-lg text-sm w-fit',
                      message.isOwnMessage 
                        ? 'bg-gray-200 text-gray-900' 
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
        <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-200 p-4 bg-white">
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

      {/* Component Selection Panel */}
      {showComponentSelection && pendingComponents && (
        <div className="w-[60%] h-full">
          <ComponentSelectionDisplay 
            components={pendingComponents}
            onSelection={handleComponentSelect}
            onBack={handleBackToChat}
          />
        </div>
      )}
    </div>
  );
} 