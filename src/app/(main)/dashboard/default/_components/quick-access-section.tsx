import Link from "next/link";

import { ScrollText, FileText, Mic, Sparkles, ArrowRight, Clock, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickAccessSection() {
  return (
    <div className="grid grid-cols-1 gap-6 @5xl/main:grid-cols-3">
      {/* Recent Scripts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="text-muted-foreground h-5 w-5" />
              <CardTitle className="text-base">Recent Scripts</CardTitle>
            </div>
            <Link href="/dashboard/scripts" className="text-primary flex items-center gap-1 text-sm hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors">
            <div className="space-y-1">
              <p className="text-sm font-medium">Morning Routine Tips</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>2 hours ago</span>
              </div>
            </div>
            <Badge variant="secondary">Completed</Badge>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors">
            <div className="space-y-1">
              <p className="text-sm font-medium">Productivity Hacks</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>1 day ago</span>
              </div>
            </div>
            <Badge variant="outline">In Progress</Badge>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors">
            <div className="space-y-1">
              <p className="text-sm font-medium">Mindfulness Exercises</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>3 days ago</span>
              </div>
            </div>
            <Badge variant="secondary">Completed</Badge>
          </div>

          <div className="pt-2">
            <p className="text-muted-foreground text-center text-xs">You&apos;ve been productive! 🎉</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Captures */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-5 w-5" />
              <CardTitle className="text-base">Recent Captures</CardTitle>
            </div>
            <Link href="/dashboard/capture" className="text-primary flex items-center gap-1 text-sm hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted/30 hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
              <FileText className="text-primary h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Video editing workflow</p>
              <p className="text-muted-foreground line-clamp-2 text-xs">
                Notes about streamlining the editing process...
              </p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3" />
                <span>Yesterday</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/20">
              <Mic className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Content ideas voice memo</p>
              <p className="text-muted-foreground text-xs">Recording • 2:34 duration</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3" />
                <span>2 days ago</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
              <FileText className="text-primary h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Target audience insights</p>
              <p className="text-muted-foreground line-clamp-2 text-xs">Key demographics and preferences research...</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3" />
                <span>1 week ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-muted-foreground h-5 w-5" />
              <CardTitle className="text-base">AI Suggestions</CardTitle>
            </div>
            <Link
              href="/dashboard/inspiration/ai-suggestions"
              className="text-primary flex items-center gap-1 text-sm hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CardDescription>Fresh ideas to spark your creativity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-primary/20 bg-primary/5 hover:bg-primary/10 cursor-pointer rounded-lg border border-dashed p-4 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary h-4 w-4" />
                <Badge variant="outline" className="text-xs">
                  Trending
                </Badge>
              </div>
              <p className="text-sm font-medium">&quot;5 Morning Habits That Changed My Life&quot;</p>
              <p className="text-muted-foreground text-xs">Perfect for lifestyle and wellness content</p>
            </div>
          </div>

          <div className="border-muted-foreground/20 bg-muted/10 hover:bg-muted/20 cursor-pointer rounded-lg border border-dashed p-4 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="text-muted-foreground h-4 w-4" />
                <Badge variant="secondary" className="text-xs">
                  Educational
                </Badge>
              </div>
              <p className="text-sm font-medium">&quot;The Psychology Behind Viral Content&quot;</p>
              <p className="text-muted-foreground text-xs">Deep dive into content creation strategies</p>
            </div>
          </div>

          <div className="border-muted-foreground/20 bg-muted/10 hover:bg-muted/20 cursor-pointer rounded-lg border border-dashed p-4 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="text-muted-foreground h-4 w-4" />
                <Badge variant="secondary" className="text-xs">
                  Quick Tips
                </Badge>
              </div>
              <p className="text-sm font-medium">&quot;3 Editing Tricks for Better Engagement&quot;</p>
              <p className="text-muted-foreground text-xs">Technical tips that boost viewer retention</p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-muted-foreground text-xs">New ideas refresh every 24 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
