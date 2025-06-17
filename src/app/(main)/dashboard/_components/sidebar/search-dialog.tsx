"use client";
import * as React from "react";

import { ChartPie, Grid2X2, ChartLine, ShoppingBag, BookA, Forklift, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSidebar } from "@/components/ui/sidebar";

const searchItems = [
  { group: "Dashboards", icon: ChartPie, label: "Default" },
  { group: "Dashboards", icon: Grid2X2, label: "CRM", disabled: true },
  { group: "Dashboards", icon: ChartLine, label: "Analytics", disabled: true },
  { group: "Dashboards", icon: ShoppingBag, label: "E-Commerce", disabled: true },
  { group: "Dashboards", icon: BookA, label: "Academy", disabled: true },
  { group: "Dashboards", icon: Forklift, label: "Logistics", disabled: true },
  { group: "Authentication", label: "Login v1" },
  { group: "Authentication", label: "Register v1" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const { state } = useSidebar();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isCollapsed = state === "collapsed";

  return (
    <>
      <Button
        variant="ghost"
        size={isCollapsed ? "icon" : "sm"}
        onClick={() => setOpen(true)}
        className={isCollapsed ? "h-8 w-8 p-0" : "text-muted-foreground hover:text-foreground w-full justify-start"}
      >
        <Search className={`${isCollapsed ? "h-4 w-4" : "mr-2 h-4 w-4"}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">Search</span>
            <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
              <span className="text-xs">⌘</span>J
            </kbd>
          </>
        )}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search dashboards, users, and more…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem className="!py-1.5" key={item.label} onSelect={() => setOpen(false)}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
