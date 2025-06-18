"use client";

import {
  Home,
  ScrollText,
  PenTool,
  FileText,
  Mic,
  Lightbulb,
  Sparkles,
  FolderOpen,
  Mail,
  Settings,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";

interface NavItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  isActive?: boolean;
}

const navigationItems: NavItem[] = [
  {
    href: "/dashboard/default",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/dashboard/scripts",
    icon: ScrollText,
    label: "Scripts",
  },
  {
    href: "/dashboard/capture/notes",
    icon: FileText,
    label: "Notes",
  },
  {
    href: "/dashboard/capture/recordings",
    icon: Mic,
    label: "Recordings",
  },
  {
    href: "/dashboard/inspiration/ai-suggestions",
    icon: Sparkles,
    label: "AI Suggestions",
  },
  {
    href: "/dashboard/inspiration/collections",
    icon: FolderOpen,
    label: "Collections",
  },
];

const quickActions: NavItem[] = [
  {
    href: "/dashboard/scripts/new",
    icon: Plus,
    label: "New Script",
  },
  {
    href: "/dashboard/inspiration/email-demo",
    icon: Mail,
    label: "Email Demo",
  },
  {
    href: "/dashboard/search",
    icon: Search,
    label: "Search",
  },
];

export function NavigationDock() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/default") {
      return pathname === "/dashboard" || pathname === "/dashboard/default";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <TooltipProvider>
        <Dock
          direction="middle"
          className="bg-surface-75/80 border-border-stronger backdrop-blur-xl supports-backdrop-blur:bg-surface-75/60"
        >
          {/* Main Navigation */}
          {navigationItems.map((item) => (
            <DockIcon key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 rounded-xl transition-all duration-200",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-2">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-8 mx-1 bg-border-stronger" />

          {/* Quick Actions */}
          {quickActions.map((item) => (
            <DockIcon key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 rounded-xl transition-all duration-200",
                      "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-2">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-8 mx-1 bg-border-stronger" />

          {/* Settings & Theme Toggle */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-10 rounded-xl transition-all duration-200",
                    isActive("/dashboard/settings")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Settings className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>

          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center">
                  <ModeToggle 
                    className={cn(
                      "size-10 rounded-xl transition-all duration-200",
                      "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2">
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  );
}

// Compact version for mobile or smaller screens
export function CompactNavigationDock() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/default") {
      return pathname === "/dashboard" || pathname === "/dashboard/default";
    }
    return pathname.startsWith(href);
  };

  const essentialItems = [
    { href: "/dashboard/default", icon: Home, label: "Home" },
    { href: "/dashboard/scripts", icon: ScrollText, label: "Scripts" },
    { href: "/dashboard/inspiration/collections", icon: FolderOpen, label: "Collections" },
    { href: "/dashboard/scripts/new", icon: Plus, label: "New" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <TooltipProvider>
        <Dock
          direction="middle"
          iconSize={36}
          iconMagnification={48}
          className="bg-surface-75/80 border-border-stronger backdrop-blur-xl supports-backdrop-blur:bg-surface-75/60"
        >
          {essentialItems.map((item) => (
            <DockIcon key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-9 rounded-lg transition-all duration-200",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="mb-2">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
} 