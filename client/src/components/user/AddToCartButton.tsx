

// AddToCartButton.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/thunks/CartThunk";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-hot-toast"; // toast library

type AddToCartButtonProps = {
  productId: number;
  quantity?: number;
  onClick?: () => void;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  onClick,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
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
        className="mt-3 w-full border border-luxury-gold/30 bg-transparent text-luxury-cream py-2 rounded-md transition-colors duration-300 hover:border-luxury-gold hover:bg-luxury-gold/10 hover:text-luxury-gold"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;
