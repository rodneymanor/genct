"use client";

import { useState, useCallback } from 'react';
import { ScriptwritingEngine, ScriptComponents, SelectedComponents, Source } from '@/lib/scriptwriting-engine';

export type ScriptwritingStep = 'idle' | 'gathering-sources' | 'extracting-content' | 'generating-components' | 'selecting-components' | 'generating-script' | 'complete' | 'error';

export interface ScriptwritingState {
  step: ScriptwritingStep;
  videoIdea: string;
  sources: Source[];
  components: ScriptComponents | null;
  selectedComponents: SelectedComponents;
  finalScript: string;
  error: string | null;
  isLoading: boolean;
  analysis?: {
    wordCount: number;
    estimatedDuration: number;
    readabilityScore: number;
    hookStrength: number;
  };
}

export function useScriptwriting() {
  const [state, setState] = useState<ScriptwritingState>({
    step: 'idle',
    videoIdea: '',
    sources: [],
    components: null,
    selectedComponents: {
      hook: null,
      bridge: null,
      goldenNugget: null,
      wta: null
    },
    finalScript: '',
    error: null,
    isLoading: false
  });

  const engine = new ScriptwritingEngine();

  // Start the complete scriptwriting workflow
  const startScriptwriting = useCallback(async (videoIdea: string) => {
    setState(prev => ({
      ...prev,
      step: 'gathering-sources',
      videoIdea,
      error: null,
      isLoading: true,
      sources: [],
      components: null,
      finalScript: ''
    }));

    try {
      // Step 1: Gather sources
      setState(prev => ({ ...prev, step: 'gathering-sources' }));
      const sources = await engine.gatherSources(videoIdea);
      
      setState(prev => ({ ...prev, sources }));

      // Step 2: Extract content from sources
      setState(prev => ({ ...prev, step: 'extracting-content' }));
      const sourcesWithContent = await engine.extractContentFromSources(sources);
      
      setState(prev => ({ ...prev, sources: sourcesWithContent }));

      // Step 3: Generate script components
      setState(prev => ({ ...prev, step: 'generating-components' }));
      const components = await engine.generateScriptComponents(videoIdea, sourcesWithContent);
      
      // Step 4: Auto-select components
      const autoSelected = engine.autoSelectComponents(components);

      setState(prev => ({
        ...prev,
        step: 'selecting-components',
        components,
        selectedComponents: autoSelected,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Failed to generate script components',
        isLoading: false
      }));
    }
  }, []);

  // Use the complete workflow method
  const startCompleteWorkflow = useCallback(async (videoIdea: string) => {
    setState(prev => ({
      ...prev,
      step: 'gathering-sources',
      videoIdea,
      error: null,
      isLoading: true
    }));

    try {
      const result = await engine.createScriptFromIdea(videoIdea);
      
      setState(prev => ({
        ...prev,
        step: result.status,
        sources: result.sources,
        components: result.components,
        selectedComponents: result.selectedComponents,
        finalScript: result.finalScript,
        analysis: result.analysis,
        error: result.error || null,
        isLoading: result.status === 'gathering-sources' || result.status === 'extracting-content' || result.status === 'generating-components' || result.status === 'generating-script'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Failed to complete scriptwriting workflow',
        isLoading: false
      }));
    }
  }, []);

  // Update selected components
  const updateSelectedComponent = useCallback((
    type: keyof SelectedComponents,
    component: any
  ) => {
    setState(prev => ({
      ...prev,
      selectedComponents: {
        ...prev.selectedComponents,
        [type]: component
      }
    }));
  }, []);

  // Generate final script from selected components
  const generateFinalScript = useCallback(async () => {
    if (!engine.validateSelection(state.selectedComponents)) {
      setState(prev => ({
        ...prev,
        error: 'Please select all required components'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      step: 'generating-script',
      isLoading: true,
      error: null
    }));

    try {
      const finalScript = await engine.generateFinalScript(
        state.videoIdea,
        state.selectedComponents
      );

      const analysis = engine.analyzeScript(finalScript);

      setState(prev => ({
        ...prev,
        step: 'complete',
        finalScript,
        analysis,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Failed to generate final script',
        isLoading: false
      }));
    }
  }, [state.videoIdea, state.selectedComponents]);

  // Reset the workflow
  const reset = useCallback(() => {
    setState({
      step: 'idle',
      videoIdea: '',
      sources: [],
      components: null,
      selectedComponents: {
        hook: null,
        bridge: null,
        goldenNugget: null,
        wta: null
      },
      finalScript: '',
      error: null,
      isLoading: false
    });
  }, []);

  // Go back to component selection
  const backToSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      step: 'selecting-components',
      error: null
    }));
  }, []);

  return {
    state,
    startScriptwriting,
    startCompleteWorkflow,
    updateSelectedComponent,
    generateFinalScript,
    reset,
    backToSelection,
    
    // Computed properties for easier UI logic
    canGenerateScript: engine.validateSelection(state.selectedComponents),
    isGenerating: state.isLoading,
    hasError: !!state.error,
    isComplete: state.step === 'complete',
    
    // Progress information
    currentStep: state.step,
    sourcesCount: state.sources.length,
    extractedSourcesCount: state.sources.filter(s => s.isTextExtracted).length
  };
} 