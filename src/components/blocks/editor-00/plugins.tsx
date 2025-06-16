import { useState } from "react";

import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { $isHeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Undo, Redo } from "lucide-react";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const placeholder = "Start writing your note...";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as any);
  };

  const formatHeading = (headingSize: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize as any));
      }
    });
  };

  const formatList = (listType: "bullet" | "number") => {
    if (listType === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="bg-background sticky top-0 z-10 flex gap-2 overflow-auto border-b p-2">
      <Button variant="ghost" size="sm" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Redo className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="sm" onClick={() => formatHeading("h1")}>
        H1
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatHeading("h2")}>
        H2
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatHeading("h3")}>
        H3
      </Button>
      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="sm" onClick={() => formatText("bold")}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText("italic")}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText("underline")}>
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText("strikethrough")}>
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-8" />

      <Button variant="ghost" size="sm" onClick={() => formatList("bullet")}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatList("number")}>
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ToolbarPlugin />
      <div className="relative flex-1">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="h-full">
              <div className="h-full" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-full min-h-full overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ListPlugin />
        <TabIndentationPlugin />
        <HistoryPlugin />
      </div>
    </div>
  );
}
