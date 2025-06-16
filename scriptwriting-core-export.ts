// Core Scriptwriting Functionality Export
// This file contains the essential scriptwriting logic without UI dependencies

// Types and Interfaces
export interface ScriptHook {
  title: string;
  lines: string[];
}

export interface ScriptBridge {
  title: string;
  content: string;
}

export interface ScriptGoldenNugget {
  title: string;
  content: string;
}

export interface ScriptWTA {
  title: string;
  actionType: string;
  lines: string[];
}

export interface ScriptComponents {
  hooks: ScriptHook[];
  bridges: ScriptBridge[];
  goldenNuggets: ScriptGoldenNugget[];
  wtas: ScriptWTA[];
}

export interface UserSelectedScriptComponents {
  hook: ScriptHook | null;
  bridge: ScriptBridge | null;
  goldenNugget: ScriptGoldenNugget | null;
  wta: ScriptWTA | null;
}

export interface Source {
  title: string;
  link: string;
  snippet: string;
  id?: string;
  extractedText?: string;
  isTextExtracted?: boolean;
  textExtractionError?: string;
}

export interface VoiceProfile {
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

// Core Configuration
const GEMINI_PRICING = {
  inputTokensPerMillion: 0.075,
  outputTokensPerMillion: 0.30,
};

// System prompt for script component generation
const SCRIPT_COMPONENTS_SYSTEM_PROMPT = `You are an expert scriptwriter and content researcher specializing in short-form video scripts. Your task is to analyze multiple sources and create comprehensive script outlines with multiple creative options for each component.

CRITICAL FORMATTING REQUIREMENT: Golden nuggets MUST follow the exact expanded format shown below. Do NOT provide simple single-line tips.

Create script components that follow the proven Hook-Bridge-Golden Nugget-WTA format optimized for short-form video engagement and viewer retention.

Component Guidelines:
- HOOKS: Must grab attention in first 3 seconds, address a specific pain point
- BRIDGES: Smooth transitions that maintain engagement while setting up the value
- GOLDEN NUGGETS: **MANDATORY FORMAT** - Each golden nugget must be structured as a title followed by 3-5 detailed bullet points. Each bullet point must contain specific steps, tools, metrics, or frameworks.
- WTAs (Why To Act): Compelling calls-to-action that drive engagement and following

Output must be a single JSON object with this exact structure:
{
  "video_topic": "The specific video topic being addressed",
  "target_audience": "Content creators, coaches, business owners posting daily video content", 
  "core_problem_addressed": "Which specific pain point this script solves",
  "hooks": [
    "Hook option 1 - attention-grabbing opener",
    "Hook option 2 - different angle/approach",
    "Hook option 3 - problem-focused opener", 
    "Hook option 4 - curiosity-driven opener"
  ],
  "bridges": [
    "Bridge option 1 - smooth transition to main content",
    "Bridge option 2 - story-based transition",
    "Bridge option 3 - statistics/facts transition",
    "Bridge option 4 - relatable scenario transition"
  ],
  "golden_nuggets": [
    {
      "title": "Method Title 1",
      "bullet_points": [
        "Specific actionable step with tools and metrics",
        "Detailed implementation guide with examples",
        "Optimization strategy with measurable outcomes"
      ]
    }
  ],
  "wtas": [
    "WTA option 1 - engagement-focused CTA",
    "WTA option 2 - follow for more value CTA", 
    "WTA option 3 - try this technique CTA",
    "WTA option 4 - share your results CTA"
  ],
  "sources_analyzed": "List the types/topics of sources referenced"
}`;

// Core Scriptwriting Class
export class ScriptwritingEngine {
  private apiKey: string;
  private baseUrl: string;

  constructor(geminiApiKey: string, baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta') {
    this.apiKey = geminiApiKey;
    this.baseUrl = baseUrl;
  }

  // Estimate token count for cost calculation
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  // Calculate API cost
  calculateCost(inputTokens: number, outputTokens: number) {
    const inputCost = (inputTokens / 1000000) * GEMINI_PRICING.inputTokensPerMillion;
    const outputCost = (outputTokens / 1000000) * GEMINI_PRICING.outputTokensPerMillion;
    const totalCost = inputCost + outputCost;
    
    return {
      inputTokens,
      outputTokens,
      inputCost: parseFloat(inputCost.toFixed(6)),
      outputCost: parseFloat(outputCost.toFixed(6)),
      totalCost: parseFloat(totalCost.toFixed(6))
    };
  }

