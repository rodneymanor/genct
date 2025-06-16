"use client";

import { useState } from "react";

import {
  FolderOpen,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  BookmarkPlus,
  Image,
  Video,
  FileText,
  ExternalLink,
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

const sampleCollections = [
  {
    id: 1,
    name: "Viral TikTok Ideas",
    description: "Trending concepts and formats that are performing well",
    itemCount: 24,
    lastUpdated: "2024-01-16",
    color: "bg-red-100",
    items: [
      { type: "video", title: "Morning routine transformation", source: "TikTok" },
      { type: "image", title: "Before/after workout results", source: "Instagram" },
      { type: "text", title: "5 productivity hacks that work", source: "Note" },
    ],
  },
  {
    id: 2,
    name: "Educational Content",
    description: "Teaching formats and educational video ideas",
    itemCount: 18,
    lastUpdated: "2024-01-15",
    color: "bg-blue-100",
    items: [
      { type: "video", title: "Explaining complex topics simply", source: "YouTube" },
      { type: "text", title: "Step-by-step tutorial format", source: "Note" },
      { type: "image", title: "Infographic design inspiration", source: "Pinterest" },
    ],
  },
  {
    id: 3,
    name: "Behind the Scenes",
    description: "Raw, authentic content that builds connection",
    itemCount: 12,
    lastUpdated: "2024-01-14",
    color: "bg-green-100",
    items: [
      { type: "video", title: "My content creation process", source: "Instagram" },
      { type: "image", title: "Workspace setup reveal", source: "TikTok" },
      { type: "text", title: "Failure stories that inspire", source: "Note" },
    ],
  },
  {
    id: 4,
    name: "Growth Strategies",
    description: "Tactics and strategies for audience building",
    itemCount: 31,
    lastUpdated: "2024-01-13",
    color: "bg-purple-100",
    items: [
      { type: "text", title: "Engagement rate optimization", source: "Note" },
      { type: "video", title: "Algorithm hack that worked", source: "TikTok" },
      { type: "image", title: "Analytics screenshot examples", source: "Note" },
    ],
  },
];

const typeIcons = {
  video: Video,
  image: Image,
  text: FileText,
};

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollections = sampleCollections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateCollection = () => {
    alert("Create new collection dialog would open here");
  };

  const handleCollectionAction = (action: string, collection: any) => {
    switch (action) {
      case "edit":
        alert(`Edit collection: ${collection.name}`);
        break;
      case "share":
        alert(`Share collection: ${collection.name}`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete "${collection.name}"?`)) {
          alert("Collection deleted");
        }
        break;
    }
  };

  const selectedCollectionData = selectedCollection ? sampleCollections.find((c) => c.id === selectedCollection) : null;

  if (selectedCollection && selectedCollectionData) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCollection(null)}>
              ← Back to Collections
            </Button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">{selectedCollectionData.name}</h1>
              <p className="text-muted-foreground">
                {selectedCollectionData.itemCount} items • Updated{" "}
                {new Date(selectedCollectionData.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>{selectedCollectionData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @5xl/main:grid-cols-3">
              {selectedCollectionData.items.map((item, index) => {
                const IconComponent = typeIcons[item.type as keyof typeof typeIcons];
                return (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <IconComponent className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="text-muted-foreground text-xs">{item.source}</p>
                    </div>
                    <ExternalLink className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Organize and save inspiring content from across the web.</p>
        </div>
        <Button onClick={handleCreateCollection}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Collections Grid */}
      {filteredCollections.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="text-muted-foreground mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "No collections match your search" : "No collections yet"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first collection to organize inspiration"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @5xl/main:grid-cols-3">
          {filteredCollections.map((collection) => (
            <Card
              key={collection.id}
              className="group cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedCollection(collection.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${collection.color}`} />
                    <div className="flex-1">
                      <CardTitle className="text-base">{collection.name}</CardTitle>
                      <CardDescription className="text-xs">{collection.itemCount} items</CardDescription>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCollectionAction("edit", collection)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCollectionAction("share", collection)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCollectionAction("delete", collection)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground line-clamp-2 text-sm">{collection.description}</p>

                <div className="space-y-2">
                  {collection.items.slice(0, 2).map((item, index) => {
                    const IconComponent = typeIcons[item.type as keyof typeof typeIcons];
                    return (
                      <div key={index} className="text-muted-foreground flex items-center gap-2 text-xs">
                        <IconComponent className="h-3 w-3" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    );
                  })}
                  {collection.items.length > 2 && (
                    <p className="text-muted-foreground text-xs">+{collection.items.length - 2} more items</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    {collection.itemCount} items
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {new Date(collection.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
