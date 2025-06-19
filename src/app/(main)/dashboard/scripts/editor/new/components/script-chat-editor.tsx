"use client";

import { useState, useEffect, useRef } from "react";

import { Check, X, Send, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ScriptOutlineComponent {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  alternatives: {
    id: string;
    title: string;
    content: string;
    description: string;
  }[];
}

interface ChatMessage {
  id: string;
  content: string;
  user: { name: string };
  createdAt: string;
  isOwnMessage?: boolean;
}

interface ScriptChatEditorProps {
  roomName: string;
  username: string;
  onScriptUpdate?: (script: any) => void;
}

const initialOutline: ScriptOutlineComponent[] = [
  {
    id: "hook",
    title: "Hook",
    description: "Grab attention in the first 3-5 seconds",
    isSelected: false,
    alternatives: [
      { id: "hook-1", title: "Question Hook", content: "Start with a compelling question", description: "Engage viewers with curiosity" },
      { id: "hook-2", title: "Statistic Hook", content: "Open with surprising data", description: "Use numbers to shock and inform" },
      { id: "hook-3", title: "Story Hook", content: "Begin with a personal anecdote", description: "Connect emotionally from the start" },
      { id: "hook-4", title: "Contradiction Hook", content: "Challenge common beliefs", description: "Create cognitive dissonance" },
    ]
  },
  {
    id: "bridge",
    title: "Bridge",
    description: "Connect the hook to your main topic",
    isSelected: false,
    alternatives: [
      { id: "bridge-1", title: "Problem Bridge", content: "Identify the core problem", description: "Set up the need for a solution" },
      { id: "bridge-2", title: "Context Bridge", content: "Provide background information", description: "Give viewers necessary context" },
      { id: "bridge-3", title: "Personal Bridge", content: "Share your connection to the topic", description: "Build credibility and relatability" },
      { id: "bridge-4", title: "Preview Bridge", content: "Tease what's coming next", description: "Create anticipation" },
    ]
  },
  {
    id: "climax",
    title: "Climax",
    description: "Deliver your main message or solution",
    isSelected: false,
    alternatives: [
      { id: "climax-1", title: "Solution Reveal", content: "Present the main solution", description: "Deliver the core value" },
      { id: "climax-2", title: "Insight Share", content: "Reveal key insights", description: "Provide 'aha' moments" },
      { id: "climax-3", title: "Story Resolution", content: "Complete the narrative arc", description: "Satisfy the story setup" },
      { id: "climax-4", title: "Demonstration", content: "Show rather than tell", description: "Provide concrete examples" },
    ]
  },
  {
    id: "conclusion",
    title: "Conclusion",
    description: "Wrap up with a strong ending",
    isSelected: false,
    alternatives: [
      { id: "conclusion-1", title: "Call to Action", content: "Direct viewers to take action", description: "Drive engagement" },
      { id: "conclusion-2", title: "Summary Wrap", content: "Recap key points", description: "Reinforce main messages" },
      { id: "conclusion-3", title: "Question Ending", content: "Leave viewers thinking", description: "Encourage reflection" },
      { id: "conclusion-4", title: "Future Tease", content: "Hint at upcoming content", description: "Build anticipation for next video" },
    ]
  },
];

// Simple local chat component
function LocalChat({ messages, onSendMessage, username }: {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  username: string;
}) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            Welcome to the Script Editor! Click on outline components to build your script.
          </div>
        ) : null}
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={cn(
                  'max-w-[75%] w-fit flex flex-col gap-1',
                  message.isOwnMessage && 'items-end'
                )}
              >
                <div
                  className={cn(
                    'py-2 px-3 rounded-xl text-sm w-fit',
                    message.isOwnMessage 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  )}
                >
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
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 border-t p-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export function ScriptChatEditor({ roomName, username, onScriptUpdate }: ScriptChatEditorProps) {
  const [outline, setOutline] = useState<ScriptOutlineComponent[]>(initialOutline);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  // Add welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      content: "Welcome to the Script Editor! I'll help you build your script step by step. Click on any outline component to get started.",
      user: { name: "Script Assistant" },
      createdAt: new Date().toISOString(),
      isOwnMessage: false,
    };
    setChatMessages([welcomeMessage]);
  }, []);

  // Handle component selection
  const handleComponentClick = (componentId: string) => {
    setSelectedComponent(componentId);
    setSelectedAlternative(null);
    setIsRightPanelOpen(true);
    
    // Update outline to show selected state
    setOutline(prev => prev.map(comp => ({
      ...comp,
      isSelected: comp.id === componentId
    })));
  };

  // Handle alternative selection
  const handleAlternativeSelect = (alternativeId: string) => {
    setSelectedAlternative(alternativeId);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedComponent && selectedAlternative) {
      const component = outline.find(c => c.id === selectedComponent);
      const alternative = component?.alternatives.find(a => a.id === selectedAlternative);
      
      if (component && alternative) {
        // Add message to chat
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          content: `Great choice! I've added "${alternative.title}" for your ${component.title.toLowerCase()}. ${alternative.content}`,
          user: { name: "Script Assistant" },
          createdAt: new Date().toISOString(),
          isOwnMessage: false,
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        
        // Notify parent of script update
        onScriptUpdate?.({
          componentId: selectedComponent,
          alternativeId: selectedAlternative,
          content: alternative.content,
          title: alternative.title,
        });
      }
    }
    
    // Close panel and reset selection
    setIsRightPanelOpen(false);
    setSelectedComponent(null);
    setSelectedAlternative(null);
    setOutline(prev => prev.map(comp => ({ ...comp, isSelected: false })));
  };

  // Handle cancel
  const handleCancel = () => {
    setIsRightPanelOpen(false);
    setSelectedComponent(null);
    setSelectedAlternative(null);
    setOutline(prev => prev.map(comp => ({ ...comp, isSelected: false })));
  };

  // Handle user messages
  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      user: { name: username },
      createdAt: new Date().toISOString(),
      isOwnMessage: true,
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Auto-respond with helpful suggestions
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I can help you with that! Try clicking on one of the outline components above to explore specific options for your script.",
        user: { name: "Script Assistant" },
        createdAt: new Date().toISOString(),
        isOwnMessage: false,
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const selectedComponentData = outline.find(c => c.id === selectedComponent);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-lg border bg-background">
      {/* Main Chat Container */}
      <motion.div
        className="absolute inset-0 flex flex-col"
        animate={{
          x: isRightPanelOpen ? -200 : 0,
          scale: isRightPanelOpen ? 0.95 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Script Outline Overlay */}
        <AnimatePresence>
          {!isRightPanelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="max-w-2xl space-y-4 p-8">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold">Script Outline</h2>
                  <p className="text-muted-foreground">Click on any component to explore alternatives</p>
                </div>
                
                <div className="grid gap-4">
                  {outline.map((component, index) => (
                    <motion.div
                      key={component.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md",
                          component.isSelected && "ring-2 ring-primary"
                        )}
                        onClick={() => handleComponentClick(component.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{component.title}</h3>
                              <p className="text-sm text-muted-foreground">{component.description}</p>
                            </div>
                            <Badge variant="secondary">{index + 1}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {/* Background alternatives preview */}
                <div className="absolute inset-0 -z-10 opacity-10">
                  {outline.map((component) => (
                    <div key={component.id} className="space-y-1">
                      {component.alternatives.map((alt) => (
                        <div key={alt.id} className="text-xs text-muted-foreground">
                          {alt.title}: {alt.content}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Interface */}
        <div ref={chatRef} className="h-full">
          <LocalChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            username={username}
          />
        </div>
      </motion.div>

      {/* Right Panel */}
      <AnimatePresence>
        {isRightPanelOpen && selectedComponentData && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="absolute right-0 top-0 h-full w-80 border-l bg-background shadow-lg"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="border-b p-4">
                <h3 className="font-semibold">{selectedComponentData.title} Options</h3>
                <p className="text-sm text-muted-foreground">{selectedComponentData.description}</p>
              </div>

              {/* Alternatives */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedComponentData.alternatives.map((alternative) => (
                  <Card
                    key={alternative.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-sm",
                      selectedAlternative === alternative.id && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => handleAlternativeSelect(alternative.id)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">{alternative.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{alternative.description}</p>
                      <p className="text-sm mt-2">{alternative.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedAlternative}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 