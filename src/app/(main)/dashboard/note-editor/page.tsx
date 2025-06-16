"use client";

import { useState } from "react";

import { SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/editor-00/editor";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function NoteEditorPage() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

  return (
    <div className="flex h-full flex-col">
      <Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />
    </div>
  );
}