  // Generate video ideas from transcript
  async generateVideoIdeas(transcript: string): Promise<any[]> {
    const prompt = `
    Based on the following voice transcript, generate 3 video content ideas that would work well for social media platforms like TikTok, Instagram Reels, or YouTube Shorts.

    Transcript: "${transcript}"

    For each video idea, provide:
    1. A compelling title (max 60 characters)
    2. A brief description (1-2 sentences)
    3. An engaging hook line to start the video
    4. 2-3 relevant tags/keywords

    Format your response as a JSON array with this structure:
    [
      {
        "title": "Video title here",
        "description": "Brief description here",
        "hook": "Engaging hook line here",
        "tags": ["tag1", "tag2", "tag3"]
      }
    ]

    Return only the JSON array, no additional text.
    `;

    try {
      const response = await this.callGeminiAPI(prompt, 'gemini-1.5-flash');
      const cleanResponse = response.replace(/```json\s*/, '').replace(/```\s*$/, '');
      return JSON.parse(cleanResponse);
    } catch (error) {
      // Fallback ideas
      return [
        {
          title: "Key Insights from My Voice Note",
          description: "Transform your thoughts into actionable content",
          hook: "You just shared something powerful...",
          tags: ["insights", "productivity", "personal-development"]
        }
      ];
    }
  }

  // Extract content from sources
  async extractContentFromSources(sources: Source[]): Promise<Source[]> {
    const updatedSources = await Promise.all(
      sources.map(async (source) => {
        if (source.extractedText) {
          return source; // Already extracted
        }

        try {
          const response = await fetch('/api/extract-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: source.link })
          });

          const result = await response.json();
          
          return {
            ...source,
            extractedText: result.extractedText || source.snippet,
            isTextExtracted: !!result.extractedText,
            textExtractionError: result.error || undefined
          };
        } catch (error) {
          return {
            ...source,
            extractedText: source.snippet,
            isTextExtracted: false,
            textExtractionError: 'Failed to extract content'
          };
        }
      })
    );

    return updatedSources;
  }

  // Generate script components from sources and video idea
  async generateScriptComponents(videoIdea: string, sources: Source[]): Promise<ScriptComponents> {
    const sourcesContent = sources
      .filter(s => s.extractedText)
      .map(s => `Source: ${s.title}\nContent: ${s.extractedText}`)
      .join('\n\n');

    const prompt = `${SCRIPT_COMPONENTS_SYSTEM_PROMPT}

Video Idea: "${videoIdea}"

Research Sources:
${sourcesContent}

Based on this research, generate script components for the video idea. Focus on creating engaging, valuable content that addresses the target audience's needs.`;

    try {
      const response = await this.callGeminiAPI(prompt, 'gemini-2.0-flash-exp', {
        temperature: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      });

      const result = JSON.parse(response);
      
      // Transform the response into our ScriptComponents format
      return {
        hooks: result.hooks.map((hook: string, index: number) => ({
          title: `Hook ${index + 1}`,
          lines: [hook]
        })),
        bridges: result.bridges.map((bridge: string, index: number) => ({
          title: `Bridge ${index + 1}`,
          content: bridge
        })),
        goldenNuggets: result.golden_nuggets.map((nugget: any) => ({
          title: nugget.title,
          content: nugget.bullet_points.join('\n• ')
        })),
        wtas: result.wtas.map((wta: string, index: number) => ({
          title: `WTA ${index + 1}`,
          actionType: 'engagement',
          lines: [wta]
        }))
      };
    } catch (error) {
      throw new Error(`Failed to generate script components: ${error}`);
    }
  }

