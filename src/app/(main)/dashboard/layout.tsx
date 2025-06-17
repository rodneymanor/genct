import { ReactNode } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { GlobalSearch } from "@/components/ui/global-search";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { getSidebarVariant, getSidebarCollapsible, getContentLayout } from "@/lib/layout-preferences";
import { cn } from "@/lib/utils";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";
import { LayoutControls } from "./_components/sidebar/layout-controls";
import { QuickStatsButton } from "./_components/sidebar/quick-stats-button";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const defaultOpen = false;

  const sidebarVariant = await getSidebarVariant();
  const sidebarCollapsible = await getSidebarCollapsible();
  const contentLayout = await getContentLayout();

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
        <SidebarInset
          className={cn(
            contentLayout === "centered" && "!mx-auto max-w-screen-2xl",
            // Adds right margin for inset sidebar in centered layout up to 113rem.
            // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
            "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
          )}
        >
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border-strong transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4 lg:px-6">
              <GlobalSearch className="flex-1" />
              <div className="flex items-center gap-2">
                <QuickStatsButton />
                <LayoutControls
                  contentLayout={contentLayout}
                  variant={sidebarVariant}
                  collapsible={sidebarCollapsible}
                />
                <ThemeSwitcher />
                <AccountSwitcher users={users} />
              </div>
            </div>
          </header>
          <div className="p-4 md:p-6">{children}</div>
          <FloatingActionButton />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
