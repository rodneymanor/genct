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
          variant="secondary"
          size="sm"
          className="ring-offset-background focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary-hover data-[state=open]:bg-muted relative inline-flex h-7 w-7 items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-0 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCreateScript}>
          <ScrollText className="mr-2 h-4 w-4" />
          Script
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreateNote}>
          <FileText className="mr-2 h-4 w-4" />
          Note
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreateRecording}>
          <Mic className="mr-2 h-4 w-4" />
          Recording
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateCollection}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