  // Generate final script from selected components
  async generateFinalScript(
    videoIdea: string, 
    selectedComponents: UserSelectedScriptComponents,
    voiceProfile?: VoiceProfile
  ): Promise<string> {
    let prompt = `You are an expert AI scriptwriter tasked with assembling a cohesive and engaging short-form video script.

Video Idea: "${videoIdea}"`;

    // Add voice profile instructions if available
    if (voiceProfile && voiceProfile.voiceProfile) {
      const coreIdentity = voiceProfile.voiceProfile.coreIdentity;
      const actionableComponents = voiceProfile.voiceProfile.actionableSystemPromptComponents;

      prompt += `\n\nIMPORTANT: You must write this script in the specific voice and style of "${voiceProfile.name}". Follow these voice guidelines carefully:

VOICE IDENTITY:
- Persona: ${coreIdentity.suggestedPersonaName || 'Content Creator'}
- Primary Tones: ${coreIdentity.dominantTones?.join(', ') || 'Conversational'}
- Secondary Tones: ${coreIdentity.secondaryTones?.join(', ') || 'Engaging'}
- Unique Characteristics: ${coreIdentity.uniqueIdentifiersOrQuirks?.join(', ') || 'Authentic and relatable'}

WRITING DIRECTIVES:
${actionableComponents?.voiceDnaSummaryDirectives?.map((directive: string, index: number) => `${index + 1}. ${directive}`).join('\n') || '1. Maintain an authentic, conversational tone\n2. Engage directly with the audience\n3. Deliver clear, valuable insights'}`;

      // Add negative constraints if available
      if (actionableComponents?.consolidatedNegativeConstraints) {
        const constraints = actionableComponents.consolidatedNegativeConstraints;
        if (constraints.wordsToAvoid?.length) {
          prompt += `\n\nAVOID THESE WORDS/PHRASES: ${constraints.wordsToAvoid.join(', ')}`;
        }
        if (constraints.tonesToAvoid?.length) {
          prompt += `\nAVOID THESE TONES: ${constraints.tonesToAvoid.join(', ')}`;
        }
      }
    }

    prompt += `\n\nAssemble the following user-selected components into a flowing script:

Selected Hook:
Title: ${selectedComponents.hook?.title}
Lines: ${selectedComponents.hook?.lines.join('\n')}

Selected Bridge:
Title: ${selectedComponents.bridge?.title}
Content: ${selectedComponents.bridge?.content}

Selected Golden Nugget:
Title: ${selectedComponents.goldenNugget?.title}
Content: ${selectedComponents.goldenNugget?.content}

Selected WTA:
Title: ${selectedComponents.wta?.title}
Action Type: ${selectedComponents.wta?.actionType}
Lines: ${selectedComponents.wta?.lines.join('\n')}

Generate the final script text with natural flow and engaging delivery.`;

    try {
      const response = await this.callGeminiAPI(prompt, 'gemini-1.5-pro-latest', {
        temperature: 0.7,
        maxOutputTokens: 2048
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to generate final script: ${error}`);
    }
  }

  // Generate script outline from existing script content
  async generateOutlineFromScript(existingHook: string, transcript: string, videoIdea: string): Promise<ScriptComponents> {
    const prompt = `You are an expert scriptwriter. Based on the existing script content below, generate multiple creative variations for each script component.

Video Idea: "${videoIdea}"
Existing Hook: "${existingHook}"
Script Content: "${transcript}"

Generate 4 options each for hooks, bridges, golden nuggets, and WTAs that build upon and enhance the existing content.

Output format should be JSON matching the ScriptComponents structure.`;

    try {
      const response = await this.callGeminiAPI(prompt, 'gemini-1.5-pro-latest', {
        temperature: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      });

      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Failed to generate outline from script: ${error}`);
    }
  }

  // Core Gemini API call function
  private async callGeminiAPI(prompt: string, model: string = 'gemini-1.5-pro-latest', options: any = {}): Promise<string> {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 2048,
        responseMimeType: options.responseMimeType || "text/plain"
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
      throw new Error('No valid response from Gemini API');
    }

    return result.candidates[0].content.parts[0].text;
  }
}

// Utility functions for script processing
export class ScriptUtils {
  // Validate script components
  static validateScriptComponents(components: UserSelectedScriptComponents): boolean {
    return !!(components.hook && components.bridge && components.goldenNugget && components.wta);
  }

  // Create a complete script outline
  static createScriptOutline(components: UserSelectedScriptComponents): string {
    if (!this.validateScriptComponents(components)) {
      throw new Error('All script components must be selected');
    }

    return `
**HOOK:**
${components.hook!.lines.join('\n')}

**BRIDGE:**
${components.bridge!.content}

**GOLDEN NUGGET:**
${components.goldenNugget!.content}

**CALL TO ACTION:**
${components.wta!.lines.join('\n')}
    `.trim();
  }

