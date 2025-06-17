"use client";

import React from 'react';
import { Check, Sparkles, ArrowRight, MessageCircle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
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
      <CardContent className="space-y-3">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={cn(
              "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
              selected?.id === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
            onClick={() => onSelect(option)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Option {index + 1}</span>
                  {'actionType' in option && (
                    <Badge variant="secondary" className="text-xs">
                      {option.actionType}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {option.preview || option.content}
                </p>
                {'bulletPoints' in option && option.bulletPoints.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {option.bulletPoints.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                    {option.bulletPoints.length > 2 && (
                      <div className="text-xs text-muted-foreground ml-3">
                        +{option.bulletPoints.length - 2} more points
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0",
                selected?.id === option.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              )}>
                {selected?.id === option.id && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
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
    </div>
  );
} 