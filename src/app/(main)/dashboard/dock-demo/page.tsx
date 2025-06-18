"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  CalendarIcon,
  HomeIcon,
  EnvelopeClosedIcon,
  Pencil1Icon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Share,
  Download,
  Settings,
  User,
  Bell,
  Search,
} from "lucide-react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationDock, CompactNavigationDock } from "@/components/ui/navigation-dock";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type IconProps = React.HTMLAttributes<SVGElement>;

const Icons = {
  calendar: (props: IconProps) => <CalendarIcon {...props} />,
  email: (props: IconProps) => <EnvelopeClosedIcon {...props} />,
  linkedin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>LinkedIn</title>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  ),
  x: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>X</title>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  ),
  github: (props: IconProps) => <GitHubLogoIcon {...props} />,
};

// Demo data for different dock configurations
const basicNavData = {
  navbar: [
    { href: "#", icon: HomeIcon, label: "Home" },
    { href: "#", icon: Pencil1Icon, label: "Blog" },
    { href: "#", icon: Icons.calendar, label: "Calendar" },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "#",
        icon: Icons.github,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "#",
        icon: Icons.linkedin,
      },
      X: {
        name: "X",
        url: "#",
        icon: Icons.x,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
      },
    },
  },
};

const mediaPlayerData = [
  { icon: SkipBack, label: "Previous" },
  { icon: Play, label: "Play" },
  { icon: SkipForward, label: "Next" },
  { icon: Volume2, label: "Volume" },
];

const socialActionsData = [
  { icon: Heart, label: "Like", color: "hover:text-red-500" },
  { icon: Share, label: "Share", color: "hover:text-blue-500" },
  { icon: Download, label: "Download", color: "hover:text-green-500" },
];

// Basic Demo Dock Component
function BasicDockDemo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h3 className="text-lg font-semibold">Basic Navigation Dock</h3>
      <TooltipProvider>
        <Dock direction="middle">
          {basicNavData.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full hover:bg-primary/10"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full" />
          {Object.entries(basicNavData.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    aria-label={social.name}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full hover:bg-primary/10"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="h-full py-2" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle className="rounded-full size-12" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  );
}

// Media Player Dock Component
function MediaPlayerDock({ isPlaying, setIsPlaying }: { isPlaying: boolean; setIsPlaying: (playing: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h3 className="text-lg font-semibold">Media Player Dock</h3>
      <TooltipProvider>
        <Dock 
          direction="middle"
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200/50 dark:border-purple-800/50"
        >
          {mediaPlayerData.map((item, index) => (
            <DockIcon key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      if (item.icon === Play) setIsPlaying(!isPlaying);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full hover:bg-purple-500/20",
                      item.icon === Play && isPlaying && "bg-purple-500/30"
                    )}
                  >
                    {item.icon === Play && isPlaying ? (
                      <Pause className="size-5" />
                    ) : (
                      <item.icon className="size-5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
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

// Social Actions Dock Component
function SocialActionsDock() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h3 className="text-lg font-semibold">Social Actions Dock</h3>
      <TooltipProvider>
        <Dock 
          direction="middle"
          iconSize={35}
          iconMagnification={50}
          className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 border-pink-200/50 dark:border-pink-800/50"
        >
          {socialActionsData.map((item, index) => (
            <DockIcon key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 rounded-lg transition-all duration-200",
                      item.color
                    )}
                  >
                    <item.icon className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
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

// Utility Actions Dock Component
function UtilityActionsDock() {
  const utilityItems = [
    { icon: Search, label: "Search", color: "hover:text-blue-500" },
    { icon: Bell, label: "Notifications", color: "hover:text-yellow-500" },
    { icon: User, label: "Profile", color: "hover:text-green-500" },
    { icon: Settings, label: "Settings", color: "hover:text-gray-500" },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h3 className="text-lg font-semibold">Utility Actions Dock</h3>
      <TooltipProvider>
        <Dock 
          direction="middle"
          iconSize={32}
          iconMagnification={44}
          className="bg-surface-75/60 border-border-stronger"
        >
          {utilityItems.map((item, index) => (
            <DockIcon key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-8 rounded-md transition-all duration-200",
                      item.color,
                      "hover:bg-muted"
                    )}
                  >
                    <item.icon className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
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

export default function DockDemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCompact, setShowCompact] = useState(false);

  return (
    <div className="@container/main flex flex-col gap-6 md:gap-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Magic UI Dock Demo</h1>
          <p className="text-muted-foreground">
            Interactive dock components with smooth animations and hover effects.
          </p>
        </div>
      </div>

      {/* Demo Sections */}
      <div className="grid gap-8">
        {/* Basic Dock Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Navigation Dock</CardTitle>
            <CardDescription>
              A standard dock with navigation items, social links, and theme toggle.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <BasicDockDemo />
          </CardContent>
        </Card>

        {/* Media Player Dock */}
        <Card>
          <CardHeader>
            <CardTitle>Media Player Controls</CardTitle>
            <CardDescription>
              Custom styled dock for media player controls with gradient background.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <MediaPlayerDock isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          </CardContent>
        </Card>

        {/* Social Actions Dock */}
        <Card>
          <CardHeader>
            <CardTitle>Social Actions</CardTitle>
            <CardDescription>
              Compact dock with social interaction buttons and custom hover colors.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <SocialActionsDock />
          </CardContent>
        </Card>

        {/* Utility Actions Dock */}
        <Card>
          <CardHeader>
            <CardTitle>Utility Actions</CardTitle>
            <CardDescription>
              Small utility dock with common app actions using Supabase styling.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <UtilityActionsDock />
          </CardContent>
        </Card>

        {/* Navigation Dock Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Project Navigation Dock</CardTitle>
            <CardDescription>
              Toggle between full and compact versions of the project navigation dock.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowCompact(!showCompact)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "transition-all duration-200"
                )}
              >
                Switch to {showCompact ? "Full" : "Compact"} Version
              </button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {showCompact ? "Compact Navigation Dock" : "Full Navigation Dock"}
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
            <CardDescription>
              How to integrate the dock components into your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Import the Components</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`import { NavigationDock, CompactNavigationDock } from "@/components/ui/navigation-dock";
import { Dock, DockIcon } from "@/components/magicui/dock";`}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Add to Your Layout</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`// Add to your main layout or specific pages
<NavigationDock />

// Or use the compact version for mobile
<CompactNavigationDock />`}
              </pre>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Customize Styling</h4>
              <p className="text-sm text-muted-foreground">
                The dock components use your existing Supabase design tokens:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li><code>bg-surface-75/80</code> - Semi-transparent background</li>
                <li><code>border-border-stronger</code> - Stronger border color</li>
                <li><code>backdrop-blur-xl</code> - Glass morphism effect</li>
                <li><code>hover:bg-primary/10</code> - Subtle hover states</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Navigation Dock (conditionally rendered) */}
      {showCompact ? <CompactNavigationDock /> : <NavigationDock />}
    </div>
  );
} 