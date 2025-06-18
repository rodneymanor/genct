"use client";

import { Search, Filter, Plus, Settings, Download, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SupabaseButtonsDemo() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-medium mb-2">Authentic Supabase Button Styles</h1>
            <p className="text-muted-foreground">
              These buttons match the exact styling patterns used by Supabase, extracted from their production code.
            </p>
          </div>

          <div className="space-y-8">
            {/* Brand Buttons */}
            <section>
              <h2 className="text-lg font-medium mb-4">Brand Buttons (Green)</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="brand" size="tiny">
                  <span className="truncate">New project</span>
                </Button>
                
                <Button variant="brand" size="tiny">
                  <Plus className="w-3 h-3" />
                  <span className="truncate">Add item</span>
                </Button>

                <Button variant="brand" size="default">
                  <span className="truncate">Create Database</span>
                </Button>

                <Button variant="brand" size="sm">
                  <Download className="w-4 h-4" />
                  <span className="truncate">Export</span>
                </Button>
              </div>
            </section>

            {/* Dashed Border Buttons */}
            <section>
              <h2 className="text-lg font-medium mb-4">Dashed Border Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="dashed" size="icon-tiny">
                  <div className="text-foreground-lighter">
                    <Filter className="w-3.5 h-3.5" />
                  </div>
                </Button>

                <Button variant="dashed" size="tiny">
                  <Settings className="w-3 h-3" />
                  <span className="truncate">Settings</span>
                </Button>

                <Button variant="dashed" size="sm">
                  <Plus className="w-4 h-4" />
                  <span className="truncate">Add Filter</span>
                </Button>

                <Button variant="dashed" size="default">
                  <span className="truncate">Configure</span>
                </Button>
              </div>
            </section>

            {/* Standard Variants for Comparison */}
            <section>
              <h2 className="text-lg font-medium mb-4">Standard Variants (Simplified)</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="tiny">
                  <span className="truncate">Default</span>
                </Button>

                <Button variant="outline" size="tiny">
                  <span className="truncate">Outline</span>
                </Button>

                <Button variant="ghost" size="tiny">
                  <span className="truncate">Ghost</span>
                </Button>

                <Button variant="destructive" size="tiny">
                  <Trash2 className="w-3 h-3" />
                  <span className="truncate">Delete</span>
                </Button>
              </div>
            </section>

            {/* Size Variations */}
            <section>
              <h2 className="text-lg font-medium mb-4">Size Variations</h2>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="brand" size="tiny">
                  <span className="truncate">Tiny</span>
                </Button>

                <Button variant="brand" size="sm">
                  <span className="truncate">Small</span>
                </Button>

                <Button variant="brand" size="default">
                  <span className="truncate">Default</span>
                </Button>

                <Button variant="brand" size="lg">
                  <span className="truncate">Large</span>
                </Button>
              </div>
            </section>

            {/* Transparent Border Demonstrations */}
            <section>
              <h2 className="text-lg font-medium mb-4">Fixed Transparent Borders</h2>
              <p className="text-muted-foreground mb-4">
                These examples demonstrate the fixed opacity support for borders and backgrounds.
              </p>
              <div className="space-y-4">
                {/* Transparent Border Examples */}
                <div className="flex flex-wrap gap-4">
                  <div className="p-4 border-2 border-emerald-500/60 bg-emerald-50/30 rounded-lg">
                    <p className="text-sm font-medium">60% Emerald Border</p>
                    <p className="text-xs text-muted-foreground">30% Background</p>
                  </div>
                  
                  <div className="p-4 border-2 border-blue-500/40 bg-blue-50/20 rounded-lg">
                    <p className="text-sm font-medium">40% Blue Border</p>
                    <p className="text-xs text-muted-foreground">20% Background</p>
                  </div>
                  
                  <div className="p-4 border-2 border-purple-500/50 bg-purple-50/25 rounded-lg">
                    <p className="text-sm font-medium">50% Purple Border</p>
                    <p className="text-xs text-muted-foreground">25% Background</p>
                  </div>
                </div>

                {/* Custom Border Utilities with Opacity */}
                <div className="flex flex-wrap gap-4">
                  <div className="p-4 border-2 border-strong/70 bg-surface-75/50 rounded-lg">
                    <p className="text-sm font-medium">Custom Strong Border (70%)</p>
                    <p className="text-xs text-muted-foreground">Surface Background (50%)</p>
                  </div>
                  
                  <div className="p-4 border-2 border-stronger/80 bg-card/60 rounded-lg">
                    <p className="text-sm font-medium">Custom Stronger Border (80%)</p>
                    <p className="text-xs text-muted-foreground">Card Background (60%)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Transparent Border Demonstration */}
            <section>
              <h2 className="text-lg font-medium mb-4">Transparent Border Fix Demonstration</h2>
              <div className="space-y-6">
                {/* Before/After Comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">❌ Before (Dark borders)</h3>
                    <div className="p-4 border border-gray-600 rounded-lg bg-background/50">
                      <p className="text-sm">Using border-border/60 - Too dark in dark mode</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">✅ After (Proper transparency)</h3>
                    <div className="p-4 border border-foreground/20 rounded-lg bg-background/50">
                      <p className="text-sm">Using border-foreground/20 - Visible and elegant</p>
                    </div>
                  </div>
                </div>

                {/* Opacity Variations */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Opacity Variations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 border border-foreground/10 rounded-md bg-background/30 text-center text-xs">
                      10% opacity
                    </div>
                    <div className="p-3 border border-foreground/20 rounded-md bg-background/30 text-center text-xs">
                      20% opacity
                    </div>
                    <div className="p-3 border border-foreground/30 rounded-md bg-background/30 text-center text-xs">
                      30% opacity
                    </div>
                    <div className="p-3 border border-foreground/50 rounded-md bg-background/30 text-center text-xs">
                      50% opacity
                    </div>
                  </div>
                </div>

                {/* Interactive Examples */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Interactive Examples</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-4 border border-foreground/15 rounded-lg bg-background/50 hover:border-foreground/30 hover:bg-background/80 transition-all text-left">
                      <div className="font-medium">Hover me</div>
                      <div className="text-sm text-muted-foreground">border-foreground/15 → /30</div>
                    </button>
                    
                    <button className="p-4 border border-foreground/20 rounded-lg bg-background/60 hover:border-foreground/40 hover:bg-background/90 transition-all text-left">
                      <div className="font-medium">Hover me</div>
                      <div className="text-sm text-muted-foreground">border-foreground/20 → /40</div>
                    </button>
                    
                    <button className="p-4 border border-foreground/25 rounded-lg bg-background/70 hover:border-foreground/50 hover:bg-background transition-all text-left">
                      <div className="font-medium">Hover me</div>
                      <div className="text-sm text-muted-foreground">border-foreground/25 → /50</div>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Examples */}
            <section>
              <h2 className="text-lg font-medium mb-4">Interactive Examples</h2>
              <div className="space-y-4">
                {/* Supabase-style action bar */}
                <div className="flex flex-col gap-2 md:gap-3 md:flex-row">
                  <Button variant="brand" size="tiny">
                    <span className="truncate">New project</span>
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          placeholder="Search for a project"
                          type="text"
                          className="peer/input block box-border w-full rounded-md shadow-sm transition-all text-foreground focus-visible:shadow-md outline-none focus:ring-current focus:ring-2 focus-visible:border-foreground-muted focus-visible:ring-background-control placeholder-foreground-muted group bg-foreground/[.026] border border-control text-xs px-2.5 py-1 pl-10"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground-light">
                          <Search className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="dashed" size="icon-tiny">
                      <div className="text-foreground-lighter">
                        <Filter className="w-3.5 h-3.5" />
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Button states demonstration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Normal State</h3>
                    <Button variant="brand" size="tiny">Brand Button</Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Hover State</h3>
                    <Button variant="brand" size="tiny">
                      Hover me
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Disabled State</h3>
                    <Button variant="brand" size="tiny" disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples */}
            <section>
              <h2 className="text-lg font-medium mb-4">Usage Examples</h2>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Brand Button</h3>
                  <code className="text-xs text-muted-foreground">
                    {`<Button variant="brand" size="tiny">New project</Button>`}
                  </code>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Dashed Border Button</h3>
                  <code className="text-xs text-muted-foreground">
                    {`<Button variant="dashed" size="icon-tiny"><Filter /></Button>`}
                  </code>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">With Icon</h3>
                  <code className="text-xs text-muted-foreground">
                    {`<Button variant="brand" size="tiny"><Plus />Add item</Button>`}
                  </code>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 