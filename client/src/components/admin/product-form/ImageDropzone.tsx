import { useRef, useState } from "react";
import { UploadCloud, Star, X, GripVertical } from "lucide-react";
import type { ProductImage } from "../../../redux/types/productTypes";

interface ImageDropzoneProps {
  existingImages: ProductImage[];
  newImages: File[];
  coverIndex: number;
  onChangeNewImages: (files: File[]) => void;
  onChangeCoverIndex: (index: number) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  existingImages,
  newImages,
  coverIndex,
  onChangeNewImages,
  onChangeCoverIndex,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    onChangeNewImages([...newImages, ...files]);
  };

  const removeAt = (index: number) => {
    const next = newImages.filter((_, i) => i !== index);
    onChangeNewImages(next);
    if (coverIndex >= next.length) onChangeCoverIndex(0);
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...newImages];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChangeNewImages(next);

    // Keep the cover pointing at the same physical image after reordering.
    if (coverIndex === from) onChangeCoverIndex(to);
    else if (from < coverIndex && to >= coverIndex) onChangeCoverIndex(coverIndex - 1);
    else if (from > coverIndex && to <= coverIndex) onChangeCoverIndex(coverIndex + 1);
  };

  const hasNewImages = newImages.length > 0;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-luxury-cream/80">Product Images</label>

      {existingImages.length > 0 && !hasNewImages && (
        <div>
          <p className="text-xs text-luxury-cream/50 mb-2">
            Current gallery — uploading new images below will replace it entirely.
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {existingImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-md overflow-hidden border border-luxury-gold/10"
              >
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                {img.isCover && (
                  <span className="absolute top-1 left-1 bg-luxury-gold text-luxury-ink text-[10px] font-bold px-1.5 py-0.5 rounded">
                    COVER
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasNewImages && (
        <>
          <p className="text-xs text-luxury-gold/80">
            {existingImages.length > 0
              ? "These new images will replace the current gallery on save."
              : "Drag to reorder. Click the star to set the storefront cover image."}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {newImages.map((file, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => (dragIndex.current = index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex.current !== null) reorder(dragIndex.current, index);
                  dragIndex.current = null;
                }}
                className="group relative aspect-square rounded-md overflow-hidden border border-luxury-gold/20 cursor-grab active:cursor-grabbing"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <GripVertical className="absolute top-1 left-1 w-3.5 h-3.5 text-luxury-cream/0 group-hover:text-luxury-cream/70 transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => onChangeCoverIndex(index)}
                  title="Set as cover"
                  className={`absolute bottom-1 left-1 p-1 rounded-full transition-colors duration-300 ${
                    index === coverIndex
                      ? "bg-luxury-gold text-luxury-ink"
                      : "bg-black/50 text-luxury-cream/0 group-hover:text-luxury-cream/80"
                  }`}
                >
                  <Star className="w-3 h-3" fill={index === coverIndex ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-luxury-cream/0 group-hover:text-luxury-cream/80 hover:!text-red-400 transition-colors duration-300"
                >
                  <X className="w-3 h-3" />
                </button>
                {index === coverIndex && (
                  <span className="absolute bottom-1 right-1 bg-luxury-gold text-luxury-ink text-[9px] font-bold px-1 py-0.5 rounded">
                    COVER
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg py-6 cursor-pointer transition-colors duration-300 ${
          isDraggingOver
            ? "border-luxury-gold-bright bg-luxury-gold/5"
            : "border-luxury-gold/20 hover:border-luxury-gold/40"
        }`}
      >
        <UploadCloud className="w-6 h-6 text-luxury-gold/60" />
        <p className="text-sm text-luxury-cream/60">
          Drag & drop images here, or <span className="text-luxury-gold">browse</span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>
    </div>
  );
};

export default ImageDropzone;
