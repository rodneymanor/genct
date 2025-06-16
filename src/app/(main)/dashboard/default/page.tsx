import { PerformanceChart } from "./_components/performance-chart";
import { QuickAccessSection } from "./_components/quick-access-section";
import { SocialStatsSection } from "./_components/social-stats-section";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back! 👋</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your content today.
        </p>
      </div>

      <SocialStatsSection />
      <PerformanceChart />
      <QuickAccessSection />
    </div>
  );
}
