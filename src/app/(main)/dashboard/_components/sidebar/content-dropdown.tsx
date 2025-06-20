"use client";

import Link from "next/link";

import { CirclePlus } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function ContentDropdown() {
  const { state } = useSidebar();

  return (
    <Link
      href="/dashboard/default"
      className={cn(
        // Base styles matching SidebarMenuButton
        "flex w-full items-center justify-center overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[background,color] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
        // Icon mode responsive styles - match exactly what SidebarMenuButton uses
        "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
        // Icon and text styling
        "[&>svg]:size-4 [&>svg]:shrink-0",
        // Background for rounded square
        "bg-muted",
      )}
      tabIndex={0}
      aria-label="Go to main page"
    >
      <CirclePlus className="h-4 w-4" strokeWidth={1.5} />
      <span className={cn(
        "truncate",
        // Hide text when collapsed to icon mode
        state === "collapsed" && "sr-only"
      )}>
        New Content
      </span>
    </Link>
  );
}
