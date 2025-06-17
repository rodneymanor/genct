import { HeroSection } from "./_components/hero-section";
import { ScriptSuggestionCards } from "./_components/script-suggestion-cards";
import { SidebarStats } from "./_components/sidebar-stats";

export default function Page() {
  return (
    <div className="@container/main">
      {/* Main Content Area */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Primary Content */}
        <div className="flex-1">
          <HeroSection />
          <ScriptSuggestionCards className="mt-12" />
        </div>

        {/* Secondary Sidebar */}
        <div className="space-y-4 lg:w-80">
          <SidebarStats />

          {/* Recent Activity - Collapsed by default */}
          <div className="hidden lg:block">
            <div className="text-muted-foreground mb-2 text-sm">
              Recent activity and detailed analytics moved to dedicated pages for better focus.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
