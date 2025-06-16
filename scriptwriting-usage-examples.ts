// Usage Examples for Scriptwriting Core Export
// This file demonstrates how to use the exported scriptwriting functionality

import { 
  ScriptwritingEngine, 
  ScriptwritingWorkflow, 
  ScriptUtils,
  Source,
  VoiceProfile,
  UserSelectedScriptComponents 
} from './scriptwriting-core-export';

// Example 1: Basic Script Generation from Idea
async function exampleBasicScriptGeneration() {
  const apiKey = 'your-gemini-api-key';
  const engine = new ScriptwritingEngine(apiKey);

  const videoIdea = "5 mistakes entrepreneurs make when starting their first business";
  const sources: Source[] = [
    {
      title: "Common Startup Mistakes",
      link: "https://example.com/startup-mistakes",
      snippet: "Many entrepreneurs fail because they don't validate their market...",
      extractedText: "Detailed article content about startup mistakes and how to avoid them..."
    }
  ];

  try {
    // Generate script components
    const components = await engine.generateScriptComponents(videoIdea, sources);
    
    // Select components (you can implement custom selection logic)
    const selectedComponents: UserSelectedScriptComponents = {
      hook: components.hooks[0],
      bridge: components.bridges[0], 
      goldenNugget: components.goldenNuggets[0],
      wta: components.wtas[0]
    };

    // Generate final script
    const finalScript = await engine.generateFinalScript(videoIdea, selectedComponents);
    
    console.log('Generated Script:', finalScript);
    
    // Analyze the script
    const analysis = ScriptUtils.analyzeScript(finalScript);
    console.log('Script Analysis:', analysis);
    
  } catch (error) {
    console.error('Error generating script:', error);
  }
}

// Example 2: Using the Complete Workflow
async function exampleCompleteWorkflow() {
  const apiKey = 'your-gemini-api-key';
  const workflow = new ScriptwritingWorkflow(apiKey);

  const videoIdea = "How to build a morning routine that actually works";
  const sources: Source[] = [
    {
      title: "Morning Routine Research",
      link: "https://example.com/morning-routines",
      snippet: "Studies show that successful people have specific morning habits..."
    }
  ];

  // Optional: Voice profile for personalized script style
  const voiceProfile: VoiceProfile = {
    name: "Energetic Coach",
    voiceProfile: {
      coreIdentity: {
        suggestedPersonaName: "Motivational Content Creator",
        dominantTones: ["energetic", "encouraging", "direct"],
        secondaryTones: ["authentic", "relatable"],
        uniqueIdentifiersOrQuirks: ["uses specific examples", "speaks directly to viewer"],
        toneExemplars: ["Let's be real about this...", "Here's what I want you to try today"]
      },
      actionableSystemPromptComponents: {
        voiceDnaSummaryDirectives: [
          "Speak with high energy and enthusiasm",
          "Use direct, actionable language",
          "Include personal anecdotes when relevant"
        ],
        consolidatedNegativeConstraints: {
          wordsToAvoid: ["obviously", "just", "simply"],
          tonesToAvoid: ["condescending", "overly technical"]
        }
      }
    }
  };

  try {
    const result = await workflow.createScriptFromIdea(videoIdea, sources, voiceProfile);
    
    console.log('Complete Script Result:');
    console.log('- Components:', result.components);
    console.log('- Selected Components:', result.selectedComponents);
    console.log('- Final Script:', result.finalScript);
    console.log('- Analysis:', result.analysis);
    
  } catch (error) {
    console.error('Workflow error:', error);
  }
}

// Example 3: Creating Script from Transcript
async function exampleTranscriptToScript() {
  const apiKey = 'your-gemini-api-key';
  const workflow = new ScriptwritingWorkflow(apiKey);

  const transcript = `
    So I was talking to a client yesterday and they were telling me about how they've been struggling 
    with their morning routine. They wake up feeling overwhelmed and don't know where to start. 
    This is actually something I see all the time. People think they need this perfect 30-step morning 
    routine when really, the most successful people I know do just 3 simple things consistently.
    Let me break down what actually works...
  `;

  try {
    const result = await workflow.createScriptFromTranscript(transcript);
    
    console.log('Generated Video Ideas:', result.videoIdeas);
    console.log('Selected Idea:', result.selectedIdea);
    console.log('Script Components:', result.components);
    console.log('Final Script:', result.finalScript);
    
  } catch (error) {
    console.error('Transcript-to-script error:', error);
  }
}

