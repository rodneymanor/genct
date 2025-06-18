"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const fabRef = useRef<HTMLDivElement>(null);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  const handleMainButtonClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
      // Haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleActionClick = (action: 'note' | 'recording') => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }

    setIsExpanded(false);
    
    if (action === 'note') {
      router.push('/dashboard/note-editor?id=new');
    } else {
      router.push('/dashboard/capture/record');
    }
  };

  const speedDialActions = [
    {
      id: 'note',
      label: 'Quick Note',
      icon: FileText,
      color: 'bg-chart-4 hover:bg-chart-4/90 text-primary-foreground border-light',
      onClick: () => handleActionClick('note'),
    },
    {
      id: 'recording',
      label: 'Voice Memo',
      icon: Mic,
      color: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-light',
      onClick: () => handleActionClick('recording'),
    },
  ];

  return (
    <div
      ref={fabRef}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-300 ease-in-out',
        // Mobile safe area
        'pb-safe-bottom pr-safe-right',
        // Visibility
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        className
      )}
    >
      {/* Speed Dial Actions */}
      <div
        className={cn(
          'flex flex-col gap-3 transition-all duration-300 ease-out',
          isExpanded
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        )}
      >
        {speedDialActions.map((action, index) => (
          <div
            key={action.id}
            className={cn(
              'flex items-center gap-3 transition-all duration-300 ease-out',
              isExpanded ? 'translate-x-0' : 'translate-x-8'
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
          >
            {/* Action Label */}
            <div className="bg-popover text-popover-foreground text-sm px-3 py-2 rounded-lg border shadow-lg whitespace-nowrap">
              {action.label}
            </div>
            
            {/* Action Button */}
            <button
              onClick={action.onClick}
              className={cn(
                'w-12 h-12 rounded-full transition-all duration-200 ease-in-out',
                'flex items-center justify-center',
                'hover:scale-110 active:scale-95',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
                action.color
              )}
              aria-label={action.label}
            >
              <action.icon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={handleMainButtonClick}
        className={cn(
          'w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg',
          'flex items-center justify-center transition-all duration-200 ease-in-out',
          'hover:scale-110 active:scale-95',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
          // Rotation animation for the plus icon
          isExpanded && 'rotate-45'
        )}
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <Plus className="w-6 h-6 transition-transform duration-200" />
        )}
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 