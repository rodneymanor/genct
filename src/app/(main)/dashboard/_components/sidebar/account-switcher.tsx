"use client";

import { useRouter } from "next/navigation";

import { Bell, CreditCard, LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { getInitials } from "@/lib/utils";

export function AccountSwitcher({
  users,
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.push("/auth/v1/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Use Firebase user data if available, otherwise fallback to mock data
  const displayUser = user
    ? {
        id: user.uid,
        name: user.displayName ?? user.email?.split("@")[0] ?? "User",
        email: user.email ?? "",
        avatar: user.photoURL ?? "",
        role: "user",
      }
    : users[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
          <User className="w-4 h-4 text-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="bg-accent/50 border-l-primary border-l-2 p-0">
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{displayUser.name}</span>
              <span className="text-muted-foreground truncate text-xs">{displayUser.email}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
