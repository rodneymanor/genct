import { HeroSection } from "./_components/hero-section";
import { ScriptSuggestionCards } from "./_components/script-suggestion-cards";

export default function Page() {
  return (
    <div className="@container/main">
      {/* Main Content Area - Centered */}
      <div className="mx-auto max-w-6xl">
        <HeroSection />
        <ScriptSuggestionCards className="mt-12" />
      </div>
    </div>
  );
}
