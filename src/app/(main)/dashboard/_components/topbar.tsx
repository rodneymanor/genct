"use client";

import Image from "next/image";

import { GlobalSearch } from "@/components/ui/global-search";
import HelpNotificationsButtons from "@/components/ui/help-notifications-buttons";
import { useSidebar } from "@/components/ui/sidebar";
import { users } from "@/data/users";

import { AccountSwitcher } from "./sidebar/account-switcher";

export function Topbar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 bg-background border-b border-border-strong transition-all duration-200 ease-linear">
      <div className={`flex w-full items-center gap-2 px-4 lg:px-6 transition-all duration-200 ease-linear ${
        isCollapsed 
          ? "md:pl-[calc(var(--sidebar-width-icon)+1rem)]" 
          : "md:pl-[calc(var(--sidebar-width)+1rem)]"
      }`}>
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/gc.svg"
            alt="Gen C Logo"
            width={32}
            height={32}
            className="transition-all duration-200 filter drop-shadow-sm"
          />
        </div>
        
        <GlobalSearch className="flex-1" />
        
        <div className="flex items-center gap-2">
          <HelpNotificationsButtons />
          <AccountSwitcher users={users} />
        </div>
      </div>
    </header>
  );
} 