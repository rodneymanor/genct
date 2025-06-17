"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Mic, BookOpen, Lightbulb, Plus, ArrowRight } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  className?: string;
}

const searchItems = [
  // Navigation items
  { group: "Navigation", icon: FileText, label: "Scripts Library", url: "/dashboard/scripts" },
  { group: "Navigation", icon: Mic, label: "Voice Notes", url: "/dashboard/capture/notes" },
  { group: "Navigation", icon: BookOpen, label: "Recordings", url: "/dashboard/capture/recordings" },
  { group: "Navigation", icon: Lightbulb, label: "AI Suggestions", url: "/dashboard/inspiration/ai-suggestions" },
  { group: "Navigation", icon: BookOpen, label: "Collections", url: "/dashboard/inspiration/collections" },
  
  // Quick actions
  { group: "Quick Actions", icon: Plus, label: "New Script", url: "/dashboard/scripts/editor/new" },
  { group: "Quick Actions", icon: Mic, label: "Start Recording", action: "start-recording" },
  { group: "Quick Actions", icon: FileText, label: "Quick Note", action: "quick-note" },
  
  // Recent scripts (these would be dynamic in a real app)
  { group: "Recent Scripts", icon: FileText, label: "5 Productivity Hacks That Changed My Life" },
  { group: "Recent Scripts", icon: FileText, label: "Why Most People Fail at Goal Setting" },
  { group: "Recent Scripts", icon: FileText, label: "The Truth About Social Media Success" },
];

export function GlobalSearch({ className }: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(true);
  
  const fullPlaceholder = "Search scripts, navigate, or create something new...";
  
  // Typewriter effect for placeholder
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const typeWriter = () => {
      if (currentIndex < fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 50);
      } else {
        setIsTyping(false);
      }
    };
    
    typeWriter();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleInputClick = () => {
    setOpen(true);
  };

  const handleSelect = (item: typeof searchItems[0]) => {
    setOpen(false);
    
    if (item.url) {
      router.push(item.url);
    } else if (item.action) {
      // Handle special actions
      switch (item.action) {
        case "start-recording":
          // Implement recording logic
          console.log("Start recording");
          break;
        case "quick-note":
          // Implement quick note logic
          console.log("Quick note");
          break;
      }
    }
  };

  const handleScriptGeneration = () => {
    if (searchValue.trim()) {
      setOpen(false);
      const encodedPrompt = encodeURIComponent(searchValue.trim());
      router.push(`/dashboard/scripts/editor/new?prompt=${encodedPrompt}`);
    }
  };

  return (
    <>
      <div className={cn("relative flex items-center", className)}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClick={handleInputClick}
            placeholder={placeholder}
            className="pl-10 pr-16 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-ring/20"
            readOnly
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <kbd className="bg-background border text-xs px-1.5 py-0.5 rounded font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search scripts, navigate, or describe what you want to create..." 
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <p className="text-sm text-muted-foreground">No results found.</p>
              {searchValue.trim() && (
                <Button 
                  onClick={handleScriptGeneration}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Generate script: "{searchValue}"
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CommandEmpty>
          
          {/* Show script generation option when there's search text */}
          {searchValue.trim() && (
            <>
              <CommandGroup heading="Create">
                <CommandItem onSelect={handleScriptGeneration} className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Generate script: "{searchValue}"</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          
          {/* Search results */}
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .filter((item) => 
                    !searchValue || 
                    item.label.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((item) => (
                    <CommandItem 
                      key={item.label} 
                      onSelect={() => handleSelect(item)}
                      className="gap-2"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
} 