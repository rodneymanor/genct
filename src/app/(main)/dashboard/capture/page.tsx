"use client";

import Link from "next/link";

import { FileText, Mic, Plus, Sparkles, Clock, Tag, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickRecordButton } from "@/components/ui/quick-record-button";

export default function CapturePage() {
  const recentCaptures = [
    {
      id: 1,
      type: "note",
      title: "Content Strategy Ideas",
      preview: "Key insights about audience engagement and trending topics...",
      createdAt: "2 hours ago",
      tags: ["strategy", "audience"],
    },
    {
      id: 2,
      type: "recording",
      title: "Morning Voice Memo",
      duration: "3:24",
      createdAt: "5 hours ago",
      tags: ["ideas", "morning"],
    },
    {
      id: 3,
      type: "note",
      title: "Video Script Outline",
      preview: "Structure for next week's educational content series...",
      createdAt: "1 day ago",
      tags: ["script", "education"],
    },
    {
      id: 4,
      type: "recording",
      title: "Interview Notes",
      duration: "12:15",
      createdAt: "2 days ago",
      tags: ["interview", "research"],
    },
  ];

  return (
    <>
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Capture</h1>
            <p className="text-muted-foreground">Record voice memos and capture notes for your content creation</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link href="/dashboard/capture/notes">
            <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Quick Note</CardTitle>
                    <p className="text-muted-foreground text-sm">Capture ideas and insights</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/capture/record">
            <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <Mic className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Voice Recording</CardTitle>
                    <p className="text-muted-foreground text-sm">Record with live transcription</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Captures */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Captures</CardTitle>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCaptures.map((capture) => (
                <div
                  key={capture.id}
                  className="hover:bg-muted/50 flex items-start gap-4 rounded-lg p-3 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      capture.type === "note" ? "bg-primary/10" : "bg-orange-100 dark:bg-orange-900/20"
                    }`}
                  >
                    {capture.type === "note" ? (
                      <FileText className="text-primary h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{capture.title}</h3>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        {capture.createdAt}
                      </div>
                    </div>

                    {capture.type === "note" ? (
                      <p className="text-muted-foreground line-clamp-2 text-sm">{capture.preview}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-sm">{capture.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {capture.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Quick Record Button */}
      <QuickRecordButton />
    </>
  );
}
