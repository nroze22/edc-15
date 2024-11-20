import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';

interface ProtocolEditorProps {
  content: string;
  readOnly?: boolean;
  onChange?: (content: string) => void;
}

export default function ProtocolEditor({
  content,
  readOnly = false,
  onChange
}: ProtocolEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}