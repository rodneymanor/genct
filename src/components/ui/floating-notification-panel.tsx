"use client";

import { cubicBezier, motion } from "motion/react";
import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

export function FloatingNotificationPanel() {
  const [copied, setCopied] = useState(false);
  const ideaEmail = "ideas@yourdomain.com"; // Replace with your actual email

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ideaEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const iconVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      scale: 0.8,
      rotate: -10,
      transition: {
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  const panelVariants = {
    initial: {
      width: 56,
      height: 56,
      transition: {
        duration: 0.4,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      width: 320,
      height: 120,
      transition: {
        duration: 0.4,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  const contentVariants = {
    initial: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
    whileHover: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.15,
        duration: 0.3,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="initial"
      whileHover="whileHover"
      className="fixed bottom-6 right-6 z-50 cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface-75 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex h-full items-center p-4">
        {/* Icon Container */}
        <motion.div
          variants={iconVariants}
          className="flex h-6 w-6 shrink-0 items-center justify-center"
        >
          <Mail className="h-5 w-5 text-foreground-light" />
        </motion.div>

        {/* Expanded Content */}
        <motion.div
          variants={contentVariants}
          className="ml-4 flex flex-col gap-2 overflow-hidden"
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-foreground">
              Idea Inbox
            </h3>
            <p className="text-xs text-foreground-light">
              Send ideas directly to your inbox
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border border-border bg-background px-2 py-1">
              <span className="text-xs font-mono text-foreground-light">
                {ideaEmail}
              </span>
            </div>
            <motion.button
              onClick={handleCopyEmail}
              className="flex h-6 w-6 items-center justify-center rounded border border-border bg-background hover:bg-surface-75 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-foreground-light" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 