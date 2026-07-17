import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label, values, onChange, placeholder }) => {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || values.includes(tag)) return;
    onChange([...values, tag]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => onChange(values.filter((v) => v !== tag));

  return (
    <div>
      <label className="block text-sm font-medium text-luxury-cream/80 mb-2">{label}</label>
      <div className="w-full min-h-[44px] px-2 py-1.5 rounded-md border border-luxury-gold/20 bg-luxury-ink flex flex-wrap items-center gap-1.5 transition-colors duration-300 focus-within:border-luxury-gold-bright/60">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-sm rounded-full pl-3 pr-1.5 py-0.5"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-luxury-gold-bright transition-colors duration-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-luxury-cream placeholder:text-luxury-cream/40 text-sm py-1"
        />
      </div>
    </div>
  );
};

export default TagInput;
