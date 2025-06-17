"use client";

import { useRouter } from "next/navigation";

import { ChevronDown, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.push("/auth/v1/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "User";
  const isCollapsed = state === "collapsed";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`ring-offset-background focus-visible:ring-ring hover:bg-muted hover:text-accent-foreground data-[state=open]:bg-muted relative inline-flex h-7 items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:ring-0 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
            isCollapsed ? "w-7 p-0" : "w-fit gap-0.5 px-2 py-1 whitespace-nowrap"
          }`}
        >
          {isCollapsed ? (
            <User className="h-4 w-4" />
          ) : (
            <>
              {displayName}
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
        <DropdownMenuItem>Account Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
