"use client";

import { ContentDropdown } from "./content-dropdown";

export function SidebarHeader() {
  return (
    <div className="flex flex-col gap-1 bg-muted rounded-lg">
      {/* Content Dropdown (Plus button) */}
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
  );
}
