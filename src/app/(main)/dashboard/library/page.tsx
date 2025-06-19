"use client";

import { useState } from "react";

import Link from "next/link";

import { 
  ScrollText, 
  Mic, 
  FileText, 
  Plus, 
  MoreHorizontal, 
  Play,
  Pause,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with real data from your backend
const mockScripts = [
  {
    id: "1",
    title: "Tech Explained: AI Fundamentals",
    status: "completed",
    lastUpdated: "2024-01-15",
    description: "A comprehensive guide to AI basics"
  },
  {
    id: "2", 
    title: "Wellness Tips: Morning Routine",
    status: "draft",
    lastUpdated: "2024-01-14",
    description: "Creating the perfect morning routine"
  },
  {
    id: "3",
    title: "Productivity Hacks for Developers",
    status: "in-progress",
    lastUpdated: "2024-01-13",
    description: "Boost your coding productivity"
  }
];

const mockRecordings = [
  {
    id: "1",
    title: "Interview with Tech Expert",
    duration: "15:30",
    date: "2024-01-15",
    status: "processed"
  },
  {
    id: "2",
    title: "Podcast Draft Recording",
    duration: "8:45",
    date: "2024-01-14",
    status: "processing"
  },
  {
    id: "3",
    title: "Voice Notes - Project Ideas",
    duration: "3:22",
    date: "2024-01-13",
    status: "processed"
  }
];

const mockNotes = [
  {
    id: "1",
    title: "Content Strategy Ideas",
    excerpt: "Brainstorming session for Q1 content calendar. Focus on educational content that provides real value...",
    lastUpdated: "2024-01-15",
    tags: ["strategy", "content"]
  },
  {
    id: "2",
    title: "Research Notes: AI Trends",
    excerpt: "Latest developments in AI technology. Key findings from recent papers and industry reports...",
    lastUpdated: "2024-01-14",
    tags: ["research", "ai"]
  },
  {
    id: "3",
    title: "Meeting Notes: Team Sync",
    excerpt: "Weekly team meeting discussion points. Action items and project updates...",
    lastUpdated: "2024-01-13",
    tags: ["meeting", "team"]
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: { variant: "default" as const, label: "Completed" },
    draft: { variant: "secondary" as const, label: "Draft" },
    "in-progress": { variant: "outline" as const, label: "In Progress" },
    processed: { variant: "default" as const, label: "Processed" },
    processing: { variant: "outline" as const, label: "Processing" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("scripts");

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <p className="text-muted-foreground">
            Manage your scripts, recordings, and notes all in one place.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scripts" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Scripts
          </TabsTrigger>
          <TabsTrigger value="recordings" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Recordings
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scripts</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Script
            </Button>
          </div>
          
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockScripts.map((script) => (
                  <TableRow key={script.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Link 
                          href={`/dashboard/scripts/${script.id}`}
                          className="font-medium hover:underline"
                        >
                          {script.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {script.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(script.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(script.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recordings</h2>
            <Button>
              <Mic className="h-4 w-4 mr-2" />
              Start New Recording
            </Button>
          </div>
          
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecordings.map((recording) => (
                  <TableRow key={recording.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <span className="font-medium">{recording.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {recording.duration}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(recording.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(recording.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notes</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {note.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(note.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 