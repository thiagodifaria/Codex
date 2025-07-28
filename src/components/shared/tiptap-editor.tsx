
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { TiptapMenuBar } from './tiptap-menu-bar';
import { Label } from '@/components/ui/label';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapEditorProps {
  id: string;
  label?: string;
  value: string;
  onChange: (richText: string) => void;
  placeholder?: string;
  className?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-muted-foreground pl-4 italic my-4',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-4 border-border',
          },
        },
        
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something …',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm prose dark:prose-invert max-w-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label htmlFor={id} className="font-medium">{label}</Label>}
      <TiptapMenuBar editor={editor} />
      <EditorContent editor={editor} id={id} data-testid="tiptap-editor-content"/>
    </div>
  );
};