// Example 4: Custom Component Selection and Script Analysis
async function exampleCustomSelection() {
  const apiKey = 'your-gemini-api-key';
  const engine = new ScriptwritingEngine(apiKey);

  const videoIdea = "Why most productivity advice doesn't work";
  
  try {
    // Generate multiple options
    const components = await engine.generateScriptComponents(videoIdea, []);
    
    // Custom selection logic - pick specific components based on criteria
    const selectedComponents: UserSelectedScriptComponents = {
      hook: components.hooks.find(h => h.lines[0].includes('?')) || components.hooks[0], // Prefer question hooks
      bridge: components.bridges[1], // Pick second bridge option
      goldenNugget: components.goldenNuggets[0], // First golden nugget
      wta: components.wtas.find(w => w.lines[0].toLowerCase().includes('comment')) || components.wtas[0] // Prefer comment CTAs
    };

    // Validate selection
    if (!ScriptUtils.validateScriptComponents(selectedComponents)) {
      throw new Error('Invalid component selection');
    }

    // Create outline first
    const outline = ScriptUtils.createScriptOutline(selectedComponents);
    console.log('Script Outline:', outline);

    // Generate final script
    const finalScript = await engine.generateFinalScript(videoIdea, selectedComponents);
    
    // Export in different formats
    const plainText = ScriptUtils.exportScript(finalScript, 'plain');
    const markdown = ScriptUtils.exportScript(finalScript, 'markdown');
    const jsonExport = ScriptUtils.exportScript(finalScript, 'json');
    
    console.log('Plain Text:', plainText);
    console.log('Markdown:', markdown);
    console.log('JSON Export:', jsonExport);
    
  } catch (error) {
    console.error('Custom selection error:', error);
  }
}

// Example 5: Cost Calculation and Monitoring
async function exampleCostCalculation() {
  const apiKey = 'your-gemini-api-key';
  const engine = new ScriptwritingEngine(apiKey);

  const samplePrompt = "Generate a script about productivity tips";
  const estimatedInputTokens = engine.calculateCost(1000, 0).inputTokens;
  const estimatedOutputTokens = 500;
  
  // Calculate estimated cost before making API call
  const costEstimate = engine.calculateCost(estimatedInputTokens, estimatedOutputTokens);
  console.log('Estimated Cost:', costEstimate);
  
  // If cost is acceptable, proceed with generation
  if (costEstimate.totalCost < 0.01) { // Less than 1 cent
    try {
      const ideas = await engine.generateVideoIdeas(samplePrompt);
      console.log('Generated Ideas:', ideas);
    } catch (error) {
      console.error('Generation error:', error);
    }
  } else {
    console.log('Cost too high, skipping generation');
  }
}

// Example 6: Batch Processing Multiple Ideas
async function exampleBatchProcessing() {
  const apiKey = 'your-gemini-api-key';
  const workflow = new ScriptwritingWorkflow(apiKey);

  const videoIdeas = [
    "5 habits that changed my life",
    "Why I quit my 9-5 job", 
    "How to learn any skill in 30 days"
  ];

  const results = [];

  for (const idea of videoIdeas) {
    try {
      console.log(`Processing: ${idea}`);
      const result = await workflow.createScriptFromIdea(idea);
      results.push({
        idea,
        script: result.finalScript,
        analysis: result.analysis
      });
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error processing ${idea}:`, error);
      results.push({
        idea,
        error: error.message
      });
    }
  }

  console.log('Batch Processing Results:', results);
}

// Export examples for use
export {
  exampleBasicScriptGeneration,
  exampleCompleteWorkflow,
  exampleTranscriptToScript,
  exampleCustomSelection,
  exampleCostCalculation,
  exampleBatchProcessing
};

// Example usage in a main function
async function main() {
  console.log('Running scriptwriting examples...');
  
  // Run one example at a time
  // await exampleBasicScriptGeneration();
  // await exampleCompleteWorkflow();
  // await exampleTranscriptToScript();
  // await exampleCustomSelection();
  // await exampleCostCalculation();
  // await exampleBatchProcessing();
}

// Uncomment to run examples
// main().catch(console.error); 