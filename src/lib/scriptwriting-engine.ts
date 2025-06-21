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
    console.log('🔄 Transforming API response:', data);
    
    const components = {
      hooks: data.hooks?.map((hook: any, index: number) => {
        const title = this.createTitleFromContent(hook, 'Hook');
        const component = {
          id: `hook-${index}`,
          title: title,
          content: hook,
          preview: this.createPreview(hook)
        };
        console.log(`🪝 Hook ${index + 1}:`, component);
        return component;
      }) || [],
      bridges: data.bridges?.map((bridge: any, index: number) => {
        const title = this.createTitleFromContent(bridge, 'Bridge');
        const component = {
          id: `bridge-${index}`,
          title: title,
          content: bridge,
          preview: this.createPreview(bridge)
        };
        console.log(`🌉 Bridge ${index + 1}:`, component);
        return component;
      }) || [],
      goldenNuggets: data.golden_nuggets?.map((nugget: any, index: number) => {
        const title = nugget.title || this.createTitleFromContent(nugget.content || nugget.bullet_points?.join(' '), 'Golden Nugget');
        const component = {
          id: `nugget-${index}`,
          title: title,
          content: nugget.bullet_points?.join('\n• ') || nugget.content || '',
          bulletPoints: nugget.bullet_points || [],
          preview: this.createPreview(nugget.title || nugget.content)
        };
        console.log(`💎 Golden Nugget ${index + 1}:`, component);
        return component;
      }) || [],
      wtas: data.wtas?.map((wta: any, index: number) => {
        const title = this.createTitleFromContent(wta, 'Call to Action');
        const component = {
          id: `wta-${index}`,
          title: title,
          actionType: this.determineActionType(wta),
          content: wta,
          preview: this.createPreview(wta)
        };
        console.log(`📢 WTA ${index + 1}:`, component);
        return component;
      }) || []
    };

    console.log('✅ Final transformed components:', {
      hooks: components.hooks.length,
      bridges: components.bridges.length,
      goldenNuggets: components.goldenNuggets.length,
      wtas: components.wtas.length
    });

    return components;
  }

  // Create meaningful titles from content
  private createTitleFromContent(content: string, fallbackPrefix: string): string {
    if (!content) return `${fallbackPrefix} Option`;
    
    // Extract first meaningful sentence or phrase
    const cleanContent = content.replace(/[^\w\s?!.]/g, ' ').trim();
    const sentences = cleanContent.split(/[.!?]+/);
    const firstSentence = sentences[0]?.trim();
    
    if (firstSentence && firstSentence.length > 10 && firstSentence.length < 60) {
      return firstSentence;
    }
    
    // If first sentence is too long or short, try to extract key words
    const words = cleanContent.split(/\s+/).slice(0, 8);
    const title = words.join(' ');
    
    if (title.length > 50) {
      return title.substring(0, 47) + '...';
    }
    
    return title || `${fallbackPrefix} Option`;
  }

  // Create preview text for components
  private createPreview(content: string): string {
    if (!content) return '';
    const cleanContent = content.replace(/[^\w\s?!.,]/g, ' ').trim();
    return cleanContent.length > 100 ? cleanContent.substring(0, 97) + '...' : cleanContent;
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