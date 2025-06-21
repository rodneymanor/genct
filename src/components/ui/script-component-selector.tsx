"use client";

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, MessageCircle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ScriptHook, ScriptBridge, ScriptGoldenNugget, ScriptWTA } from '@/lib/scriptwriting-engine';

interface ComponentSelectorProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  options: (ScriptHook | ScriptBridge | ScriptGoldenNugget | ScriptWTA)[];
  selected: any;
  onSelect: (option: any) => void;
  className?: string;
}

export function ComponentSelector({
  title,
  description,
  icon,
  options,
  selected,
  onSelect,
  className
}: ComponentSelectorProps) {
  const [selectedOption, setSelectedOption] = useState(selected || options[0]);
  const [customText, setCustomText] = useState(selected?.content || options[0]?.content || '');

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setCustomText(option.content);
    onSelect(option);
  };

  const handleTextChange = (text: string) => {
    setCustomText(text);
    // Create a custom option with the edited text
    const customOption = {
      ...selectedOption,
      content: text,
      isCustom: true
    };
    onSelect(customOption);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Template Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Choose a template:</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {options.map((option, index) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50",
                    selectedOption?.id === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{option.title}</span>
                        {'actionType' in option && (
                          <Badge variant="secondary" className="text-xs">
                            {option.actionType}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {option.preview}
                      </p>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center ml-2 flex-shrink-0",
                      selectedOption?.id === option.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}>
                      {selectedOption?.id === option.id && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Text Editor */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Edit your template:</h4>
            <div className="space-y-3">
              <Textarea
                value={customText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Your template content will appear here..."
                className="min-h-32 resize-none"
              />
              <div className="text-xs text-muted-foreground">
                Use placeholders like [Topic], [Number], [Desired Outcome] to customize your content
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ScriptComponentSelectorsProps {
  components: {
    hooks: ScriptHook[];
    bridges: ScriptBridge[];
    goldenNuggets: ScriptGoldenNugget[];
    wtas: ScriptWTA[];
  };
  selectedComponents: {
    hook: ScriptHook | null;
    bridge: ScriptBridge | null;
    goldenNugget: ScriptGoldenNugget | null;
    wta: ScriptWTA | null;
  };
  onComponentSelect: (type: string, component: any) => void;
}

export function ScriptComponentSelectors({
  components,
  selectedComponents,
  onComponentSelect
}: ScriptComponentSelectorsProps) {
  return (
    <div className="space-y-8">
      <ComponentSelector
        title="Hook"
        description="Grab attention in the first 3 seconds"
        icon={<Sparkles className="w-4 h-4 text-primary" />}
        options={components.hooks}
        selected={selectedComponents.hook}
        onSelect={(option) => onComponentSelect('hook', option)}
      />
      
      <ComponentSelector
        title="Bridge"
        description="Smooth transition to main content"
        icon={<ArrowRight className="w-4 h-4 text-primary" />}
        options={components.bridges}
        selected={selectedComponents.bridge}
        onSelect={(option) => onComponentSelect('bridge', option)}
      />
      
      <ComponentSelector
        title="Golden Nugget"
        description="The valuable core content"
        icon={<Target className="w-4 h-4 text-primary" />}
        options={components.goldenNuggets}
        selected={selectedComponents.goldenNugget}
        onSelect={(option) => onComponentSelect('goldenNugget', option)}
      />
      
      <ComponentSelector
        title="Call to Action"
        description="Drive engagement and following"
        icon={<MessageCircle className="w-4 h-4 text-primary" />}
        options={components.wtas}
        selected={selectedComponents.wta}
        onSelect={(option) => onComponentSelect('wta', option)}
      />
    </div>
  );
} 