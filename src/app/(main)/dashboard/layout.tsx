import { ReactNode } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Topbar } from "@/app/(main)/dashboard/_components/topbar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarVariant, getSidebarCollapsible, getContentLayout } from "@/lib/layout-preferences";
import { cn } from "@/lib/utils";

// Placeholder Quick Action Button Component
function QuickActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="h-12 w-12 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-medium">QA</span>
      </div>
    </div>
  );
}

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const defaultOpen = false;

  const sidebarVariant = "sidebar"; // Force sidebar variant instead of inset
  const sidebarCollapsible = await getSidebarCollapsible();
  const contentLayout = await getContentLayout();

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        {/* Topbar spans full width above everything */}
        <Topbar />
        
        {/* Sidebar and content area below the topbar */}
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex flex-1">
            <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
            <SidebarInset
              className={cn(
                contentLayout === "centered" && "!mx-auto max-w-screen-2xl",
                // Adds right margin for inset sidebar in centered layout up to 113rem.
                // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
                "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
                "flex-1"
              )}
            >
              <div className="flex-1">{children}</div>
              <QuickActionButton />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
