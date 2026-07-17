import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Deliberately dependency-free (document.execCommand) rather than pulling in
// Tiptap/Quill — this is an internal admin tool and basic bold/italic/list
// formatting covers a product description; not worth a new library.
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync from `value` once on mount only — re-syncing on every keystroke
  // would fight the browser's own cursor position. For edit mode, where
  // `value` arrives asynchronously after the product loads, the parent
  // remounts this component (via a `key` prop) once data is ready so this
  // effect re-runs exactly once with the real content.
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string) => {
    document.execCommand(command);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", label: "Bold" },
    { icon: Italic, command: "italic", label: "Italic" },
    { icon: Underline, command: "underline", label: "Underline" },
    { icon: List, command: "insertUnorderedList", label: "Bullet list" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Numbered list" },
  ];

  return (
    <div className="rounded-md border border-luxury-gold/20 bg-luxury-ink overflow-hidden transition-colors duration-300 focus-within:border-luxury-gold-bright/60">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-luxury-gold/10 bg-luxury-card/50">
        {toolbarButtons.map(({ icon: Icon, command, label }) => (
          <button
            key={command}
            type="button"
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(command)}
            className="p-1.5 rounded text-luxury-cream/70 hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors duration-300"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        className="min-h-[140px] px-3 py-2 text-luxury-cream text-sm outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-luxury-cream/40"
      />
    </div>
  );
};

export default RichTextEditor;
