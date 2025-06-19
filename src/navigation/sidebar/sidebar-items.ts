import {
  Home,
  Library,
  FolderOpen,
  Settings,
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
        title: "Home",
        url: "/dashboard/default",
        icon: Home,
      },
      {
        title: "Library",
        url: "/dashboard/library",
        icon: Library,
      },
      {
        title: "Collections",
        url: "/dashboard/collections",
        icon: FolderOpen,
      },
    ],
  },
  {
    id: 2,
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
]; 