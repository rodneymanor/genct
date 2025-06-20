"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ScriptInputProps {
  className?: string;
}

export function ScriptInput({ className }: ScriptInputProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const fullPlaceholder = "What will you script today?";
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const typeWriter = () => {
      if (currentIndex < fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 100);
      } else {
        setIsTyping(false);
      }
    };
    
    typeWriter();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      // Navigate to script editor with the prompt as a URL parameter
      const encodedPrompt = encodeURIComponent(value.trim());
      router.push(`/dashboard/scripts/editor/new?prompt=${encodedPrompt}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("relative flex items-center gap-3", className)}>
      <form onSubmit={handleSubmit} className="flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-none focus:border-none focus:outline-none shadow-none bg-transparent text-base"
          autoFocus
        />
      </form>
      
      {value.trim() && (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          Press Enter to generate script
        </div>
      )}
    </div>
  );
} 