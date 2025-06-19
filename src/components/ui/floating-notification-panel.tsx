"use client";

import { motion, AnimatePresence } from "motion/react";
import { Mail, X, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useAuth } from "@/contexts/auth-context";

interface FloatingNotificationPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  notifications?: Array<{
    id: string;
    type: 'email' | 'social_link' | 'idea';
    title: string;
    content: string;
    timestamp: Date;
    read: boolean;
  }>;
}

export function FloatingNotificationPanel({ 
  isOpen: propIsOpen, 
  onClose: propOnClose, 
  notifications = [] 
}: FloatingNotificationPanelProps = {}) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalNotifications, setInternalNotifications] = useState<typeof notifications>([]);
  
  // Use prop values if provided, otherwise use internal state
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const onClose = propOnClose || (() => setInternalIsOpen(false));
  const displayNotifications = notifications.length > 0 ? notifications : internalNotifications;
  
  // Use user-specific email alias or default for demo
  const ideaEmail = user?.email === "rodney@rodneymanor.com" 
    ? "rodney@gencapp.pro" 
    : user?.uid 
    ? `${user.uid}@gencapp.pro` 
    : "ideas@gencapp.pro";

  // Load expanded state from localStorage per user
  useEffect(() => {
    if (user?.uid) {
      const savedState = localStorage.getItem(`floating-notification-expanded-${user.uid}`);
      if (savedState !== null) {
        setIsExpanded(JSON.parse(savedState));
      }
    }
  }, [user?.uid]);

  // Save expanded state to localStorage when it changes
  useEffect(() => {
    if (user?.uid) {
      localStorage.setItem(`floating-notification-expanded-${user.uid}`, JSON.stringify(isExpanded));
    }
  }, [isExpanded, user?.uid]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ideaEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const unreadCount = displayNotifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4
          }}
          className="fixed top-4 right-4 z-50 w-96 max-h-[600px] overflow-hidden"
        >
          <div className="relative">
            {/* Shine Border Effect */}
            <ShineBorder
              borderWidth={2}
              duration={10}
              shineColor={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"]}
              className="rounded-xl"
            />
            
            <div className="relative bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Mail className="h-5 w-5 text-primary" />
                    {unreadCount > 0 && (
                      <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Idea Inbox
                    </h3>
                    <p className="text-xs text-foreground-light">
                      {displayNotifications.length} total, {unreadCount} unread
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleExpanded}
                    className="h-7 w-7 p-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Collapsible Content */}
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="overflow-hidden"
              >
                <div className="max-h-96 overflow-y-auto">
                  {/* Email Setup Section */}
                  <div className="p-4 border-b border-border bg-surface-75/50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-foreground">
                          Your Inbox Email
                        </h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyEmail}
                          className="h-6 px-2 text-xs"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="rounded-md border border-border bg-background px-3 py-2">
                        <span className="text-sm font-mono text-foreground">
                          {ideaEmail}
                        </span>
                      </div>
                      <p className="text-xs text-foreground-light">
                        Send ideas, links, or social media content to this address
                      </p>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="p-4 space-y-3">
                    {displayNotifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Mail className="h-8 w-8 text-foreground-light mx-auto mb-3" />
                        <p className="text-sm text-foreground-light">
                          No notifications yet
                        </p>
                        <p className="text-xs text-foreground-light mt-1">
                          Email ideas to {ideaEmail} to get started
                        </p>
                      </div>
                    ) : (
                      displayNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border transition-colors ${
                            notification.read 
                              ? 'border-border bg-background' 
                              : 'border-primary/30 bg-primary/5'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.read ? 'bg-foreground-light' : 'bg-primary'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-sm font-medium text-foreground truncate">
                                  {notification.title}
                                </h5>
                                <span className="text-xs text-foreground-light ml-2">
                                  {notification.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-foreground-light line-clamp-2">
                                {notification.content}
                              </p>
                              <div className="flex items-center mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  notification.type === 'email' 
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : notification.type === 'social_link'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                  {notification.type.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* User Account Info */}
                  {user && (
                    <div className="p-4 border-t border-border bg-surface-75/30">
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-foreground">
                          Account Status
                        </h4>
                        <div className="text-xs text-foreground-light space-y-1">
                          <p>✓ Logged in as: {user.email}</p>
                          <p>✓ Email processing: Active</p>
                          <p>✓ Inbox: {ideaEmail}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 