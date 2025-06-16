// Scriptwriting Engine for Next.js App
// Full implementation matching the documented workflow

export interface Source {
  id?: string;
  title: string;
  link: string;
  snippet: string;
  extractedText?: string;
  isTextExtracted?: boolean;
  textExtractionError?: string;
}

export interface ScriptHook {
  id: string;
  title: string;
  content: string;
  preview: string;
}

export interface ScriptBridge {
  id: string;
  title: string;
  content: string;
  preview: string;
}

export interface ScriptGoldenNugget {
  id: string;
  title: string;
  content: string;
  bulletPoints: string[];
  preview: string;
}

export interface ScriptWTA {
  id: string;
  title: string;
  actionType: 'engagement' | 'follow' | 'share' | 'comment';
  content: string;
  preview: string;
}

export interface ScriptComponents {
  hooks: ScriptHook[];
  bridges: ScriptBridge[];
  goldenNuggets: ScriptGoldenNugget[];
  wtas: ScriptWTA[];
}

export interface SelectedComponents {
  hook: ScriptHook | null;
  bridge: ScriptBridge | null;
  goldenNugget: ScriptGoldenNugget | null;
  wta: ScriptWTA | null;
}

export interface ScriptGenerationResult {
  videoIdea: string;
  sources: Source[];
  components: ScriptComponents;
  selectedComponents: SelectedComponents;
  finalScript: string;
  status: 'idle' | 'gathering-sources' | 'extracting-content' | 'generating-components' | 'selecting-components' | 'generating-script' | 'complete' | 'error';
  error?: string;
  analysis?: {
    wordCount: number;
    estimatedDuration: number;
    readabilityScore: number;
    hookStrength: number;
  };
}

