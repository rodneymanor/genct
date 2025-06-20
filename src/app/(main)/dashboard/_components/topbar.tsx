"use client";

import Image from "next/image";

import { Slash } from "lucide-react";

import { GlobalSearch } from "@/components/ui/global-search";
import HelpNotificationsButtons from "@/components/ui/help-notifications-buttons";
import { users } from "@/data/users";

import { AccountSwitcher } from "./sidebar/account-switcher";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 bg-background border-b" style={{ borderWidth: '1px', borderColor: 'rgb(223, 223, 223)' }}>
      <div className="flex w-full items-center gap-2 pl-2">
        {/* Logo with Slash Icon */}
        <div className="flex items-center gap-2">
          <Image
            src="/gc.svg"
            alt="Gen C Logo"
            width={32}
            height={32}
            className="transition-all duration-200 filter drop-shadow-sm"
          />
          <Slash 
            className="w-4 h-4" 
            strokeWidth={1.5}
            style={{ color: 'rgb(223, 223, 223)' }}
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