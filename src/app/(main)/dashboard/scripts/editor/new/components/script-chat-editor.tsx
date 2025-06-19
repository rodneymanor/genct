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
  type?: 'message' | 'system' | 'progress' | 'component-selection' | 'script-complete' | 'script-outline';
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

// Script Outline Display Component
function ScriptOutlineDisplay({ 
  components, 
  selectedComponents,
  onComponentClick,
  onFinalizeScript
}: { 
  components: Record<string, unknown>; 
  selectedComponents: Record<string, Record<string, unknown>>;
  onComponentClick: (type: string) => void;
  onFinalizeScript: () => void;
}) {
  const getFirstComponent = (componentArray: any[]) => {
    return componentArray && componentArray.length > 0 ? componentArray[0] : null;
  };

  const getSelectedOrFirst = (type: string, componentArray: any[]) => {
    return selectedComponents[type] || getFirstComponent(componentArray);
  };

  const allComponentsSelected = () => {
    const requiredTypes = ['hook', 'bridge', 'goldenNugget', 'wta'];
    return requiredTypes.every(type => selectedComponents[type]);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-sm text-gray-800">Script Outline</span>
      </div>

      {/* Hook Section */}
      {components.hooks && Array.isArray(components.hooks) && components.hooks.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-black">Hook</h4>
          <button
            onClick={() => onComponentClick('hook')}
            className="w-full text-left p-3 bg-gray-100 rounded border hover:border-gray-300 hover:bg-gray-200 transition-colors"
          >
            <div className="font-medium text-sm">
              {getSelectedOrFirst('hook', components.hooks)?.preview || 
               getSelectedOrFirst('hook', components.hooks)?.content?.substring(0, 80) + '...' || 
               getSelectedOrFirst('hook', components.hooks)?.title}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {selectedComponents.hook ? 'Selected' : 'Click to choose from options'}
            </div>
          </button>
        </div>
      )}

      {/* Bridge Section */}
      {components.bridges && Array.isArray(components.bridges) && components.bridges.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-black">Bridge</h4>
          <button
            onClick={() => onComponentClick('bridge')}
            className="w-full text-left p-3 bg-gray-100 rounded border hover:border-gray-300 hover:bg-gray-200 transition-colors"
          >
            <div className="font-medium text-sm">
              {getSelectedOrFirst('bridge', components.bridges)?.preview || 
               getSelectedOrFirst('bridge', components.bridges)?.content?.substring(0, 80) + '...' || 
               getSelectedOrFirst('bridge', components.bridges)?.title}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {selectedComponents.bridge ? 'Selected' : 'Click to choose from options'}
            </div>
          </button>
        </div>
      )}

      {/* Golden Nugget Section */}
      {components.goldenNuggets && Array.isArray(components.goldenNuggets) && components.goldenNuggets.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-black">Golden Nugget</h4>
          <button
            onClick={() => onComponentClick('goldenNugget')}
            className="w-full text-left p-3 bg-gray-100 rounded border hover:border-gray-300 hover:bg-gray-200 transition-colors"
          >
            <div className="font-medium text-sm">
              {getSelectedOrFirst('goldenNugget', components.goldenNuggets)?.title || 
               `Golden Nugget 1`}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {selectedComponents.goldenNugget ? 'Selected' : 'Click to choose from options'}
            </div>
          </button>
        </div>
      )}

      {/* Call to Action Section */}
      {components.wtas && Array.isArray(components.wtas) && components.wtas.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-black">Call to Action</h4>
          <button
            onClick={() => onComponentClick('wta')}
            className="w-full text-left p-3 bg-gray-100 rounded border hover:border-gray-300 hover:bg-gray-200 transition-colors"
          >
            <div className="font-medium text-sm flex items-center gap-2">
              {getSelectedOrFirst('wta', components.wtas)?.preview || 
               getSelectedOrFirst('wta', components.wtas)?.content?.substring(0, 80) + '...' || 
               getSelectedOrFirst('wta', components.wtas)?.title}
              <span className="text-xs text-gray-500 px-2 py-1 rounded capitalize">
                {getSelectedOrFirst('wta', components.wtas)?.actionType || 'engagement'}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {selectedComponents.wta ? 'Selected' : 'Click to choose from options'}
            </div>
          </button>
        </div>
      )}

      {/* Finalize Script Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button 
          onClick={onFinalizeScript}
          disabled={!allComponentsSelected()}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Finalize Script
        </Button>
        {!allComponentsSelected() && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Select all components to finalize your script
          </p>
        )}
      </div>
    </div>
  );
}

// Single Component Selection Display
function SingleComponentSelectionDisplay({ 
  componentType,
  components, 
  onSelection,
  onBack
}: { 
  componentType: string;
  components: any[]; 
  onSelection: (component: Record<string, unknown>) => void;
  onBack: () => void;
}) {
  const getDisplayTitle = (type: string) => {
    switch (type) {
      case 'hook': return 'Hooks';
      case 'bridge': return 'Bridges';
      case 'goldenNugget': return 'Golden Nuggets';
      case 'wta': return 'Call to Action';
      default: return 'Components';
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-800">Select {getDisplayTitle(componentType)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {components.map((component: Record<string, unknown>, index: number) => (
            <button
              key={component.id as string || index}
              onClick={() => onSelection(component)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {componentType === 'goldenNugget' ? (
                <>
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {(component.title as string) || `Golden Nugget ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    {component.bulletPoints && Array.isArray(component.bulletPoints) && component.bulletPoints.length > 0 ? 
                      (component.bulletPoints as string[]).slice(0, 2).join(' • ') + (component.bulletPoints.length > 2 ? '...' : '') :
                      component.content ? 
                        ((component.content as string).length > 120 ? (component.content as string).substring(0, 120) + '...' : component.content) :
                        'Click to select this golden nugget'
                    }
                  </div>
                </>
              ) : componentType === 'wta' ? (
                <>
                  <div className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                    {(component.preview as string) || (component.content as string)?.substring(0, 80) + '...' || (component.title as string)}
                    <span className="text-xs text-gray-500 px-2 py-1 rounded capitalize">
                      {(component.actionType as string) || 'engagement'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {component.content && component.content !== component.preview ? 
                      ((component.content as string).length > 120 ? (component.content as string).substring(0, 120) + '...' : component.content) : 
                      'Click to select this call to action'
                    }
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {(component.preview as string) || (component.content as string)?.substring(0, 80) + '...' || (component.title as string)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {component.content && component.content !== component.preview ? 
                      ((component.content as string).length > 120 ? (component.content as string).substring(0, 120) + '...' : component.content) : 
                      `Click to select this ${componentType}`
                    }
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
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
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);
  const [pendingComponents, setPendingComponents] = useState<Record<string, unknown> | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Record<string, unknown>>>({});
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
    updateChatForState(scriptState);
  }, [scriptState]);

  const updateChatForState = (state: Record<string, unknown>) => {
    console.log('🔄 Updating chat for state:', state);
    
    if (state.step === 'gathering-sources') {
      addProgressMessage();
    } else if (state.step === 'extracting-content') {
      addProgressMessage();
    } else if (state.step === 'generating-components') {
      addProgressMessage();
    } else if (state.step === 'selecting-components' && state.components) {
      console.log('📋 Adding script outline message with components:', state.components);
      setPendingComponents(state.components as Record<string, unknown>);
      addScriptOutlineMessage(state.components as Record<string, unknown>);
    } else if (state.step === 'complete' && state.finalScript) {
      addScriptCompleteMessage(state.finalScript as string);
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
    const existingProgress = chatMessages.find(msg => msg.type === 'progress');
    if (existingProgress) return;
    
    const message: ChatMessage = {
      id: 'progress',
      content: '',
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'progress'
    };
    setChatMessages(prev => [...prev, message]);
  };

  const addScriptOutlineMessage = (components: Record<string, unknown>) => {
    const message: ChatMessage = {
      id: 'script-outline',
      content: '',
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
      type: 'script-outline',
      metadata: { components }
    };
    setChatMessages(prev => [...prev, message]);
  };

  const addScriptCompleteMessage = (script: string) => {
    const message: ChatMessage = {
      id: 'script-complete',
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
    
    // Add user message with black background
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
          addSystemMessage("Please select your preferred components from the outline above, then click 'Finalize Script' when ready.");
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
    setSelectedComponents(prev => ({
      ...prev,
      [type]: component
    }));
    onComponentSelection(type, component);
    addSystemMessage(`Great choice! I've selected "${component.title as string || component.preview as string || 'your option'}" for the ${type} section.`);
    setShowComponentSelection(false);
    setSelectedComponentType(null);
  };

  const handleComponentClick = (type: string) => {
    if (pendingComponents) {
      setSelectedComponentType(type);
      setShowComponentSelection(true);
    }
  };

  const handleBackToChat = () => {
    setShowComponentSelection(false);
    setSelectedComponentType(null);
  };

  const handleFinalizeScript = () => {
    addSystemMessage("Excellent! Generating your final script now...");
    onFinalGeneration();
  };

  const getComponentsForType = (type: string): any[] => {
    if (!pendingComponents) return [];
    
    switch (type) {
      case 'hook':
        return (pendingComponents.hooks as any[]) || [];
      case 'bridge':
        return (pendingComponents.bridges as any[]) || [];
      case 'goldenNugget':
        return (pendingComponents.goldenNuggets as any[]) || [];
      case 'wta':
        return (pendingComponents.wtas as any[]) || [];
      default:
        return [];
    }
  };

  return (
    <div className={cn(
      "w-full h-[600px] flex bg-transparent transition-all duration-300 ease-in-out",
      showComponentSelection ? "max-w-none" : "max-w-[600px] mx-auto"
    )}>
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
              ) : message.type === 'script-outline' ? (
                <div className="max-w-full">
                  <ScriptOutlineDisplay 
                    components={message.metadata?.components as Record<string, unknown> || {}}
                    selectedComponents={selectedComponents}
                    onComponentClick={handleComponentClick}
                    onFinalizeScript={handleFinalizeScript}
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
                      'py-3 px-4 rounded-lg text-sm w-fit',
                      message.isOwnMessage 
                        ? 'bg-black text-white' 
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
      {showComponentSelection && selectedComponentType && pendingComponents && (
        <div className="w-[60%] h-full">
          <SingleComponentSelectionDisplay 
            componentType={selectedComponentType}
            components={getComponentsForType(selectedComponentType)}
            onSelection={(component) => handleComponentSelect(selectedComponentType, component)}
            onBack={handleBackToChat}
          />
        </div>
      )}
    </div>
  );
} 