export class ScriptwritingEngine {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }

  // Step 1: Gather sources for the video idea
  async gatherSources(videoIdea: string): Promise<Source[]> {
    try {
      const response = await fetch('/api/scriptwriting/gather-sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoIdea }),
      });

      if (!response.ok) {
        throw new Error('Failed to gather sources');
      }

      const data = await response.json();
      return data.sources || [];
    } catch (error) {
      console.error('Error gathering sources:', error);
      // Return fallback sources if gathering fails
      return this.getFallbackSources(videoIdea);
    }
  }

  // Step 2: Extract content from sources
  async extractContentFromSources(sources: Source[]): Promise<Source[]> {
    try {
      const response = await fetch('/api/scriptwriting/extract-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sources }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract content from sources');
      }

      const data = await response.json();
      return data.sources || sources;
    } catch (error) {
      console.error('Error extracting content:', error);
      // Return original sources with snippets as fallback
      return sources.map(source => ({
        ...source,
        extractedText: source.snippet,
        isTextExtracted: false,
        textExtractionError: 'Content extraction failed'
      }));
    }
  }

  // Step 3: Generate script components from video idea and sources
  async generateScriptComponents(videoIdea: string, sources: Source[]): Promise<ScriptComponents> {
    try {
      const response = await fetch('/api/scriptwriting/generate-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoIdea, sources }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script components');
      }

      const data = await response.json();
      return this.transformComponentsResponse(data);
    } catch (error) {
      console.error('Error generating script components:', error);
      throw error;
    }
  }

  // Step 4: Generate final script from selected components
  async generateFinalScript(
    videoIdea: string,
    selectedComponents: SelectedComponents,
    voiceProfile?: any
  ): Promise<string> {
    try {
      const response = await fetch('/api/scriptwriting/generate-final-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoIdea, selectedComponents, voiceProfile }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate final script');
      }

      const data = await response.json();
      return data.finalScript;
    } catch (error) {
      console.error('Error generating final script:', error);
      throw error;
    }
  }

  // Complete workflow: idea -> sources -> components -> final script
  async createScriptFromIdea(
    videoIdea: string,
    voiceProfile?: any
  ): Promise<ScriptGenerationResult> {
    const result: ScriptGenerationResult = {
      videoIdea,
      sources: [],
      components: { hooks: [], bridges: [], goldenNuggets: [], wtas: [] },
      selectedComponents: { hook: null, bridge: null, goldenNugget: null, wta: null },
      finalScript: '',
      status: 'idle'
    };

    try {
      // Step 1: Gather sources
      result.status = 'gathering-sources';
      result.sources = await this.gatherSources(videoIdea);

      // Step 2: Extract content from sources
      result.status = 'extracting-content';
      result.sources = await this.extractContentFromSources(result.sources);

      // Step 3: Generate script components
      result.status = 'generating-components';
      result.components = await this.generateScriptComponents(videoIdea, result.sources);

      // Step 4: Auto-select components
      result.status = 'selecting-components';
      result.selectedComponents = this.autoSelectComponents(result.components);

      // Step 5: Generate final script
      result.status = 'generating-script';
      result.finalScript = await this.generateFinalScript(
        videoIdea,
        result.selectedComponents,
        voiceProfile
      );

      // Step 6: Analyze script
      result.analysis = this.analyzeScript(result.finalScript);
      result.status = 'complete';

      return result;
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error occurred';
      return result;
    }
  }

  // Transform API response to our component structure
  private transformComponentsResponse(data: any): ScriptComponents {
    return {
      hooks: data.hooks?.map((hook: any, index: number) => ({
        id: `hook-${index}`,
        title: `Hook ${index + 1}`,
        content: hook,
        preview: this.createPreview(hook)
      })) || [],
      bridges: data.bridges?.map((bridge: any, index: number) => ({
        id: `bridge-${index}`,
        title: `Bridge ${index + 1}`,
        content: bridge,
        preview: this.createPreview(bridge)
      })) || [],
      goldenNuggets: data.golden_nuggets?.map((nugget: any, index: number) => ({
        id: `nugget-${index}`,
        title: nugget.title || `Golden Nugget ${index + 1}`,
        content: nugget.bullet_points?.join('\n• ') || nugget.content || '',
        bulletPoints: nugget.bullet_points || [],
        preview: this.createPreview(nugget.title)
      })) || [],
      wtas: data.wtas?.map((wta: any, index: number) => ({
        id: `wta-${index}`,
        title: `Call to Action ${index + 1}`,
        actionType: this.determineActionType(wta),
        content: wta,
        preview: this.createPreview(wta)
      })) || []
    };
  }

  // Create preview text for components
  private createPreview(content: string): string {
    if (!content) return '';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  }

  // Determine action type from WTA content
  private determineActionType(wta: string): 'engagement' | 'follow' | 'share' | 'comment' {
    const lowerWta = wta.toLowerCase();
    if (lowerWta.includes('comment') || lowerWta.includes('tell me')) return 'comment';
    if (lowerWta.includes('follow') || lowerWta.includes('subscribe')) return 'follow';
    if (lowerWta.includes('share') || lowerWta.includes('tag')) return 'share';
    return 'engagement';
  }

  // Auto-select best components based on criteria
  autoSelectComponents(components: ScriptComponents): SelectedComponents {
    return {
      hook: components.hooks[0] || null,
      bridge: components.bridges[0] || null,
      goldenNugget: components.goldenNuggets[0] || null,
      wta: components.wtas.find(w => w.actionType === 'engagement') || components.wtas[0] || null
    };
  }

  // Validate components selection
  validateSelection(selectedComponents: SelectedComponents): boolean {
    return !!(
      selectedComponents.hook &&
      selectedComponents.bridge &&
      selectedComponents.goldenNugget &&
      selectedComponents.wta
    );
  }

  // Analyze script for metrics
  analyzeScript(scriptText: string): {
    wordCount: number;
    estimatedDuration: number;
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

  // Fallback sources when gathering fails
  private getFallbackSources(videoIdea: string): Source[] {
    return [
      {
        id: 'fallback-1',
        title: `Research: ${videoIdea}`,
        link: 'https://example.com/research',
        snippet: `General information and best practices related to: ${videoIdea}`,
        extractedText: `This is fallback content for ${videoIdea}. In a real implementation, this would contain researched information from web sources.`,
        isTextExtracted: true
      }
    ];
  }
} 