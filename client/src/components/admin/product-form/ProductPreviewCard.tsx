interface ProductPreviewCardProps {
  title: string;
  price: number;
  discountPrice?: number;
  isOnSale: boolean;
  isFeatured: boolean;
  quantity: string;
  imageUrl?: string;
}

const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({
  title,
  price,
  discountPrice,
  isOnSale,
  isFeatured,
  quantity,
  imageUrl,
}) => {
  return (
    <div className="relative border border-luxury-gold/10 rounded-lg shadow-md overflow-hidden bg-luxury-ink flex flex-col max-w-[240px] mx-auto">
      {isFeatured && (
        <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-ink text-xs font-bold px-3 py-1 rounded-md shadow-md">
          FEATURED
        </span>
      )}

      <div className="w-full h-[200px] bg-luxury-card flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="font-logo text-3xl text-luxury-gold/20">M.Z</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-luxury-cream truncate">
          {title || "Product Title"}
        </h3>
        <p className="text-sm text-luxury-cream/60 mt-1">Quantity: {quantity}</p>
        <p className="text-base font-bold text-luxury-gold mt-1">
          Rs. {isOnSale && discountPrice ? discountPrice : price || 0}
          {isOnSale && discountPrice ? (
            <span className="ml-2 text-sm text-luxury-cream/40 line-through font-normal">
              Rs. {price || 0}
            </span>
          ) : null}
        </p>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          disabled
          className="mt-3 w-full border border-luxury-gold/30 bg-transparent text-luxury-cream py-2 rounded-md cursor-default"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductPreviewCard;
