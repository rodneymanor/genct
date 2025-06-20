import { ReactNode } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Topbar } from "@/app/(main)/dashboard/_components/topbar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { FloatingEmailTooltip } from "@/components/ui/floating-email-tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarVariant, getSidebarCollapsible, getContentLayout } from "@/lib/layout-preferences";
import { cn } from "@/lib/utils";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const defaultOpen = false;

  const sidebarVariant = await getSidebarVariant();
  const sidebarCollapsible = await getSidebarCollapsible();
  const contentLayout = await getContentLayout();

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-screen">
          <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
          <div className="flex flex-1 flex-col">
            {/* Topbar outside SidebarInset for full-width border */}
            <Topbar />
            <SidebarInset
              className={cn(
                contentLayout === "centered" && "!mx-auto max-w-screen-2xl",
                // Adds right margin for inset sidebar in centered layout up to 113rem.
                // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
                "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
                // Remove default margins since topbar is now outside
                "!m-0"
              )}
            >
              <div className="flex-1">{children}</div>
              <FloatingEmailTooltip />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
