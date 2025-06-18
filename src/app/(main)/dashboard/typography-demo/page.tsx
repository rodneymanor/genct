"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TypographyDemo() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24 py-6">
          <div className="mb-8">
            <h1 className="supabase-heading text-4xl mb-2">Supabase Typography System</h1>
            <p className="supabase-body text-lg">
              Complete typography implementation with custom fonts, scales, and authentic Supabase styling.
            </p>
          </div>

          <div className="space-y-12">
            {/* Font Families */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Font Families</h2>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Font (Primary)</CardTitle>
                    <CardDescription>Supabase&apos;s custom font for body text and UI elements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="font-custom text-lg">The quick brown fox jumps over the lazy dog</p>
                      <p className="font-custom text-sm text-foreground-muted">
                                                 Custom font provides excellent readability and matches Supabase&apos;s brand identity
                      </p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">font-family: var(--font-custom)</code>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Space Grotesk (Headings)</CardTitle>
                    <CardDescription>Modern geometric font for headings and emphasis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h3 className="font-heading text-xl">Space Grotesk Heading Example</h3>
                      <p className="font-heading text-sm text-foreground-muted tracking-wide">
                        Perfect for headings, labels, and important UI elements
                      </p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">font-family: var(--font-heading)</code>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inter (Fallback)</CardTitle>
                    <CardDescription>High-quality fallback for maximum compatibility</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="font-sans text-lg">Inter provides excellent fallback support</p>
                      <p className="font-sans text-sm text-foreground-muted">
                        Ensures consistent appearance across all devices and browsers
                      </p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">font-family: var(--font-sans)</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Typography Scale */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Typography Scale</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="text-5xl font-heading">Heading 5XL (48px)</div>
                    <div className="text-4xl font-heading">Heading 4XL (36px)</div>
                    <div className="text-3xl font-heading">Heading 3XL (30px)</div>
                    <div className="text-2xl font-heading">Heading 2XL (24px)</div>
                    <div className="text-xl font-heading">Heading XL (20px)</div>
                    <div className="text-lg font-custom">Large Text (18px)</div>
                    <div className="text-base font-custom">Base Text (16px)</div>
                    <div className="text-sm font-custom">Small Text (14px)</div>
                    <div className="text-xs font-custom">Extra Small (12px)</div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Semantic Headings */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Semantic Headings</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h1>H1: Main Page Title</h1>
                    <h2>H2: Section Heading</h2>
                    <h3>H3: Subsection Heading</h3>
                    <h4>H4: Component Title</h4>
                    <h5>H5: Small Heading</h5>
                    <h6>H6: Caption Heading</h6>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Text Colors */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Text Color Hierarchy</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Light Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-foreground">Primary foreground text</p>
                      <p className="text-foreground-light">Light foreground text</p>
                      <p className="text-foreground-muted">Muted foreground text</p>
                      <p className="text-muted-foreground">Secondary muted text</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usage Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-foreground font-medium">Main content and headings</p>
                      <p className="text-foreground-light">Body text and descriptions</p>
                      <p className="text-foreground-muted">Captions and metadata</p>
                      <p className="text-muted-foreground">Disabled or inactive text</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Line Heights */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Line Heights</h2>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reading Optimized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tight (1.25) - Headings</h4>
                        <p className="leading-tight text-xl font-heading">
                          Perfect for headings and display text where space efficiency matters most.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Normal (1.5) - UI Elements</h4>
                        <p className="leading-normal">
                          Ideal for buttons, labels, and short interface text that needs to be scannable.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Relaxed (1.625) - Body Text</h4>
                        <p className="leading-relaxed">
                          Optimized for reading longer content. This line height provides excellent readability 
                          for paragraphs, articles, and any text that users will read for extended periods. 
                          The generous spacing reduces eye strain and improves comprehension.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Letter Spacing */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Letter Spacing</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tighter (-0.05em)</h4>
                      <p className="tracking-tighter text-xl font-heading">Large Headings with Tighter Spacing</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tight (-0.025em)</h4>
                      <p className="tracking-tight text-lg font-heading">Headings with Tight Letter Spacing</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Normal (0em)</h4>
                      <p className="tracking-normal">Standard body text with normal letter spacing</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Wide (0.025em)</h4>
                      <p className="tracking-wide text-sm">SMALL CAPS AND LABELS WITH WIDE SPACING</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Supabase Classes */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Supabase Typography Classes</h2>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Utility Classes</CardTitle>
                    <CardDescription>Pre-built classes for common Supabase patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="supabase-heading text-xl mb-2">Supabase Heading</h4>
                                                 <code className="text-xs bg-muted px-2 py-1 rounded">class=&quot;supabase-heading&quot;</code>
                      </div>
                      <div>
                        <p className="supabase-body mb-2">
                          Supabase body text with optimized readability and proper line height for extended reading.
                        </p>
                                                 <code className="text-xs bg-muted px-2 py-1 rounded">class=&quot;supabase-body&quot;</code>
                      </div>
                      <div>
                        <p className="supabase-caption mb-2">Supabase caption text for metadata and secondary information</p>
                                                 <code className="text-xs bg-muted px-2 py-1 rounded">class=&quot;supabase-caption&quot;</code>
                      </div>
                      <div>
                        <span className="supabase-code">const example = &quot;supabase-code&quot;;</span>
                        <br />
                        <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">class=&quot;supabase-code&quot;</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Performance */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Font Loading Performance</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Optimizations</CardTitle>
                  <CardDescription>Font loading strategies for optimal performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">✅ Implemented</h4>
                        <ul className="text-sm space-y-1 text-foreground-light">
                          <li>• font-display: swap for FOUT prevention</li>
                          <li>• Optimized font stack with fallbacks</li>
                          <li>• WOFF2 format for modern browsers</li>
                          <li>• Progressive enhancement approach</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🎯 Benefits</h4>
                        <ul className="text-sm space-y-1 text-foreground-light">
                          <li>• No flash of invisible text (FOIT)</li>
                          <li>• Graceful fallback to system fonts</li>
                          <li>• Reduced cumulative layout shift</li>
                          <li>• Improved Core Web Vitals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Interactive Example */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Interactive Example</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="supabase-heading">Real-world Application</CardTitle>
                  <CardDescription className="supabase-caption">
                    How the typography system works in practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Button variant="brand" size="tiny">
                        Primary Action
                      </Button>
                      <Button variant="dashed" size="tiny">
                        Secondary Action
                      </Button>
                    </div>
                    <div className="supabase-body">
                      This example demonstrates how the typography system integrates seamlessly with 
                      our button components and overall design system. Notice how the text maintains 
                      excellent readability while the buttons use consistent font weights and sizing.
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground-muted">
                      <span>Typography System</span>
                      <span>•</span>
                      <span>Phase 3 Complete</span>
                      <span>•</span>
                      <span>Supabase Authentic</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 