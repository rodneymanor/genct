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
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={displayUser.avatar || undefined} alt={displayUser.name} />
          <AvatarFallback className="rounded-lg">{getInitials(displayUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem className="bg-accent/50 border-l-primary border-l-2 p-0">
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={displayUser.avatar || undefined} alt={displayUser.name} />
              <AvatarFallback className="rounded-lg">{getInitials(displayUser.name)}</AvatarFallback>
            </Avatar>
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
