"use client";

import { useState } from "react";

import { Mail, Send, Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useCollections } from "@/hooks/use-collections";

interface ProcessedResult {
  success: boolean;
  message: string;
  extractedCount: number;
  collectionId?: string;
}

interface EmailHistoryItem {
  id: string;
  from: string;
  subject: string;
  processedAt: string;
  extractedCount: number;
}

export default function EmailDemoPage() {
  const { user } = useAuth();
  const { processEmailLinks, getEmailHistory } = useCollections();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);
  
  // Demo form data
  const [demoEmail, setDemoEmail] = useState({
    from: "user@example.com",
    to: user ? `${user.uid}@gencapp.pro` : "demo@gencapp.pro",
    subject: "Cool social media content",
    body: `Check out these amazing videos:

https://www.instagram.com/p/Cxo55OIt_Mj/
https://www.tiktok.com/@rywiggs/video/7514718812990754078

Let me know what you think!`,
  });

  const handleProcessDemo = async () => {
    if (!user) {
      toast.error("Please log in to test email processing");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Simulate email processing
      const processed = await processEmailLinks({
        from: demoEmail.from,
        to: demoEmail.to,
        subject: demoEmail.subject,
        body: demoEmail.body,
        userId: user.uid,
      });

      setResult(processed);
      
      if (processed.success) {
        toast.success(`Successfully processed email! Extracted ${processed.extractedCount} items.`);
        // Refresh email history
        const history = await getEmailHistory(user.uid);
        setEmailHistory(history);
      } else {
        toast.error(processed.message);
      }
    } catch (error) {
      console.error("Email processing error:", error);
      setResult({
        success: false,
        message: "Failed to process email",
        extractedCount: 0,
      });
      toast.error("Failed to process email");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadEmailHistory = async () => {
    if (!user) return;
    
    try {
      const history = await getEmailHistory(user.uid);
      setEmailHistory(history);
    } catch (error) {
      console.error("Failed to load email history:", error);
    }
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Email Processing Demo</h1>
          <p className="text-muted-foreground">
            Test the email-to-collection feature with sample social media links.
          </p>
        </div>
      </div>

      {/* User Email Info */}
      {user && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Your Email Alias</CardTitle>
            </div>
            <CardDescription>
              Send emails to this address to automatically add social media links to your collections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                {user.uid}@gencapp.pro
              </span>
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(`${user.uid}@gencapp.pro`);
                toast.success("Email copied to clipboard!");
              }}>
                Copy Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Demo Email Form */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Email</CardTitle>
            <CardDescription>
              Simulate sending an email with social media links to test the processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  value={demoEmail.from}
                  onChange={(e) => setDemoEmail({ ...demoEmail, from: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  value={demoEmail.to}
                  onChange={(e) => setDemoEmail({ ...demoEmail, to: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={demoEmail.subject}
                onChange={(e) => setDemoEmail({ ...demoEmail, subject: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                rows={8}
                value={demoEmail.body}
                onChange={(e) => setDemoEmail({ ...demoEmail, body: e.target.value })}
                placeholder="Paste your email content with social media links here..."
              />
            </div>

            <Button 
              onClick={handleProcessDemo} 
              disabled={isProcessing || !user}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Email...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Process Demo Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Processing Result */}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <CardTitle className="text-base">
                    {result.success ? "Processing Successful" : "Processing Failed"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                {result.success && result.extractedCount > 0 && (
                  <p className="text-sm">
                    <strong>Extracted:</strong> {result.extractedCount} social media items
                  </p>
                )}
                {result.collectionId && (
                  <p className="text-sm">
                    <strong>Added to collection:</strong> {result.collectionId}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Email History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Email History</CardTitle>
                <CardDescription>Recently processed emails</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadEmailHistory}>
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {emailHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No emails processed yet
                </p>
              ) : (
                <div className="space-y-2">
                  {emailHistory.map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{email.subject}</p>
                        <p className="text-xs text-muted-foreground">From: {email.from}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {email.extractedCount} items
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(email.processedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Send an email to your unique alias address</p>
              <p>2. Include Instagram or TikTok links in the email body</p>
              <p>3. Our system extracts content metadata automatically</p>
              <p>4. Content is added to your &quot;Email Inbox&quot; collection</p>
              <p>5. You can organize items into other collections later</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 