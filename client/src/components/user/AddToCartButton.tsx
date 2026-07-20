// AddToCartButton.tsx
import React from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../../hooks/useCart";

type AddToCartButtonProps = {
  productId: number;
  quantity?: number;
  onClick?: () => void;
  className?: string;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  onClick,
  className,
}) => {
  const { addToCart, isAdding } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
      toast.success("Product added to cart!");
      if (onClick) onClick();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className={`p-4 pt-0 ${className || ""}`}>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="mt-3 w-full border border-luxury-gold/30 bg-transparent text-luxury-cream py-2 rounded-md transition-colors duration-300 hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold disabled:opacity-50"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCartButton;
