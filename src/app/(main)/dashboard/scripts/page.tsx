"use client";

import { useState } from "react";

import {
  ScrollText,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Download,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Clock,
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
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sampleScripts = [
  {
    id: 1,
    title: "5 Morning Habits That Changed My Life",
    status: "completed",
    createdAt: "2024-01-15",
    lastEdited: "2024-01-16",
    words: 342,
    views: 12400,
    engagement: 4.8,
    platform: "TikTok",
  },
  {
    id: 2,
    title: "The Psychology Behind Viral Content",
    status: "draft",
    createdAt: "2024-01-14",
    lastEdited: "2024-01-14",
    words: 287,
    views: 0,
    engagement: 0,
    platform: "Instagram",
  },
  {
    id: 3,
    title: "3 Editing Tricks for Better Engagement",
    status: "in-progress",
    createdAt: "2024-01-13",
    lastEdited: "2024-01-15",
    words: 195,
    views: 8900,
    engagement: 3.2,
    platform: "TikTok",
  },
  {
    id: 4,
    title: "Why 99% of Creators Fail (and how to be the 1%)",
    status: "completed",
    createdAt: "2024-01-12",
    lastEdited: "2024-01-13",
    words: 456,
    views: 25600,
    engagement: 6.1,
    platform: "Instagram",
  },
  {
    id: 5,
    title: "My Biggest Social Media Mistake",
    status: "completed",
    createdAt: "2024-01-10",
    lastEdited: "2024-01-11",
    words: 298,
    views: 18200,
    engagement: 5.4,
    platform: "TikTok",
  },
];

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "default" as const },
  completed: { label: "Completed", variant: "outline" as const },
};

export default function ScriptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredScripts = sampleScripts.filter((script) => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || script.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: string, script: any) => {
    switch (action) {
      case "edit":
        window.location.href = `/dashboard/scripts/editor/${script.id}`;
        break;
      case "view":
        window.location.href = `/dashboard/scripts/view/${script.id}`;
        break;
      case "copy":
        alert(`Copied "${script.title}" to clipboard`);
        break;
      case "download":
        alert(`Downloading "${script.title}"`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete "${script.title}"?`)) {
          alert("Script deleted");
        }
        break;
    }
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Scripts</h1>
          <p className="text-muted-foreground">Manage all your generated scripts in one place.</p>
        </div>
        <Button onClick={() => (window.location.href = "/dashboard/new-script")}>
          <Plus className="mr-2 h-4 w-4" />
          New Script
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scripts</CardTitle>
            <ScrollText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleScripts.length}</div>
            <p className="text-muted-foreground text-xs">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.1K</div>
            <p className="text-muted-foreground text-xs">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9%</div>
            <p className="text-muted-foreground text-xs">+0.3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-muted-foreground text-xs">4 of 5 scripts completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Script Library</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Search scripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedStatus === "all"
                      ? "All"
                      : statusConfig[selectedStatus as keyof typeof statusConfig]?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All Scripts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("completed")}>Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("in-progress")}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("draft")}>Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredScripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ScrollText className="text-muted-foreground mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "No scripts match your search" : "No scripts yet"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {searchQuery ? "Try adjusting your search terms" : "Create your first script to get started"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Words</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                  <TableHead>Last Edited</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScripts.map((script) => (
                  <TableRow key={script.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate">{script.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[script.status as keyof typeof statusConfig].variant}>
                        {statusConfig[script.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{script.platform}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{script.words}</TableCell>
                    <TableCell className="text-right">
                      {script.views > 0 ? script.views.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {script.engagement > 0 ? `${script.engagement}%` : "-"}
                    </TableCell>
                    <TableCell>{new Date(script.lastEdited).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("view", script)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("edit", script)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("copy", script)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("download", script)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("delete", script)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
