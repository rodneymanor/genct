"use client";

import { cubicBezier, motion, AnimatePresence } from "motion/react";
import { Mail, Copy, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingNotificationPanel() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const ideaEmail = "ideas@yourdomain.com"; // Replace with your actual email

  // Load visibility state from localStorage on mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem('floatingPanelVisible');
    if (savedVisibility !== null) {
      setIsVisible(JSON.parse(savedVisibility));
    }
  }, []);

  // Save visibility state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('floatingPanelVisible', JSON.stringify(isVisible));
  }, [isVisible]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ideaEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const panelVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-surface-75 shadow-lg backdrop-blur-sm"
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-4">
          {/* Header with close button */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-foreground-light" />
              <h3 className="text-sm font-medium text-foreground">
                Idea Inbox
              </h3>
            </div>
            <motion.button
              onClick={handleClose}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-background transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-3 w-3 text-foreground-light hover:text-foreground" />
            </motion.button>
          </div>

          {/* Description */}
          <p className="text-xs text-foreground-light mb-4">
            Send ideas and social links directly to your inbox via email
          </p>
          
          {/* Email Address Section */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground-light">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-border bg-background px-3 py-2">
                <span className="text-sm font-mono text-foreground">
                  {ideaEmail}
                </span>
              </div>
              <motion.button
                onClick={handleCopyEmail}
                className="flex h-8 w-8 items-center justify-center rounded border border-border bg-background hover:bg-surface-75 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 text-foreground-light" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-medium text-foreground">
              How it works:
            </h4>
            <ul className="space-y-1 text-xs text-foreground-light">
              <li>• Email links or ideas to the address above</li>
              <li>• Social media links are automatically processed</li>
              <li>• Content is extracted and organized</li>
              <li>• Get notifications when new items arrive</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 