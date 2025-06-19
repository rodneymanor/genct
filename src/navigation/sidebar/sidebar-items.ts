import {
  Home,
  PenTool,
  FileText,
  Mic,
  ScrollText,
  Lightbulb,
  Sparkles,
  FolderOpen,
  Settings,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/default",
        icon: Home,
      },
      {
        title: "Scripts",
        url: "/dashboard/scripts",
        icon: ScrollText,
      },
      {
        title: "Capture",
        url: "/dashboard/capture",
        icon: PenTool,
        subItems: [
          { title: "Notes", url: "/dashboard/capture/notes", icon: FileText },
          { title: "Recordings", url: "/dashboard/capture/recordings", icon: Mic },
        ],
      },
      {
        title: "Inspiration",
        url: "/dashboard/inspiration",
        icon: Lightbulb,
        subItems: [
          { title: "AI Suggestions", url: "/dashboard/inspiration/ai-suggestions", icon: Sparkles },
          { title: "Collections", url: "/dashboard/inspiration/collections", icon: FolderOpen },
          { title: "Email Demo", url: "/dashboard/inspiration/email-demo", icon: Mail },
        ],
      },
    ],
  },
  {
    id: 2,
    items: [
      {
        title: "Dock Demo",
        url: "/dashboard/dock-demo",
        icon: PenTool,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
]; 