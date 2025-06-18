export default function Page() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-normal">Font Test - Regular (400)</h1>
        <h2 className="text-3xl font-medium">Font Test - Medium (500)</h2>
        <p className="text-lg font-normal">
          This is a test paragraph to verify that the custom fonts are loading correctly. 
          The font should be &ldquo;custom-font&rdquo; with fallbacks to Circular, Space Grotesk, 
          Helvetica Neue, Helvetica, Arial, and sans-serif.
        </p>
        <p className="text-base font-medium">
          This paragraph uses font-medium (500 weight) to test the medium variant of the custom font.
        </p>
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">Font Stack Debug</h3>
          <p className="text-sm text-muted-foreground font-mono">
            Font family: var(--font-sans) → &ldquo;custom-font&rdquo;, &ldquo;Circular&rdquo;, &ldquo;Space Grotesk&rdquo;, &ldquo;Helvetica Neue&rdquo;, Helvetica, Arial, sans-serif
          </p>
        </div>
      </div>
    </div>
  );
}
