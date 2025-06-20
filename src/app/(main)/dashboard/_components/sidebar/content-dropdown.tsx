"use client";

import { useRouter } from "next/navigation";

import { CirclePlus, FileText, Mic, ScrollText, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function ContentDropdown() {
  const router = useRouter();
  const { state } = useSidebar();

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
          className={cn(
            // Base styles matching SidebarMenuButton
            "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
            // Icon mode responsive styles - match exactly what SidebarMenuButton uses
            "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
            // Icon and text styling
            "[&>svg]:size-4 [&>svg]:shrink-0"
          )}
        >
          <CirclePlus className="h-4 w-4" strokeWidth={1.5} />
          <span className={cn(
            "truncate",
            // Hide text when collapsed to icon mode
            state === "collapsed" && "sr-only"
          )}>
            New Content
          </span>
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
