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
  Mail,
  Link,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useCollections } from "@/hooks/use-collections";

const typeIcons = {
  video: Video,
  image: Image,
  text: FileText,
};

const colorOptions = [
  { value: "bg-red-100", label: "Red", class: "bg-red-100" },
  { value: "bg-blue-100", label: "Blue", class: "bg-blue-100" },
  { value: "bg-green-100", label: "Green", class: "bg-green-100" },
  { value: "bg-purple-100", label: "Purple", class: "bg-purple-100" },
  { value: "bg-yellow-100", label: "Yellow", class: "bg-yellow-100" },
  { value: "bg-pink-100", label: "Pink", class: "bg-pink-100" },
];

export default function CollectionsPage() {
  const { user } = useAuth();
  const {
    collections,
    loading,
    error,
    createCollection,
    addItemsToCollection,
    removeItemFromCollection,
    extractSocialMediaContent,
  } = useCollections();

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddLinksDialog, setShowAddLinksDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingLinks, setIsAddingLinks] = useState(false);

  // Form states
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [newCollectionColor, setNewCollectionColor] = useState("bg-blue-100");
  const [linksToAdd, setLinksToAdd] = useState("");

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error("Collection name is required");
      return;
    }

    setIsCreating(true);
    try {
      await createCollection(newCollectionName, newCollectionDescription, newCollectionColor);
      toast.success("Collection created successfully!");
      setShowCreateDialog(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setNewCollectionColor("bg-blue-100");
    } catch (error) {
      toast.error("Failed to create collection");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddLinks = async () => {
    if (!linksToAdd.trim() || !selectedCollection) {
      toast.error("Please enter some links");
      return;
    }

    setIsAddingLinks(true);
    try {
      // Extract URLs from the text
      const urlRegex = /https?:\/\/[^\s]+/g;
      const urls = linksToAdd.match(urlRegex) || [];

      if (urls.length === 0) {
        toast.error("No valid URLs found");
        return;
      }

      // Extract content from social media URLs
      const extractedContent = await extractSocialMediaContent(urls);

      if (extractedContent.length === 0) {
        toast.error("No content could be extracted from the provided links");
        return;
      }

      // Add extracted content to collection
      await addItemsToCollection(selectedCollection, extractedContent);
      
      toast.success(`Added ${extractedContent.length} items to collection`);
      setShowAddLinksDialog(false);
      setLinksToAdd("");
    } catch (error) {
      toast.error("Failed to add links to collection");
      console.error(error);
    } finally {
      setIsAddingLinks(false);
    }
  };

  const handleRemoveItem = async (collectionId: string, itemId: string) => {
    try {
      await removeItemFromCollection(collectionId, itemId);
      toast.success("Item removed from collection");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error(error);
    }
  };

  const selectedCollectionData = selectedCollection ? collections.find((c) => c.id === selectedCollection) : null;

  if (loading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-center py-16">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

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
                {new Date(selectedCollectionData.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={showAddLinksDialog} onOpenChange={setShowAddLinksDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link className="mr-2 h-4 w-4" />
                  Add Links
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Social Media Links</DialogTitle>
                  <DialogDescription>
                    Paste Instagram or TikTok links and we&apos;ll extract the content automatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="links">Links</Label>
                    <Textarea
                      id="links"
                      placeholder="Paste Instagram or TikTok links here, one per line..."
                      value={linksToAdd}
                      onChange={(e) => setLinksToAdd(e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddLinksDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLinks} disabled={isAddingLinks}>
                    {isAddingLinks && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Links
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
            {selectedCollectionData.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FolderOpen className="text-muted-foreground mb-3 h-12 w-12" />
                <p className="text-muted-foreground text-sm">No items in this collection yet</p>
                <p className="text-muted-foreground mt-1 text-xs">Add some social media links to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @5xl/main:grid-cols-3">
                {selectedCollectionData.items.map((item) => {
                  const IconComponent = item.platform === 'instagram' ? Image : item.platform === 'tiktok' ? Video : FileText;
                  return (
                    <div
                      key={item.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="text-muted-foreground h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="text-muted-foreground text-xs capitalize">{item.platform}</p>
                        {item.author && (
                          <p className="text-muted-foreground text-xs">by {item.author}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.url, '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(selectedCollectionData.id!, item.id!)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>
                Create a new collection to organize your social media inspiration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this collection is for..."
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCollectionColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                        newCollectionColor === color.value ? 'border-primary' : 'border-border'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCollection} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Email Inbox Notice */}
      {user && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Email to Collection</CardTitle>
            </div>
            <CardDescription>
              Send social media links to your email and they&apos;ll automatically be added to your &quot;Email Inbox&quot; collection.
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
              onClick={() => setSelectedCollection(collection.id!)}
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
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
                    const IconComponent = item.platform === 'instagram' ? Image : item.platform === 'tiktok' ? Video : FileText;
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
                    {new Date(collection.updatedAt).toLocaleDateString()}
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
