# Scriptwriting Core Export

This export contains the complete scriptwriting functionality from your app, stripped of all UI dependencies. It provides a clean, reusable API for generating video scripts through AI.

## Features

- **Script Idea Processing**: Take a video idea and generate multiple script components
- **Resource Integration**: Extract content from web sources to inform script generation
- **Component-Based Architecture**: Generate Hooks, Bridges, Golden Nuggets, and WTAs separately
- **Voice Profile Support**: Customize scripts based on specific voice profiles and styles
- **Final Script Assembly**: Combine selected components into a cohesive final script
- **Script Analysis**: Analyze scripts for readability, duration, and engagement metrics
- **Multiple Input Methods**: Generate from ideas, transcripts, or existing content
- **Cost Tracking**: Monitor API usage and costs

## Core Components

### 1. ScriptwritingEngine
The main engine for generating script components and final scripts.

```typescript
const engine = new ScriptwritingEngine(geminiApiKey);

// Generate script components from an idea and sources
const components = await engine.generateScriptComponents(videoIdea, sources);

// Generate final script from selected components
const finalScript = await engine.generateFinalScript(videoIdea, selectedComponents, voiceProfile);
```

### 2. ScriptwritingWorkflow
High-level workflows that combine multiple steps.

```typescript
const workflow = new ScriptwritingWorkflow(geminiApiKey);

// Complete workflow: idea → sources → components → final script
const result = await workflow.createScriptFromIdea(videoIdea, sources, voiceProfile);

// Generate script from transcript
const result = await workflow.createScriptFromTranscript(transcript, videoIdea, voiceProfile);
```

### 3. ScriptUtils
Utility functions for script processing and analysis.

```typescript
// Validate components before final script generation
const isValid = ScriptUtils.validateScriptComponents(selectedComponents);

// Create script outline
const outline = ScriptUtils.createScriptOutline(selectedComponents);

// Analyze script metrics
const analysis = ScriptUtils.analyzeScript(scriptText);

// Export script in different formats
const exported = ScriptUtils.exportScript(scriptText, 'json');
```

## Data Structures

### Script Components
```typescript
interface ScriptComponents {
  hooks: ScriptHook[];           // Attention-grabbing openers
  bridges: ScriptBridge[];       // Smooth transitions
  goldenNuggets: ScriptGoldenNugget[]; // Core value content
  wtas: ScriptWTA[];            // Call-to-action endings
}
```

### Sources
```typescript
interface Source {
  title: string;
  link: string;
  snippet: string;
  extractedText?: string;       // Full extracted content
  isTextExtracted?: boolean;
  textExtractionError?: string;
}
```

### Voice Profile
```typescript
interface VoiceProfile {
  name: string;
  voiceProfile: {
    coreIdentity: {
      suggestedPersonaName?: string;
      dominantTones?: string[];
      secondaryTones?: string[];
      uniqueIdentifiersOrQuirks?: string[];
      toneExemplars?: string[];
    };
    actionableSystemPromptComponents?: {
      voiceDnaSummaryDirectives?: string[];
      consolidatedNegativeConstraints?: {
        wordsToAvoid?: string[];
        tonesToAvoid?: string[];
      };
    };
  };
}
```

## Quick Start

### 1. Basic Setup
```typescript
import { ScriptwritingWorkflow } from './scriptwriting-core-export';

const apiKey = 'your-gemini-api-key';
const workflow = new ScriptwritingWorkflow(apiKey);
```

### 2. Generate Script from Idea
```typescript
const videoIdea = "5 productivity tips that actually work";
const sources = [
  {
    title: "Productivity Research",
    link: "https://example.com/productivity-tips",
    snippet: "Studies show that the most effective productivity techniques..."
  }
];

const result = await workflow.createScriptFromIdea(videoIdea, sources);
console.log(result.finalScript);
```

### 3. Generate Script from Transcript
```typescript
const transcript = "I've been testing different productivity methods for the past year...";
const result = await workflow.createScriptFromTranscript(transcript);
console.log(result.finalScript);
```

### 4. Custom Component Selection
```typescript
import { ScriptwritingEngine, ScriptUtils } from './scriptwriting-core-export';

const engine = new ScriptwritingEngine(apiKey);
const components = await engine.generateScriptComponents(videoIdea, sources);

// Custom selection logic
const selectedComponents = {
  hook: components.hooks.find(h => h.lines[0].includes('?')) || components.hooks[0],
  bridge: components.bridges[1],
  goldenNugget: components.goldenNuggets[0],
  wta: components.wtas.find(w => w.actionType === 'engagement') || components.wtas[0]
};

const finalScript = await engine.generateFinalScript(videoIdea, selectedComponents);
```

## API Reference

### ScriptwritingEngine Methods

#### `generateVideoIdeas(transcript: string): Promise<any[]>`
Generate video ideas from a transcript.

#### `extractContentFromSources(sources: Source[]): Promise<Source[]>`
Extract full content from source URLs.

