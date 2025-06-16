'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Editor } from '@/components/blocks/editor-00/editor';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Star, 
  Calendar,
  Tag,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditorState, SerializedEditorState } from 'lexical';

interface Note {
  id: string;
  title: string;
  content: SerializedEditorState;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export default function NoteEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editorState, setEditorState] = useState<EditorState | undefined>();
  const [serializedEditorState, setSerializedEditorState] = useState<SerializedEditorState | undefined>();
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("Untitled Note");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  // Get note ID from URL params
  const noteId = searchParams.get('id');
  const isNewNote = !noteId || noteId === 'new';

  // Load existing note or initialize new note
  useEffect(() => {
    if (isNewNote) {
      // Initialize new note
      setTitle('');
      setTags([]);
      setIsFavorite(false);
      setSerializedEditorState(undefined);
      setIsLoading(false);
    } else {
      // Load existing note (mock data for now)
      loadNote(noteId);
    }
  }, [noteId, isNewNote]);

  useEffect(() => {
    setWordCount(content.split(/\s+/).filter(word => word.length > 0).length);
    setCharCount(content.length);
  }, [content]);

  const loadNote = async (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock note data
    const mockNote: Note = {
      id,
      title: 'Sample Note Title',
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "This is a sample note content. You can edit this text and add formatting.",
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1
        }
      },
      tags: ['sample', 'demo'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isFavorite: false,
    };
    
    setNote(mockNote);
    setTitle(mockNote.title);
    setTags(mockNote.tags);
    setIsFavorite(mockNote.isFavorite);
    setSerializedEditorState(mockNote.content);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a note title');
      return;
    }

    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const noteData: Note = {
      id: noteId || Date.now().toString(),
      title: title.trim(),
      content: serializedEditorState || {
        root: {
          children: [],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1
        }
      },
      tags,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date(),
      isFavorite,
    };

    console.log('Saving note:', noteData);
    
    setIsSaving(false);
    
    // Navigate back to notes page
    router.push('/dashboard/capture/notes');
  };

  const handleDelete = async () => {
    if (!note) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      // Simulate delete operation
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard/capture/notes');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleExport = (format: 'txt' | 'md' | 'pdf') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFileName = `${fileName}-${timestamp}`;
    
    if (format === 'txt' || format === 'md') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${finalFileName}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const stats = [
    { label: "Words", value: wordCount.toString() },
    { label: "Characters", value: charCount.toString() },
    { label: "Lines", value: (content.match(/\n/g)?.length ?? 0).toString() },
    { label: "Reading Time", value: `${Math.ceil(wordCount / 200)} min` }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {isNewNote ? 'New Note' : `Last edited ${note?.updatedAt.toLocaleDateString()}`}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            className="h-8 w-8"
          >
            <Star 
              className={cn(
                "w-4 h-4",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )} 
            />
          </Button>
          
          {!isNewNote && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          
          <Button 
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
        {/* Title */}
        <div>
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none shadow-none px-0 h-auto py-2 focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tags</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-7 w-24 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddTag}
                className="h-7 w-7"
                disabled={!newTag.trim()}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Editor */}
        <div className="flex-1 min-h-[400px]">
          <Editor
            editorSerializedState={serializedEditorState}
            onSerializedChange={setSerializedEditorState}
          />
        </div>
      </div>
    </div>
  );
} 