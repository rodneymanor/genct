"use client";

import { ContentDropdown } from "./content-dropdown";
import { ProfileDropdown } from "./profile-dropdown";

export function SidebarHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <ProfileDropdown />
        <div className="ml-auto flex items-center gap-1">
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
    </div>
  );
}
