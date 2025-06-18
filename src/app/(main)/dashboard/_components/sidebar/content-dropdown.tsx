"use client";

import { useRouter } from "next/navigation";

import { Plus, FileText, Mic, ScrollText, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ContentDropdown() {
  const router = useRouter();

  const handleCreateScript = () => {
    router.push("/dashboard/scripts/editor/new");
  };

  const handleCreateNote = () => {
    router.push("/dashboard/note-editor?id=new");
  };

  const handleCreateRecording = () => {
    router.push("/dashboard/capture/record");
  };

  const handleCreateCollection = () => {
    router.push("/dashboard/inspiration/collections");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-foreground/20 bg-background/50 text-foreground/80 transition-all duration-200 hover:border-foreground/50 hover:bg-accent/50 hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:outline-none data-[state=open]:bg-accent data-[state=open]:border-foreground/50"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 border border-foreground/15 bg-popover/95 backdrop-blur-sm shadow-lg"
        sideOffset={4}
      >
        <DropdownMenuItem 
          onClick={handleCreateScript}
          className="cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <ScrollText className="mr-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          Script
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCreateNote}
          className="cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <FileText className="mr-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          Note
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleCreateRecording}
          className="cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <Mic className="mr-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          Recording
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-foreground/10" />
        <DropdownMenuItem 
          onClick={handleCreateCollection}
          className="cursor-pointer text-sm font-medium transition-colors duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          Collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
