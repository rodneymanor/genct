import { HeroSection } from "./_components/hero-section";
import { ScriptSuggestionCards } from "./_components/script-suggestion-cards";
import { ScriptTweetFeed } from "./_components/script-tweet-feed";

export default function Page() {
  return (
    <div className="@container/main">
      {/* Main Content Area - Centered */}
      <div className="mx-auto max-w-6xl">
        <HeroSection />
        
        {/* COMMENTED OUT FOR DOCK TESTING 
        
        Tweet-style Feed
        <div className="mt-12">
          <ScriptTweetFeed />
        </div>
        
        Original Card Grid - Alternative View
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Browse All Ideas</h2>
            <p className="text-muted-foreground">Explore script ideas in card format</p>
          </div>
          <ScriptSuggestionCards />
        </div>
        
        END COMMENTED OUT SECTION */}
      </div>
    </div>
  );
}
