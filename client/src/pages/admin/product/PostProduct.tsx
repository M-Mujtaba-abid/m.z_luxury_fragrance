import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useAdminSingleProductQuery,
} from "../../../queries/productQueries";
import type { ProductVariant } from "../../../redux/types/productTypes";
import TagInput from "../../../components/admin/product-form/TagInput";
import ImageDropzone from "../../../components/admin/product-form/ImageDropzone";
import VariantsEditor from "../../../components/admin/product-form/VariantsEditor";
import RichTextEditor from "../../../components/admin/product-form/RichTextEditor";
import ProductPreviewCard from "../../../components/admin/product-form/ProductPreviewCard";
import Breadcrumb from "../../../components/ui/Breadcrumb";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const inputClass =
  "w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60";
const labelClass = "block text-sm font-medium text-luxury-cream/80 mb-2";
const sectionClass = "bg-luxury-card border border-luxury-gold/10 rounded-xl p-6 space-y-4";

const PostProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = !!productId;
  const parsedId = productId ? parseInt(productId) : undefined;

  // React Query: fetch product for edit mode
  const { data: currentProduct } = useAdminSingleProductQuery(parsedId);

  // React Query: mutations
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const loading = createMutation.isPending || updateMutation.isPending;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "available" as "available" | "not available",
    price: "",
    stock: "",
    category: "Men" as "Men" | "Women",
    Quantity: "15ML" as "15ML" | "50ML",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    discountPrice: "",
    brand: "",
    gender: "" as "" | "Men" | "Women" | "Unisex",
    metaTitle: "",
    metaDescription: "",
    slug: "",
    publishStatus: "draft" as "draft" | "published",
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [topNotes, setTopNotes] = useState<string[]>([]);
  const [heartNotes, setHeartNotes] = useState<string[]>([]);
  const [baseNotes, setBaseNotes] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Populate form when editing an existing product
  useEffect(() => {
    if (isEditMode && currentProduct) {
      setFormData({
        title: currentProduct.title,
        description: currentProduct.description,
        status: currentProduct.status,
        price: currentProduct.price?.toString(),
        stock: currentProduct.stock?.toString(),
        category: currentProduct.category,
        Quantity: currentProduct.Quantity,
        isFeatured: currentProduct.isFeatured,
        isNewArrival: currentProduct.isNewArrival,
        isOnSale: currentProduct.isOnSale,
        discountPrice: currentProduct.discountPrice?.toString() || "",
        brand: currentProduct.brand || "",
        gender: currentProduct.gender || "",
        metaTitle: currentProduct.metaTitle || "",
        metaDescription: currentProduct.metaDescription || "",
        slug: currentProduct.slug || "",
        publishStatus: currentProduct.publishStatus || "draft",
      });
      setSlugTouched(true);
      setTopNotes(currentProduct.topNotes || []);
      setHeartNotes(currentProduct.heartNotes || []);
      setBaseNotes(currentProduct.baseNotes || []);
      setVariants(currentProduct.ProductVariants || []);
    }
  }, [currentProduct, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!formData.title.trim()) errors.push("Title is required.");
    if (!stripHtml(formData.description)) errors.push("Description is required.");
    if (!formData.price || Number(formData.price) <= 0) errors.push("Price must be greater than 0.");
    if (formData.stock === "" || Number(formData.stock) < 0) errors.push("Stock is required.");
    if (!isEditMode && newImages.length === 0) errors.push("At least one product image is required.");
    if (formData.isOnSale && (!formData.discountPrice || Number(formData.discountPrice) <= 0)) {
      errors.push("Discount price is required when On Sale is enabled.");
    }
    for (const v of variants) {
      if (!v.size.trim()) errors.push("Every variant needs a size.");
      if (!v.price || v.price <= 0) errors.push(`Variant "${v.size || "?"}" needs a price greater than 0.`);
    }
    return errors;
  };

  const buildFormData = (publishStatusOverride: "draft" | "published"): FormData => {
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("status", formData.status);
    fd.append("price", String(parseFloat(formData.price)));
    fd.append("stock", String(parseInt(formData.stock)));
    fd.append("category", formData.category);
    fd.append("Quantity", formData.Quantity);
    fd.append("isFeatured", String(formData.isFeatured));
    fd.append("isNewArrival", String(formData.isNewArrival));
    fd.append("isOnSale", String(formData.isOnSale));
    fd.append("publishStatus", publishStatusOverride);
    if (formData.discountPrice) fd.append("discountPrice", String(parseFloat(formData.discountPrice)));
    if (formData.brand) fd.append("brand", formData.brand);
    if (formData.gender) fd.append("gender", formData.gender);
    if (formData.metaTitle) fd.append("metaTitle", formData.metaTitle);
    if (formData.metaDescription) fd.append("metaDescription", formData.metaDescription);
    if (formData.slug) fd.append("slug", formData.slug);
    if (topNotes.length) fd.append("topNotes", JSON.stringify(topNotes));
    if (heartNotes.length) fd.append("heartNotes", JSON.stringify(heartNotes));
    if (baseNotes.length) fd.append("baseNotes", JSON.stringify(baseNotes));
    if (variants.length) fd.append("variants", JSON.stringify(variants));
    fd.append("coverIndex", String(coverIndex));
    newImages.forEach((img) => fd.append("images", img));
    return fd;
  };

  const handleSubmit = async (publishStatusOverride: "draft" | "published") => {
    const errors = validate();
    setFormErrors(errors);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    const fd = buildFormData(publishStatusOverride);

    try {
      if (isEditMode && productId) {
        await updateMutation.mutateAsync({ id: parseInt(productId), formData: fd });
        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(fd);
        toast.success(
          publishStatusOverride === "published" ? "Product published" : "Product saved as draft"
        );
      }
      navigate("/admin/products");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const previewImageUrl = newImages.length
    ? URL.createObjectURL(newImages[coverIndex] || newImages[0])
    : currentProduct?.productImage;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/admin" },
          { label: "Products", path: "/admin/products" },
          { label: isEditMode ? `Edit ${currentProduct?.title || "Product"}` : "Add Product" },
        ]}
      />
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="font-logo text-2xl sm:text-3xl font-bold text-luxury-cream">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2.5 min-h-[44px] border border-luxury-gold text-luxury-gold rounded-lg hover:bg-luxury-gold/10 transition-colors duration-300 text-sm"
        >
          ← Back
        </button>
      </div>

      {formErrors.length > 0 && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 text-red-300 rounded-lg text-sm space-y-1">
          {formErrors.map((msg, i) => (
            <p key={i}>• {msg}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">Basics</h2>
            <div>
              <label className={labelClass}>Product Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Oud Royale" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. M.Z Atelier" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClass}>
                  <option value="">Select gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <RichTextEditor
                key={isEditMode ? (currentProduct ? `loaded-${currentProduct.id}` : "loading") : "new"}
                value={formData.description}
                onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
                placeholder="Describe the fragrance..."
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">Fragrance Notes</h2>
            <TagInput label="Top Notes" values={topNotes} onChange={setTopNotes} placeholder="Type a note and press Enter" />
            <TagInput label="Heart Notes" values={heartNotes} onChange={setHeartNotes} placeholder="Type a note and press Enter" />
            <TagInput label="Base Notes" values={baseNotes} onChange={setBaseNotes} placeholder="Type a note and press Enter" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">Category & Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className={inputClass}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Default Size *</label>
                <select name="Quantity" value={formData.Quantity} onChange={handleInputChange} className={inputClass}>
                  <option value="15ML">15ML</option>
                  <option value="50ML">50ML</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (Rs.) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Stock *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>
            <p className="text-xs text-luxury-cream/40">
              This is the product's own price/stock, used when no size variants are configured below.
            </p>
            <VariantsEditor variants={variants} onChange={setVariants} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">Images</h2>
            <ImageDropzone
              existingImages={currentProduct?.ProductImages || []}
              newImages={newImages}
              coverIndex={coverIndex}
              onChangeNewImages={setNewImages}
              onChangeCoverIndex={setCoverIndex}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">SEO</h2>
            <div>
              <label className={labelClass}>Meta Title</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange as any}
                rows={2}
                maxLength={300}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input type="text" value={formData.slug} onChange={handleSlugChange} className={inputClass} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">Merchandising</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Availability</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className={inputClass}>
                  <option value="available">Available</option>
                  <option value="not available">Not Available</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  disabled={!formData.isOnSale}
                  className={`${inputClass} disabled:opacity-40`}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              {[
                { key: "isFeatured" as const, label: "Featured" },
                { key: "isNewArrival" as const, label: "New Arrival" },
                { key: "isOnSale" as const, label: "On Sale" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-luxury-cream/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.checked }))}
                    className="accent-luxury-gold w-4 h-4"
                  />
                  {label}
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live preview + actions */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className={sectionClass}>
            <h2 className="font-logo text-lg font-semibold text-luxury-cream">Live Preview</h2>
            <ProductPreviewCard
              title={formData.title}
              price={Number(formData.price) || 0}
              discountPrice={formData.discountPrice ? Number(formData.discountPrice) : undefined}
              isOnSale={formData.isOnSale}
              isFeatured={formData.isFeatured}
              quantity={formData.Quantity}
              imageUrl={previewImageUrl}
            />
          </div>

          <div className={sectionClass}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-luxury-cream/70">Status</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                formData.publishStatus === "published"
                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30"
              }`}>
                {formData.publishStatus === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("published")}
              className="w-full bg-luxury-gold text-luxury-ink py-3 rounded-lg font-semibold hover:bg-luxury-gold-bright transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Publish"}
            </motion.button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("draft")}
              className="w-full border border-luxury-gold text-luxury-gold py-3 rounded-lg hover:bg-luxury-gold/10 transition-colors duration-300 disabled:opacity-50"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProduct;
