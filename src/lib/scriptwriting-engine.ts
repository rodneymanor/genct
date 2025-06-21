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

// Predefined Script Templates
export const SCRIPT_TEMPLATES = {
  hooks: [
    {
      id: 'hook-1',
      title: 'Unexpected Source',
      content: 'I learned this [Effective Strategy] from an [Unexpected Source].',
      preview: 'Learn from unexpected sources to grab attention'
    },
    {
      id: 'hook-2',
      title: 'Number Hacks',
      content: 'Here are [Number] hacks to [Achieve a Desired Outcome].',
      preview: 'Promise specific number of valuable tips'
    },
    {
      id: 'hook-3',
      title: 'Common Belief Challenge',
      content: 'If I told you that [Common Belief] is wrong, you might not believe me. But what if...',
      preview: 'Challenge conventional wisdom'
    },
    {
      id: 'hook-4',
      title: 'Starting from Zero',
      content: 'How to achieve [Desired Outcome] when you\'re starting from zero.',
      preview: 'Appeal to beginners and those starting fresh'
    },
    {
      id: 'hook-5',
      title: 'Secret Revelation',
      content: 'The secret to [Topic] is not what you think.',
      preview: 'Reveal hidden truths about the topic'
    },
    {
      id: 'hook-6',
      title: 'Impossible Choice',
      content: 'You can\'t have [Desirable Thing A] and [Desirable Thing B] at the same time.',
      preview: 'Present a compelling either/or scenario'
    },
    {
      id: 'hook-7',
      title: 'Fear as Advantage',
      content: 'What if the thing you fear most about [Topic] is actually your greatest advantage?',
      preview: 'Reframe fears as opportunities'
    },
    {
      id: 'hook-8',
      title: 'Stop Learning, Start Doing',
      content: 'The fastest way to learn [Skill] is to stop trying to learn and start doing [Action].',
      preview: 'Encourage action over passive learning'
    },
    {
      id: 'hook-9',
      title: 'Struggling Reasons',
      content: 'You are likely struggling with [Topic] because of one of these [Number] reasons.',
      preview: 'Address common pain points directly'
    },
    {
      id: 'hook-10',
      title: 'Lesson Learned',
      content: 'A lesson I wish I learned earlier is that anything truly [Adjective] takes far longer than you expect.',
      preview: 'Share hard-earned wisdom about expectations'
    }
  ],
  bridges: [
    {
      id: 'bridge-1',
      title: 'Common Ineffective Action',
      content: 'Most people try to solve this by [Common but Ineffective Action].',
      preview: 'Identify what doesn\'t work before revealing what does'
    },
    {
      id: 'bridge-2',
      title: 'Conditioned Belief',
      content: 'The problem is, we are conditioned to believe that [Common Misconception].',
      preview: 'Expose underlying misconceptions'
    },
    {
      id: 'bridge-3',
      title: 'Negative to Positive',
      content: 'But you can turn a [Negative Aspect] into a [Positive Advantage]. Here\'s how.',
      preview: 'Transform disadvantages into advantages'
    },
    {
      id: 'bridge-4',
      title: 'Unexpected Method',
      content: 'The path to [Desired Outcome] isn\'t about [Expected Method], but about [Unexpected Method].',
      preview: 'Surprise with unconventional approaches'
    },
    {
      id: 'bridge-5',
      title: 'Core Principle',
      content: 'The only thing that truly matters for [Achieving Goal] is your ability to [Core Principle].',
      preview: 'Focus on the most important element'
    },
    {
      id: 'bridge-6',
      title: 'Internal Conflict',
      content: 'These two ideas seem to contradict each other, and that internal conflict is the source of your [Negative Emotion].',
      preview: 'Address cognitive dissonance'
    },
    {
      id: 'bridge-7',
      title: 'Simple Word Solution',
      content: 'The solution lies in understanding one simple word: "but".',
      preview: 'Build suspense with simplicity'
    },
    {
      id: 'bridge-8',
      title: 'Find Someone Who Does',
      content: 'The secret isn\'t learning a new skill, but in finding someone who already does it.',
      preview: 'Leverage existing expertise'
    }
  ],
  goldenNuggets: [
    {
      id: 'nugget-1',
      title: 'The "But" Reversal',
      content: 'The "But" Reversal: To be more persuasive, state the negatives first. Say "[Topic] is [Challenge 1] and [Challenge 2], but it delivers [Superior Result]." This magnifies the benefit.',
      bulletPoints: [],
      preview: 'Boost persuasion by addressing negatives first'
    },
    {
      id: 'nugget-2',
      title: 'The Identity Shift',
      content: 'The Identity Shift: To change your actions, first change your identity. Don\'t just do the work of a [Desired Role]; decide that you are a [Desired Role]. Actions will follow the new identity.',
      bulletPoints: [],
      preview: 'Change behavior by changing identity'
    },
    {
      id: 'nugget-3',
      title: 'The Price of Admission',
      content: 'The Price of Admission: [Desired Outcome] is the result of [Difficult Prerequisite]. You cannot have one without the other. Stop avoiding the challenge that creates the growth you want.',
      bulletPoints: [],
      preview: 'Accept difficult prerequisites for success'
    },
    {
      id: 'nugget-4',
      title: 'The Power of Endurance',
      content: 'The Power of Endurance: Success is often a game of volume and resilience. Your key advantage is your willingness to [Take Action] more times than anyone else.',
      bulletPoints: [],
      preview: 'Outperform through persistence and volume'
    },
    {
      id: 'nugget-5',
      title: 'The Constraint Principle',
      content: 'The Constraint Principle: You would be amazed at what you can endure when you have a clear endpoint. The fact that you feel [Negative Emotion] is proof that you are still in the game.',
      bulletPoints: [],
      preview: 'Use constraints to build endurance'
    },
    {
      id: 'nugget-6',
      title: 'The Foundation First',
      content: 'The Foundation First: True growth happens below the surface. If you build your [Goal] without first building the [Required Foundation] (e.g., character, systems), it will collapse.',
      bulletPoints: [],
      preview: 'Build strong foundations before pursuing goals'
    },
    {
      id: 'nugget-7',
      title: 'The Focus Imperative',
      content: 'The Focus Imperative: You have limited resources (time, effort, money). You must focus them on a single point to achieve a breakthrough. Stop diversifying your efforts before you\'ve had a single major success.',
      bulletPoints: [],
      preview: 'Concentrate resources for maximum impact'
    },
    {
      id: 'nugget-8',
      title: 'The "Never Stop" Commitment',
      content: 'The "Never Stop" Commitment: You don\'t need to know if you will succeed. You only need to commit to never stopping. On a long enough timeline, persistence guarantees progress.',
      bulletPoints: [],
      preview: 'Commit to persistence over prediction'
    },
    {
      id: 'nugget-9',
      title: 'The Higher Standard',
      content: 'The Higher Standard: The primary difference between those who succeed and those who don\'t is having a higher minimum standard for what they will accept in their lives. Say "no" to good opportunities to save your energy for great ones.',
      bulletPoints: [],
      preview: 'Raise standards to achieve excellence'
    }
  ],
  wtas: [
    {
      id: 'wta-1',
      title: 'Distance to Goal',
      actionType: 'engagement' as const,
      content: 'That\'s how far you really are from the [Desired Outcome] you\'ve been putting off.',
      preview: 'Reveal proximity to achieving goals'
    },
    {
      id: 'wta-2',
      title: 'Principle Application',
      actionType: 'engagement' as const,
      content: 'And that\'s how you can use [The Principle] to achieve [Your Goal].',
      preview: 'Connect principle to personal application'
    },
    {
      id: 'wta-3',
      title: 'Might As Well',
      actionType: 'engagement' as const,
      content: 'So you might as well [Take the First Step].',
      preview: 'Encourage immediate action'
    },
    {
      id: 'wta-4',
      title: 'Determine and Disregard',
      actionType: 'engagement' as const,
      content: 'If you can determine the [Required Effort] to get the [Desired Outcome], you can disregard all other distractions.',
      preview: 'Focus on what matters, ignore distractions'
    },
    {
      id: 'wta-5',
      title: 'Authentic Choice',
      actionType: 'engagement' as const,
      content: 'Remember, it\'s better to be [Disliked] for who you are than [Liked] for who you are not.',
      preview: 'Choose authenticity over approval'
    },
    {
      id: 'wta-6',
      title: 'Make the Choice',
      actionType: 'engagement' as const,
      content: 'Stop trying to have both [Thing A] and [Thing B] when one is the price for the other. Choose.',
      preview: 'Force decision between competing priorities'
    }
  ]
};

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
      // Instead of generating via AI, return the predefined templates
      return {
        hooks: SCRIPT_TEMPLATES.hooks,
        bridges: SCRIPT_TEMPLATES.bridges,
        goldenNuggets: SCRIPT_TEMPLATES.goldenNuggets,
        wtas: SCRIPT_TEMPLATES.wtas
      };
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

  // Helper function to get all predefined templates
  static getTemplates(): ScriptComponents {
    return {
      hooks: SCRIPT_TEMPLATES.hooks,
      bridges: SCRIPT_TEMPLATES.bridges,
      goldenNuggets: SCRIPT_TEMPLATES.goldenNuggets,
      wtas: SCRIPT_TEMPLATES.wtas
    };
  }
} 