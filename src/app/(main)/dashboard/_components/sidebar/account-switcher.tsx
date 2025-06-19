"use client";

import { useRouter } from "next/navigation";

import { Bell, CreditCard, LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

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
        <span className="truncate">
          <figure className="bg-foreground flex items-center justify-center w-8 h-8 rounded-md cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-background">
              <path d="M7.06473 19.6328C4.61648 18.0244 3 15.2537 3 12.1055C3 7.13491 7.02944 3.10547 12 3.10547C16.9706 3.10547 21 7.13491 21 12.1055C21 15.2537 19.4273 18.0094 16.979 19.6178M16.9799 22.2844V19.7136C16.9799 17.0258 14.8011 14.8469 12.1133 14.8469C9.42547 14.8469 7.24658 17.0258 7.24658 19.7136V22.2844M15 11.8469C15 13.5038 13.6569 14.8469 12 14.8469C10.3431 14.8469 9 13.5038 9 11.8469C9 10.1901 10.3431 8.84692 12 8.84692C13.6569 8.84692 15 10.1901 15 11.8469Z"></path>
            </svg>
          </figure>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem className="bg-accent/50 border-l-primary border-l-2 p-0">
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <figure className="bg-foreground flex items-center justify-center w-8 h-8 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-background">
                <path d="M7.06473 19.6328C4.61648 18.0244 3 15.2537 3 12.1055C3 7.13491 7.02944 3.10547 12 3.10547C16.9706 3.10547 21 7.13491 21 12.1055C21 15.2537 19.4273 18.0094 16.979 19.6178M16.9799 22.2844V19.7136C16.9799 17.0258 14.8011 14.8469 12.1133 14.8469C9.42547 14.8469 7.24658 17.0258 7.24658 19.7136V22.2844M15 11.8469C15 13.5038 13.6569 14.8469 12 14.8469C10.3431 14.8469 9 13.5038 9 11.8469C9 10.1901 10.3431 8.84692 12 8.84692C13.6569 8.84692 15 10.1901 15 11.8469Z"></path>
              </svg>
            </figure>
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
