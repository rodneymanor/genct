# 🎨 Comprehensive Style Documentation System

## 📚 Table of Contents
- [Global Styles](#global-styles)
- [Component Styles](#component-styles)
- [Utility Classes](#utility-classes)
- [Color System](#color-system)
- [Typography](#typography)
- [Layout & Spacing](#layout--spacing)
- [Animation & Transitions](#animation--transitions)
- [Search Tags](#search-tags)
- [Style Conversion Prompt](#style-conversion-prompt)

---

## 🌐 Global Styles

### 🏷️ `[GLOBAL-BASE]` Base HTML Elements
```css
/* 🔍 SEARCH: html, body, base, reset, global */
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
}

body {
  font-family: var(--font-sans);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*, *::before, *::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: hsl(var(--border));
}
```

### 🏷️ `[GLOBAL-INTERACTIVE]` Interactive Elements
```css
/* 🔍 SEARCH: button, link, focus, hover, interactive */
button {
  font-family: inherit;
  font-size: 100%;
  font-weight: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

a {
  color: inherit;
  text-decoration: inherit;
  transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

a:hover {
  color: hsl(var(--primary));
}

:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### 🏷️ `[GLOBAL-SELECTION]` Selection & Scrollbar
```css
/* 🔍 SEARCH: selection, scrollbar, highlight */
::selection {
  background-color: hsl(var(--primary) / 0.2);
  color: hsl(var(--primary-foreground));
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}
```

---

## 🧩 Component Styles

### 🏷️ `[COMPONENT-CARD]` Card System - Supabase Architecture
```tsx
/* 🔍 SEARCH: card, panel, gradient, border, supabase */
// Main Card Component - Supabase Style with Gradient Border
function Card({ className, ...props }) {
  return (
    <div className={cn(
      "group/panel rounded-lg md:rounded-xl p-px bg-gradient-to-b from-border to-border/50 dark:to-border/30 transition-all hover:shadow-md flex items-center justify-center hover:bg-none hover:!bg-border-stronger relative w-full h-full",
      className
    )}>
      <div
        data-slot="card"
        className="z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 flex flex-col gap-6 bg-surface-75 w-full h-full text-card-foreground py-6 shadow-sm"
        {...props}
      />
    </div>
  )
}

// Card Sub-components with Searchable Tags
/* 🔍 SEARCH: card-header, container-query, grid */
function CardHeader({ className, ...props }) {
  return (
    <div className={cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    )} {...props} />
  )
}

/* 🔍 SEARCH: card-title, typography, heading */
function CardTitle({ className, ...props }) {
  return (
    <div className={cn("leading-none font-semibold", className)} {...props} />
  )
}

/* 🔍 SEARCH: card-description, muted-text, subtitle */
function CardDescription({ className, ...props }) {
  return (
    <div className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}

/* 🔍 SEARCH: card-action, grid-positioning, buttons */
function CardAction({ className, ...props }) {
  return (
    <div className={cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className
    )} {...props} />
  )
}

/* 🔍 SEARCH: card-content, padding, main-content */
function CardContent({ className, ...props }) {
  return (
    <div className={cn("px-6", className)} {...props} />
  )
}

/* 🔍 SEARCH: card-footer, actions, bottom-content */
function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />
  )
}
```

#### 🎨 **Card Architecture Breakdown:**
- **🔧 Outer Container**: `group/panel` with gradient border system (`p-px bg-gradient-to-b`)
- **🎯 Inner Content**: `bg-surface-75` with proper rounded corners and overflow handling  
- **📱 Responsive Design**: Different border radius on mobile vs desktop (`rounded-lg md:rounded-xl`)
- **✨ Interactive States**: Hover shadows (`hover:shadow-md`) and background transitions
- **♿ Accessibility**: Proper semantic markup with `data-slot` attributes for component identification
- **🌙 Dark Mode**: Automatic theme adaptation (`dark:to-border/30`)

### 🏷️ `[COMPONENT-CARD-VARIANTS]` Card Usage Patterns
```tsx
/* 🔍 SEARCH: card-variants, stats, metrics, dashboard */
// Stats Card Pattern
<Card className="@container/card">
  <CardHeader>
    <CardDescription>Total Revenue</CardDescription>
    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
    <CardAction>
      <Badge variant="outline">
        <TrendingUp />
        +12.5%
      </Badge>
    </CardAction>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">
      Trending up this month <TrendingUp className="size-4" />
    </div>
    <div className="text-muted-foreground">Visitors for the last 6 months</div>
  </CardFooter>
</Card>

// Interactive Card Pattern - Correct Supabase Style
<Card className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
  {/* Card content with hover effects */}
  {/* Note: Borders handled by gradient system, no need for additional border classes */}
</Card>
```

### 🏷️ `[COMPONENT-SCRIPT-TWEET]` Tweet-Style Script Cards
```tsx
/* 🔍 SEARCH: tweet, social, feed, script-ideas, twitter-style */
// Tweet-style Card for Script Ideas
<ScriptTweetCard
  id="morning-habits"
  category="Trending"
  title="5 Morning Habits That Changed My Life"
  description="Share personal transformation through simple morning routines that boost productivity and mindset."
  estimatedLength="3-5 min"
  difficulty="Easy"
  tags={["lifestyle", "productivity", "wellness"]}
  icon={TrendingUp}
  trending={true}
  engagement="High"
  author={{
    name: "Wellness Creator",
    handle: "@wellnesscreator",
  }}
  timestamp="2h"
/>

// Tweet-style Feed Layout
<ScriptTweetFeed className="max-w-2xl mx-auto" />
```

#### 🎨 **Tweet Card Architecture:**
- **🐦 Twitter-inspired Layout**: Mimics Twitter's card design with avatar, author info, and engagement metrics
- **📱 Social Media Aesthetics**: Familiar interface patterns that users recognize from social platforms
- **⚡ Interactive Elements**: Hover states, action buttons, and engagement counters
- **🏷️ Content Categorization**: Badges and tags for easy content discovery
- **🎯 Call-to-Action**: Prominent "Create Script" button for immediate action

### 🏷️ `[COMPONENT-ALERT]` Alert System
```tsx
/* 🔍 SEARCH: alert, notification, message, status */
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
  }
)
```

---

## 🛠️ Utility Classes

### 🏷️ `[UTILITY-BORDERS]` Border Utilities
```css
/* 🔍 SEARCH: border, outline, stroke, border-gray, border-slate */

/* 
IMPORTANT: Use actual Tailwind color classes for borders, not custom utilities.
Custom border classes like 'border-light' fall back to the dark --border variable.

Recommended border classes:
- border-gray-200    (light gray - good for most UI)
- border-gray-300    (medium gray - more visible)  
- border-slate-200   (cooler light gray)
- border-transparent (invisible until focus)
- border-current     (inherits text color)

Example usage:
<input class="border border-gray-200 focus:border-primary" />
<div class="border border-slate-200 hover:border-gray-300" />
*/

.border-strong {
  border-color: hsl(var(--border-strong));
}

.border-stronger {
  border-color: hsl(var(--border-stronger));
}

.border-card {
  border-color: hsl(var(--foreground-lighter));
}

.border-refined {
  border-color: hsl(var(--foreground-lighter));
}
```

#### 🚨 **Why Custom Border Classes Don't Work**

The root cause of heavy/dark borders was deeper than expected:

1. **Tailwind v4 Behavior**: Custom classes like `border-light` aren't recognized by Tailwind
2. **Fallback Problem**: Unrecognized border classes fall back to the generic `border` utility
3. **CSS Variable Issue**: The `border` utility uses `--border` variable which is dark: `oklch(0.9461 0 0)`
4. **Result**: Even "custom" border classes still rendered with the same dark color

#### 🎨 **Contrast-Aware Border Strategy**

**The luminance contrast problem**: `border-primary/60` shares the same **hue** as `bg-primary`, with only 40% transparency difference. This creates insufficient **luminance contrast** for the human eye to distinguish a 1px border.

**Additional issues:**
- **Hi-DPI screens**: 1px borders become even thinner physical lines
- **Focus ring overlap**: 3px focus ring visually swallows the faint inner border
- **WCAG compliance**: Need 3:1 contrast ratio minimum for non-text graphics

| Background Type | Border Strategy | Reasoning |
|----------------|-----------------|-----------|
| **Colored buttons** (primary, destructive) | `border-transparent hover:border-primary-700 focus-visible:border-ring` | No border at rest, high-contrast border on interaction |
| **Neutral buttons** (outline, secondary) | `border-gray-300 hover:border-gray-500` | Always visible with darker hover state |
| **Ghost buttons** | `border-transparent hover:border-gray-400` | Clean at rest, visible on interaction |
| **Dark mode** | `dark:border-gray-600 dark:hover:border-gray-400` | Proper contrast ratios for dark backgrounds |

#### ✅ **The Correct Solution**

**Use actual Tailwind color classes:**

| Class | Color Value | Visual Weight | Best For |
|-------|-------------|---------------|----------|
| `border-gray-100` | Very light gray | Ultra-light | Minimal dividers |
| `border-gray-200` | Light gray | Light | Light backgrounds only |
| `border-gray-300` | Medium gray | Medium | Most UI elements |
| `border-slate-200` | Cool light gray | Light | Modern aesthetic |
| `border-transparent` | Invisible | None | Focus-only borders |
| `border-primary/60` | Primary color at 60% | Contextual | Colored button borders |

#### 🔄 **Migration Examples**

```html
<!-- ❌ WRONG: Same hue, insufficient luminance contrast -->
<button class="bg-primary border border-primary/60">Invisible border</button>

<!-- ❌ ALSO WRONG: Light border invisible on colored background -->
<button class="bg-primary border border-gray-200">Invisible border</button>

<!-- ✅ CORRECT: Transparent at rest, high-contrast on interaction -->
<button class="bg-primary border border-transparent hover:border-primary-700 focus-visible:border-ring">
  Visible on interaction
</button>

<!-- ✅ NEUTRAL BACKGROUNDS: Always visible borders -->
<input class="border border-gray-300 hover:border-gray-500 focus:border-primary" />

<!-- ✅ ALTERNATIVE: Thicker border for better visibility -->
<button class="bg-primary border-2 border-primary-700">Always visible thick border</button>
```

#### 🔬 **Testing Luminance Contrast**

```html
<!-- Test 1: Same hue issue -->
<button class="bg-blue-500 border border-blue-500/60">Hard to see</button>
<button class="bg-blue-500 border border-blue-800">Much better</button>

<!-- Test 2: Verify with high contrast -->
<button class="bg-primary border border-red-500">If you see red, CSS works</button>
<button class="bg-primary border border-primary-700">Proper contrast</button>

<!-- Test 3: Hi-DPI visibility -->
<button class="bg-primary border border-primary-700">1px border</button>
<button class="bg-primary border-2 border-primary-700">2px border</button>
```

#### 🎯 **Best Practices**

1. **Primary Choice**: `border-gray-200` for most UI elements
2. **Invisible Borders**: `border-transparent focus:border-primary` for clean focus states
3. **Hover Effects**: `border-gray-200 hover:border-gray-300` for subtle interactions
4. **Dark Mode**: Tailwind automatically handles dark mode variants

#### 📏 **WCAG Compliance & Visibility Guidelines**

**Contrast Requirements:**
- **Minimum**: 3:1 contrast ratio for non-text graphics (WCAG AA)
- **Enhanced**: 4.5:1 contrast ratio for better accessibility
- **Hi-DPI consideration**: 1px borders may need higher contrast ratios

**Border Visibility Strategies:**

| Strategy | When to Use | WCAG Compliance |
|----------|-------------|-----------------|
| **Transparent + Interaction** | Primary/destructive buttons | ✅ Focus states meet requirements |
| **Always Visible** | Form inputs, cards | ✅ 3:1+ contrast maintained |
| **Thicker Borders** | Accessibility-first designs | ✅ Enhanced visibility |
| **High Contrast Colors** | -700/-800 color variants | ✅ Exceeds minimum requirements |

**Testing Checklist:**
- [ ] Test on Hi-DPI/Retina displays
- [ ] Verify 3:1 contrast ratio with color contrast tools
- [ ] Check focus states are clearly visible
- [ ] Test in both light and dark modes

### ��️ `[UTILITY-ICONS]` Icon Utilities
```css
/* 🔍 SEARCH: icon, svg, stroke, lucide */
/* Override default lucide-react stroke-width to be lighter */
.lucide {
  stroke-width: 1;
}
```

#### 🎨 **Icon Styling:**
- **Default Weight**: `lucide-react` icons default to a heavy `stroke-width` of `2`.
- **Global Override**: We apply a global style to the `.lucide` class to set a lighter `stroke-width: 1;` for a more refined, Supabase-like aesthetic.
- **Consistency**: This ensures all icons used in the application maintain a consistent and light appearance without needing manual props.

### 🏷️ `[UTILITY-SURFACES]` Surface & Background Utilities
```css
/* 🔍 SEARCH: background, surface, fill */
.bg-surface-75 {
  background-color: hsl(var(--surface-75));
}

.card-gradient-border {
  background: linear-gradient(to bottom, hsl(var(--border)), hsl(var(--border) / 0.5));
}

.dark .card-gradient-border {
  background: linear-gradient(to bottom, hsl(var(--border)), hsl(var(--surface-75)));
}

.card-hover-border {
  background-color: hsl(var(--border-stronger));
}
```

### 🏷️ `[UTILITY-PANEL]` Panel System
```css
/* 🔍 SEARCH: panel, container, wrapper */
.panel-gradient {
  @apply rounded-lg md:rounded-xl p-px bg-gradient-to-b from-border to-border/50 dark:to-border/30 transition-all hover:shadow-md flex items-center justify-center hover:bg-none hover:!bg-border-stronger relative w-full h-full;
}

.panel-inner {
  @apply z-10 rounded-[7px] md:rounded-[11px] relative overflow-hidden flex-1 bg-surface-75 w-full h-full;
}
```

---

## 🎨 Color System

### 🏷️ `[COLOR-VARIABLES]` CSS Custom Properties
```css
/* 🔍 SEARCH: colors, variables, theme, palette */
:root {
  /* Primary Colors */
  --primary: oklch(0.8348 0.1302 160.9080);
  --primary-foreground: oklch(0.2626 0.0147 166.4589);
  
  /* Surface Colors */
  --background: oklch(0.9911 0 0);
  --foreground: oklch(0.2046 0 0);
  --card: oklch(0.9911 0 0);
  --card-foreground: oklch(0.2046 0 0);
  
  /* Border Colors */
  --border: oklch(0.9461 0 0);
  --border-strong: oklch(0.9200 0 0);
  --border-stronger: oklch(0.8800 0 0);
  --foreground-lighter: oklch(0.9700 0 0);
  --surface-75: oklch(0.9850 0 0);
  
  /* Semantic Colors */
  --destructive: oklch(0.5523 0.1927 32.7272);
  --muted: oklch(0.9461 0 0);
  --muted-foreground: oklch(0.2435 0 0);
  --accent: oklch(0.9461 0 0);
  --accent-foreground: oklch(0.2435 0 0);
}

.dark {
  /* Dark theme overrides */
  --background: oklch(0.1822 0 0);
  --foreground: oklch(0.9288 0.0126 255.5078);
  --card: oklch(0.2046 0 0);
  --border: oklch(0.2393 0 0);
  --border-strong: oklch(0.3200 0 0);
  --border-stronger: oklch(0.3600 0 0);
}
```

### 🏷️ `[COLOR-USAGE]` Color Application Patterns
```tsx
/* 🔍 SEARCH: color-usage, theming, semantic */
// Background Applications
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-muted text-muted-foreground"

// Border Applications
className="border border-border"
className="border-strong"
className="border-stronger"

// State Colors
className="text-destructive"
className="bg-primary text-primary-foreground"
className="hover:bg-accent hover:text-accent-foreground"
```

---

## ✍️ Typography

### 🏷️ `[TYPOGRAPHY-SYSTEM]` Font Configuration
```css
/* 🔍 SEARCH: fonts, typography, text, family, custom-font, supabase */
/* Local Custom Fonts - Supabase Style */
@font-face {
  font-family: custom-font;
  src: url('/CustomFont-Book.54303b32.woff2') format("woff2"),
       url('/CustomFont-Book.d2378969.woff') format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: custom-font;
  src: url('/CustomFont-Medium.0cc7d245.woff2') format("woff2"),
       url('/CustomFont-Medium.184a256f.woff') format("woff");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-sans: custom-font, "Circular", "Space Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: monospace;
  --tracking-normal: 0.025em;
}

/* Fallback Font Import */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### 🏷️ `[TYPOGRAPHY-CLASSES]` Text Size & Weight Patterns
```tsx
/* 🔍 SEARCH: text-size, headings, body, weight */
// Heading Patterns
className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
className="text-lg leading-tight"
className="leading-none font-semibold"

// Body Text Patterns
className="text-sm leading-relaxed"
className="text-muted-foreground text-sm"
className="text-xs font-medium"

// Interactive Text
className="group-hover:text-primary transition-colors"
className="line-clamp-1 flex gap-2 font-medium"
```

---

## 📐 Layout & Spacing

### 🏷️ `[LAYOUT-GRID]` Grid Systems
```tsx
/* 🔍 SEARCH: grid, layout, responsive, columns */
// Card Grid Patterns
className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"

// Container Queries
className="@container/card"
className="@container/main"
className="@[250px]/card:text-3xl"
```

### 🏷️ `[LAYOUT-FLEX]` Flexbox Patterns
```tsx
/* 🔍 SEARCH: flex, alignment, distribution */
// Common Flex Patterns
className="flex items-center gap-3"
className="flex items-start justify-between"
className="flex-col items-start gap-1.5"
className="flex w-full items-center justify-between"

// Flex Utilities
className="flex-1"
className="ml-auto"
className="self-start justify-self-end"
```

### 🏷️ `[LAYOUT-SPACING]` Spacing System
```tsx
/* 🔍 SEARCH: padding, margin, gap, spacing */
// Padding Patterns
className="px-4 py-3"
className="px-6 py-6"
className="p-2 p-4"

// Gap Patterns
className="gap-1 gap-2 gap-3 gap-6"
className="space-y-4 space-y-6"

// Margin Patterns
className="mb-2 mb-4 mb-8"
className="mt-12"
```

---

## 🎬 Animation & Transitions

### 🏷️ `[ANIMATION-TRANSITIONS]` Transition Patterns
```tsx
/* 🔍 SEARCH: transition, animation, hover, transform */
// Basic Transitions
className="transition-all duration-200"
className="transition-colors"
className="transition-shadow"

// Hover Effects
className="hover:shadow-md"
className="hover:shadow-lg"
className="hover:scale-[1.02]"
className="hover:border-primary/20"

// Group Hover
className="group-hover:bg-primary/20"
className="group-hover:text-primary"
```

### 🏷️ `[ANIMATION-STATES]` Interactive States
```tsx
/* 🔍 SEARCH: states, active, focus, disabled */
// Focus States
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// Disabled States
className="disabled:pointer-events-none disabled:opacity-50"

// Active States
className="data-[state=open]:animate-in data-[state=closed]:animate-out"
```

---

## 🔍 Search Tags

### Quick Search Reference
```
🏷️ Global: html, body, base, reset, global, interactive, selection, scrollbar
🏷️ Components: card, panel, alert, notification, button, input, form
🏷️ Layout: grid, flex, container, responsive, spacing, padding, margin
🏷️ Colors: theme, palette, variables, semantic, primary, background
🏷️ Typography: fonts, text, headings, body, weight, size
🏷️ Utilities: border, surface, background, helper, modifier
🏷️ Animation: transition, hover, focus, states, transform
🏷️ Patterns: dashboard, stats, metrics, interactive, navigation
```

---

## 🔄 Style Conversion Prompt

### Universal Website Style Converter

Use this prompt to convert any website's styles to this searchable format:

```
# Website Style Conversion Prompt

Convert the provided website styles into a comprehensive, searchable documentation format. Follow this structure:

## Instructions:
1. **Analyze** the provided styles/components
2. **Categorize** into logical sections (Global, Components, Utilities, etc.)
3. **Add search tags** using the 🏷️ `[CATEGORY-NAME]` format
4. **Include search keywords** in comments using /* 🔍 SEARCH: keyword1, keyword2 */
5. **Document patterns** showing both CSS and usage examples
6. **Create variants** for different use cases
7. **Add responsive** and state variations

## Template Structure:
```markdown
### 🏷️ `[SECTION-COMPONENT]` Component Name
```css/tsx
/* 🔍 SEARCH: relevant, keywords, here */
// CSS or component code here
```

### Usage Patterns:
```tsx
// Example implementations
```

### Variants:
- Default state
- Hover/focus states  
- Responsive variations
- Dark mode adaptations
```