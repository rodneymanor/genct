"use client";

import { cubicBezier, motion } from "motion/react";
import { Mail, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function NotificationButton() {
  const [copied, setCopied] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const ideaEmail = "ideas@yourdomain.com"; // Replace with your actual email

  // Simulate checking for new email notifications
  useEffect(() => {
    // This would be replaced with actual email checking logic
    const checkForNotifications = () => {
      // Simulate random notifications for demo
      const hasNew = Math.random() > 0.7;
      if (hasNew && !hasNotifications) {
        setHasNotifications(true);
        setNotificationCount(prev => prev + 1);
      }
    };

    const interval = setInterval(checkForNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [hasNotifications]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ideaEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && hasNotifications) {
      // Mark notifications as read when opened
      setHasNotifications(false);
      setNotificationCount(0);
    }
  };

  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { scale: 0, opacity: 0 }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 p-0 hover:bg-surface-75"
        >
          <Mail className="h-4 w-4 text-foreground-light" />
          
          {/* Notification Badge */}
          {hasNotifications && (
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center"
            >
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="absolute h-full w-full rounded-full bg-red-500 opacity-75"
              />
              <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </div>
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-4" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Idea Inbox
            </h3>
            <p className="text-xs text-foreground-light">
              Send ideas and social links directly to your inbox via email
            </p>
          </div>
          
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
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyEmail}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-foreground">
              How it works:
            </h4>
            <ul className="space-y-1 text-xs text-foreground-light">
              <li>• Email links or ideas to the address above</li>
              <li>• Social media links are automatically processed</li>
              <li>• Content is extracted and organized</li>
              <li>• Notifications appear when new items arrive</li>
            </ul>
          </div>

          {/* Recent Activity */}
          {hasNotifications && (
            <div className="space-y-2 border-t border-border pt-3">
              <h4 className="text-xs font-medium text-foreground">
                Recent Activity
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-foreground-light">
                    New social link processed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 