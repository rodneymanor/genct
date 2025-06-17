"use client";

import Image from "next/image";

import { useSidebar } from "@/components/ui/sidebar";

import { ContentDropdown } from "./content-dropdown";

export function SidebarHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex flex-col gap-3 p-1.5">
      {/* Logo */}
      <div className={`flex items-center justify-center transition-all duration-200 ${isCollapsed ? 'py-0.5' : 'py-1'}`}>
        <Image
          src="/gc.svg"
          alt="Gen C Logo"
          width={isCollapsed ? 56 : 84}
          height={isCollapsed ? 56 : 84}
          className="transition-all duration-200 filter drop-shadow-sm"
        />
      </div>
      
      {/* Content Dropdown (Plus button) */}
      <div className="flex items-center justify-center">
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
          {...({ webkitdirectory: "" } as Record<string, string>)}
        />
        <ContentDropdown />
      </div>
    </div>
  );
}
