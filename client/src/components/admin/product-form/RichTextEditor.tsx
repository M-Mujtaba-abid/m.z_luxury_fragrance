import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Strikethrough,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editorProps: {
      attributes: {
        class: "outline-none min-h-[140px] px-3 py-2 text-luxury-cream text-sm focus:outline-none focus:ring-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-semibold [&_p]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_blockquote]:border-l-2 [&_blockquote]:border-luxury-gold [&_blockquote]:pl-3 [&_blockquote]:italic",
        "data-placeholder": placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when props change (especially in edit mode loading)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const toolbarButtons = [
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      label: "Strikethrough",
    },
    {
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      label: "H1",
    },
    {
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      label: "Numbered List",
    },
    {
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      label: "Blockquote",
    },
    {
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
      isActive: false,
      label: "Undo",
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      isActive: false,
      label: "Redo",
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="rounded-md border border-luxury-gold/20 bg-luxury-ink overflow-hidden transition-colors duration-300 focus-within:border-luxury-gold-bright/60">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-luxury-gold/10 bg-luxury-card/50">
        {toolbarButtons.map(({ icon: Icon, onClick, isActive, label, disabled }) => (
          <button
            key={label}
            type="button"
            title={label}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={`p-1.5 rounded transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
              isActive
                ? "bg-luxury-gold text-luxury-ink"
                : "text-luxury-cream/70 hover:bg-luxury-gold/10 hover:text-luxury-gold"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
