import { Plus, Trash2 } from "lucide-react";
import type { ProductVariant } from "../../../redux/types/productTypes";

interface VariantsEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

const inputClass =
  "w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60 text-sm";

const VariantsEditor: React.FC<VariantsEditorProps> = ({ variants, onChange }) => {
  const updateVariant = (index: number, patch: Partial<ProductVariant>) => {
    const next = variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
    onChange(next);
  };

  const addVariant = () => {
    onChange([...variants, { size: "", price: 0, stock: 0, sku: "" }]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-luxury-cream/80">
          Size Variants <span className="text-luxury-cream/40 font-normal">(optional)</span>
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center gap-1 text-sm text-luxury-gold hover:text-luxury-gold-bright transition-colors duration-300"
        >
          <Plus className="w-4 h-4" /> Add Size
        </button>
      </div>

      {variants.length === 0 ? (
        <p className="text-xs text-luxury-cream/40">
          No variants configured — the product will use its own price and stock above.
        </p>
      ) : (
        <div className="space-y-2">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 text-xs text-luxury-cream/50 px-1">
            <span>Size</span>
            <span>Price</span>
            <span>Stock</span>
            <span>SKU</span>
            <span></span>
          </div>
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center"
            >
              <input
                type="text"
                placeholder="e.g. 30ml"
                value={variant.size}
                onChange={(e) => updateVariant(index, { size: e.target.value })}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price || ""}
                onChange={(e) => updateVariant(index, { price: Number(e.target.value) })}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock || ""}
                onChange={(e) => updateVariant(index, { stock: Number(e.target.value) })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="SKU (optional)"
                value={variant.sku || ""}
                onChange={(e) => updateVariant(index, { sku: e.target.value })}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="justify-self-end sm:justify-self-center p-2 text-red-400 hover:bg-red-950/40 rounded-md transition-colors duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantsEditor;
