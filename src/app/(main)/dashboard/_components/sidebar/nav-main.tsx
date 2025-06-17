"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { type NavGroup, type NavMainItem } from "@/navigation/sidebar/sidebar-items";

interface NavMainProps {
  readonly items: readonly NavGroup[];
}

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">Soon</span>
);

const NavItemExpanded = ({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <Collapsible key={item.title} asChild defaultOpen={!!item.subItems} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              disabled={item.comingSoon}
              isActive={isActive(item.url, item.subItems)}
              tooltip={item.title}
              className="group/button text-sm font-medium transition-all duration-200 hover:bg-accent/60 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold"
            >
              {item.icon && <item.icon className="text-muted-foreground group-data-[active=true]/button:text-accent-foreground" strokeWidth={1.5} />}
              <span>{item.title}</span>
              {item.comingSoon && <IsComingSoon />}
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" strokeWidth={1.5} />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              asChild
              aria-disabled={item.comingSoon}
              isActive={isActive(item.url)}
              tooltip={item.title}
              className="group/button text-sm font-medium transition-all duration-200 hover:bg-accent/60 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold"
            >
              <Link href={item.url} target={item.newTab ? "_blank" : undefined}>
                {item.icon && <item.icon className="text-muted-foreground group-data-[active=true]/button:text-accent-foreground" strokeWidth={1.5} />}
                <span>{item.title}</span>
                {item.comingSoon && <IsComingSoon />}
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>
        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub className="ml-4 mt-1 space-y-0.5 border-l border-border/40 pl-4">
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton 
                    aria-disabled={subItem.comingSoon} 
                    isActive={isActive(subItem.url)} 
                    asChild
                    className="group/subbutton text-sm transition-all duration-200 hover:bg-accent/40 data-[active=true]:bg-accent/60 data-[active=true]:text-accent-foreground data-[active=true]:font-medium"
                  >
                    <Link href={subItem.url} target={subItem.newTab ? "_blank" : undefined}>
                      {subItem.icon && <subItem.icon className="text-muted-foreground group-data-[active=true]/subbutton:text-accent-foreground" strokeWidth={1.5} />}
                      <span>{subItem.title}</span>
                      {subItem.comingSoon && <IsComingSoon />}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavItemCollapsed = ({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <SidebarMenuItem key={item.title}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            disabled={item.comingSoon}
            tooltip={item.title}
            isActive={isActive(item.url, item.subItems)}
            className="transition-all duration-200 hover:bg-accent/60 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
          >
            {item.icon && <item.icon strokeWidth={1.5} />}
            <span className="sr-only">{item.title}</span>
            <ChevronRight className="sr-only" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-50 space-y-1 border border-border/60 bg-popover/95 backdrop-blur-sm shadow-lg" 
          side="right" 
          align="start"
          sideOffset={8}
        >
          {item.subItems?.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <SidebarMenuSubButton
                key={subItem.title}
                asChild
                className="cursor-pointer focus-visible:ring-0 transition-colors duration-200 hover:bg-accent/60"
                aria-disabled={subItem.comingSoon}
                isActive={isActive(subItem.url)}
              >
                <Link href={subItem.url} target={subItem.newTab ? "_blank" : undefined}>
                  {subItem.icon && <subItem.icon className="text-muted-foreground" strokeWidth={1.5} />}
                  <span>{subItem.title}</span>
                  {subItem.comingSoon && <IsComingSoon />}
                </Link>
              </SidebarMenuSubButton>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();
  const { state, isMobile } = useSidebar();

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(sub.url));
    }
        return path === url;
  };

  return (
    <div className="px-2 py-2">
      {items.map((group) => (
        <SidebarGroup key={group.id} className="mb-4">
          {group.label && <SidebarGroupLabel className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {group.items.map((item) =>
                state === "collapsed" && !isMobile ? (
                  <NavItemCollapsed key={item.title} item={item} isActive={isItemActive} />
                ) : (
                  <NavItemExpanded key={item.title} item={item} isActive={isItemActive} />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
