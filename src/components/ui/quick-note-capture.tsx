"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Save, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickNoteCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export function QuickNoteCapture({ isOpen, onClose, onSave }: QuickNoteCaptureProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Auto-focus textarea when opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300); // Wait for animation to complete
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Generate AI title when content changes
  useEffect(() => {
    if (content.length > 20 && !title) {
      generateTitle();
    }
  }, [content, title]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        handleClose();
      } else if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, content]);

  const generateTitle = async () => {
    if (isGeneratingTitle) return;
    
    setIsGeneratingTitle(true);
    
    // Simulate AI title generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const words = content.split(' ').slice(0, 5);
    const generatedTitle = words.join(' ') + (words.length >= 5 ? '...' : '');
    
    setTitle(generatedTitle);
    setIsGeneratingTitle(false);
  };

  const handleSave = () => {
    if (!content.trim()) return;
    
    const finalTitle = title.trim() || 'Untitled Note';
    onSave(finalTitle, content.trim());
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setIsGeneratingTitle(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Slide-down panel */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-lg",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Quick Note</h2>
              {isGeneratingTitle && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Generating title...</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Title Input */}
          <div className="mb-4">
                           <Input
                 ref={titleRef}
                 placeholder="Note title (optional)"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="text-base font-medium shadow-xs"
                 disabled={isGeneratingTitle}
               />
          </div>

          {/* Content Textarea */}
          <div className="mb-4">
                           <Textarea
                 ref={textareaRef}
                 placeholder="Start typing your note..."
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 className="min-h-[120px] resize-none text-base leading-relaxed shadow-xs"
                 rows={5}
               />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close • 
              <kbd className="px-2 py-1 bg-muted rounded text-xs ml-1">⌘ Enter</kbd> to save
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleClose} className="shadow-xs">
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!content.trim() || isGeneratingTitle}
                className="min-w-[80px] shadow-xs"
              >
                {isGeneratingTitle ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 