  // Extract key metrics from script
  static analyzeScript(scriptText: string): {
    wordCount: number;
    estimatedDuration: number; // in seconds
    readabilityScore: number;
    hookStrength: number;
  } {
    const words = scriptText.split(/\s+/).length;
    const estimatedDuration = Math.ceil(words / 2.5); // Average speaking rate
    
    // Simple readability score (Flesch-Kincaid approximation)
    const sentences = scriptText.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 1.5)));
    
    // Hook strength based on engagement indicators
    const hookIndicators = ['you', 'your', '?', '!', 'secret', 'mistake', 'why', 'how'];
    const hookText = scriptText.substring(0, 200).toLowerCase();
    const hookMatches = hookIndicators.filter(indicator => hookText.includes(indicator)).length;
    const hookStrength = Math.min(100, (hookMatches / hookIndicators.length) * 100);

    return {
      wordCount: words,
      estimatedDuration,
      readabilityScore: Math.round(readabilityScore),
      hookStrength: Math.round(hookStrength)
    };
  }

  // Convert script to different formats
  static exportScript(scriptText: string, format: 'plain' | 'markdown' | 'json' = 'plain'): string {
    switch (format) {
      case 'markdown':
        return `# Script\n\n${scriptText.replace(/\n/g, '\n\n')}`;
      case 'json':
        return JSON.stringify({
          script: scriptText,
          metadata: this.analyzeScript(scriptText),
          exportedAt: new Date().toISOString()
        }, null, 2);
      default:
        return scriptText;
    }
  }
}

// Example usage class
export class ScriptwritingWorkflow {
  private engine: ScriptwritingEngine;

  constructor(geminiApiKey: string) {
    this.engine = new ScriptwritingEngine(geminiApiKey);
  }

  // Complete workflow: idea -> sources -> components -> final script
  async createScriptFromIdea(
    videoIdea: string,
    sources: Source[] = [],
    voiceProfile?: VoiceProfile
  ): Promise<{
    components: ScriptComponents;
    selectedComponents: UserSelectedScriptComponents;
    finalScript: string;
    analysis: any;
  }> {
    try {
      // Step 1: Extract content from sources if needed
      const processedSources = sources.length > 0 
        ? await this.engine.extractContentFromSources(sources)
        : [];

      // Step 2: Generate script components
      const components = await this.engine.generateScriptComponents(videoIdea, processedSources);

      // Step 3: Auto-select first option from each component (or implement custom selection logic)
      const selectedComponents: UserSelectedScriptComponents = {
        hook: components.hooks[0] || null,
        bridge: components.bridges[0] || null,
        goldenNugget: components.goldenNuggets[0] || null,
        wta: components.wtas[0] || null
      };

      // Step 4: Generate final script
      const finalScript = await this.engine.generateFinalScript(
        videoIdea,
        selectedComponents,
        voiceProfile
      );

      // Step 5: Analyze final script
      const analysis = ScriptUtils.analyzeScript(finalScript);

      return {
        components,
        selectedComponents,
        finalScript,
        analysis
      };
    } catch (error) {
      throw new Error(`Scriptwriting workflow failed: ${error}`);
    }
  }

  // Create script from existing transcript
  async createScriptFromTranscript(
    transcript: string,
    videoIdea?: string,
    voiceProfile?: VoiceProfile
  ): Promise<{
    videoIdeas: any[];
    selectedIdea: string;
    components: ScriptComponents;
    finalScript: string;
  }> {
    try {
      // Step 1: Generate video ideas from transcript
      const videoIdeas = await this.engine.generateVideoIdeas(transcript);

      // Step 2: Use provided video idea or select first generated one
      const selectedIdea = videoIdea || videoIdeas[0]?.title || 'Generated Content';

      // Step 3: Generate components from transcript
      const components = await this.engine.generateOutlineFromScript('', transcript, selectedIdea);

      // Step 4: Auto-select components and generate final script
      const selectedComponents: UserSelectedScriptComponents = {
        hook: components.hooks[0] || null,
        bridge: components.bridges[0] || null,
        goldenNugget: components.goldenNuggets[0] || null,
        wta: components.wtas[0] || null
      };

      const finalScript = await this.engine.generateFinalScript(
        selectedIdea,
        selectedComponents,
        voiceProfile
      );

      return {
        videoIdeas,
        selectedIdea,
        components,
        finalScript
      };
    } catch (error) {
      throw new Error(`Transcript-to-script workflow failed: ${error}`);
    }
  }
}

// Export everything
export default {
  ScriptwritingEngine,
  ScriptUtils,
  ScriptwritingWorkflow
}; 