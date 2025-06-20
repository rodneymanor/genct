"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleHelp, Inbox, Mail, Copy, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Notification {
  id: string;
  type: 'email' | 'social_link' | 'idea';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export default function HelpNotificationsButtons() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState<Notification[]>([]);
  
  // Use user-specific email alias or default for demo
  const ideaEmail = user?.email === "rodney@rodneymanor.com" 
    ? "rodney@gencapp.pro" 
    : user?.uid 
    ? `${user.uid}@gencapp.pro` 
    : "ideas@gencapp.pro";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ideaEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const unreadEmailCount = emailNotifications.filter(n => !n.read).length;

  return (
    <TooltipProvider>
      <div className="overflow-hidden inline-flex items-center rounded-full border">
        {/* Help Button */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative justify-center cursor-pointer inline-flex items-center text-center font-normal ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border-transparent text-xs px-2.5 py-1 rounded-none w-[32px] h-[30px] group pointer-events-auto hover:bg-muted data-[state=open]:bg-muted"
                >
                  <CircleHelp className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Help & Support</h4>
              <p className="text-sm text-muted-foreground">
                Get help with your account, billing, and technical issues.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Documentation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Community Forum
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Notifications Button */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative justify-center cursor-pointer inline-flex items-center text-center font-normal ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border-transparent text-xs py-1 rounded-none h-[30px] w-[32px] group px-1 pointer-events-auto hover:bg-muted data-[state=open]:bg-muted"
                >
                  <Inbox className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Notifications</h4>
              <p className="text-sm text-muted-foreground">You have no new notifications.</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 rounded-md border">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Welcome to the platform!</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-md">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System maintenance scheduled</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Mail/Email Inbox Button */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative justify-center cursor-pointer inline-flex items-center text-center font-normal ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border-transparent text-xs py-1 rounded-none h-[30px] w-[32px] group px-1 pointer-events-auto hover:bg-muted data-[state=open]:bg-muted"
                >
                  <Mail className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                  {unreadEmailCount > 0 && (
                    <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadEmailCount > 9 ? '9+' : unreadEmailCount}
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Email Inbox</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-96 max-h-[500px] bg-background border border-border shadow-lg" align="end">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="relative">
                  <Mail className="h-5 w-5 text-primary" />
                  {unreadEmailCount > 0 && (
                    <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadEmailCount > 9 ? '9+' : unreadEmailCount}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Email Inbox
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Send ideas directly via email
                  </p>
                </div>
              </div>

              {/* Email Setup Section */}
              <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-foreground">
                    Your Email Address
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
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Send ideas, links, or content to this address</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• Social media links are auto-processed</li>
                    <li>• Ideas are organized automatically</li>
                    <li>• Get notified when content arrives</li>
                  </ul>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {emailNotifications.length === 0 ? (
                  <div className="text-center py-6">
                    <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No emails yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try sending an idea to {ideaEmail}
                    </p>
                  </div>
                ) : (
                  emailNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.read 
                          ? 'border-border bg-background' 
                          : 'border-primary/30 bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.read ? 'bg-muted-foreground' : 'bg-primary'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-sm font-medium text-foreground truncate">
                              {notification.title}
                            </h5>
                            <span className="text-xs text-muted-foreground ml-2">
                              {notification.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
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
                    </div>
                  ))
                )}
              </div>


            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  )
} 