#### `generateScriptComponents(videoIdea: string, sources: Source[]): Promise<ScriptComponents>`
Generate script components (hooks, bridges, golden nuggets, WTAs) from idea and sources.

#### `generateFinalScript(videoIdea: string, selectedComponents: UserSelectedScriptComponents, voiceProfile?: VoiceProfile): Promise<string>`
Generate final script from selected components.

#### `generateOutlineFromScript(existingHook: string, transcript: string, videoIdea: string): Promise<ScriptComponents>`
Generate script outline from existing script content.

#### `calculateCost(inputTokens: number, outputTokens: number): object`
Calculate API usage costs.

### ScriptwritingWorkflow Methods

#### `createScriptFromIdea(videoIdea: string, sources?: Source[], voiceProfile?: VoiceProfile): Promise<object>`
Complete workflow from idea to final script.

#### `createScriptFromTranscript(transcript: string, videoIdea?: string, voiceProfile?: VoiceProfile): Promise<object>`
Complete workflow from transcript to final script.

### ScriptUtils Static Methods

#### `validateScriptComponents(components: UserSelectedScriptComponents): boolean`
Validate that all required components are selected.

#### `createScriptOutline(components: UserSelectedScriptComponents): string`
Create formatted script outline.

#### `analyzeScript(scriptText: string): object`
Analyze script for metrics like word count, duration, readability.

#### `exportScript(scriptText: string, format: 'plain' | 'markdown' | 'json'): string`
Export script in different formats.

## Migration Notes

### What's Included
- ✅ Core script generation logic
- ✅ AI prompt engineering and optimization
- ✅ Component-based script architecture
- ✅ Voice profile integration
- ✅ Source content extraction
- ✅ Script analysis and metrics
- ✅ Cost calculation and monitoring
- ✅ Error handling and fallbacks

### What's NOT Included
- ❌ UI components and React contexts
- ❌ Database operations (Firestore)
- ❌ Authentication and user management
- ❌ File upload/storage functionality
- ❌ Real-time collaboration features
- ❌ Caching mechanisms (can be added separately)

### Dependencies Required
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.x.x"
  }
}
```

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Integration Examples

### Express.js API
```typescript
import express from 'express';
import { ScriptwritingWorkflow } from './scriptwriting-core-export';

const app = express();
const workflow = new ScriptwritingWorkflow(process.env.GEMINI_API_KEY);

app.post('/api/generate-script', async (req, res) => {
  try {
    const { videoIdea, sources, voiceProfile } = req.body;
    const result = await workflow.createScriptFromIdea(videoIdea, sources, voiceProfile);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Next.js API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ScriptwritingEngine } from './scriptwriting-core-export';

export async function POST(req: NextRequest) {
  const engine = new ScriptwritingEngine(process.env.GEMINI_API_KEY!);
  const { videoIdea, sources } = await req.json();
  
  try {
    const components = await engine.generateScriptComponents(videoIdea, sources);
    return NextResponse.json({ components });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### CLI Tool
```typescript
#!/usr/bin/env node
import { ScriptwritingWorkflow } from './scriptwriting-core-export';

async function main() {
  const workflow = new ScriptwritingWorkflow(process.env.GEMINI_API_KEY);
  const videoIdea = process.argv[2];
  
  if (!videoIdea) {
    console.error('Usage: script-generator "your video idea"');
    process.exit(1);
  }
  
  try {
    const result = await workflow.createScriptFromIdea(videoIdea);
    console.log('\n=== GENERATED SCRIPT ===\n');
    console.log(result.finalScript);
    console.log('\n=== ANALYSIS ===\n');
    console.log(result.analysis);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## Error Handling

The exported functions include comprehensive error handling:

```typescript
try {
  const result = await workflow.createScriptFromIdea(videoIdea, sources);
  // Success
} catch (error) {
  // Handle specific error types
  if (error.message.includes('API key')) {
    // Handle authentication error
  } else if (error.message.includes('rate limit')) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

## Cost Management

Monitor and control API costs:

```typescript
const engine = new ScriptwritingEngine(apiKey);

// Estimate cost before generation
const inputTokens = 1000;
const outputTokens = 500;
const costEstimate = engine.calculateCost(inputTokens, outputTokens);

if (costEstimate.totalCost > 0.10) { // More than 10 cents
  console.log('Cost too high, skipping generation');
  return;
}

// Proceed with generation
const components = await engine.generateScriptComponents(videoIdea, sources);
```

## Performance Tips

1. **Batch Processing**: Process multiple scripts with delays between requests
2. **Caching**: Implement your own caching layer for repeated requests
3. **Source Optimization**: Pre-extract and cache source content
4. **Component Reuse**: Save and reuse successful script components
5. **Voice Profile Optimization**: Create optimized voice profiles for better results

## Support

This export contains all the core scriptwriting functionality from your original app. The code is self-contained and can be integrated into any Node.js application or framework.

For questions about implementation or customization, refer to the usage examples in `scriptwriting-usage-examples.ts`. 