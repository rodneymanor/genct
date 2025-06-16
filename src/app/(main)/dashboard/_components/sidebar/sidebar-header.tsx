"use client";

import { ChevronsLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { ContentDropdown } from "./content-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { SearchDialog } from "./search-dialog";

export function SidebarHeader() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        {state === "expanded" && <ProfileDropdown />}
        <div className={`${state === "expanded" ? "ml-auto" : "mx-auto"} flex items-center gap-1`}>
          {state === "expanded" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="ring-offset-background focus-visible:ring-ring hover:text-accent-foreground hover:bg-muted relative inline-flex h-7 w-7 items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:opacity-0 md:group-hover/sidebar:opacity-100"
            >
              <ChevronsLeft className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          )}
          <input
            id="plus-menu-file-input"
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.md,.txt,.epub,.png,.jpg,.jpeg,.tiff,.bmp,.heic,.mp4,.mp3,.wav"
          />
          <input
            id="plus-menu-folder-input"
            type="file"
            className="hidden"
            multiple
            {...({ webkitdirectory: "" } as any)}
          />
          <ContentDropdown />
        </div>
      </div>
      
      {/* Search functionality - show in both expanded and collapsed states */}
      <div className={`${state === "collapsed" ? "px-2" : "px-0"}`}>
        <SearchDialog />
      </div>
    </div>
  );
}
