

// AddToCartButton.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/user/cart/CartThunk";
import type { AppDispatch, RootState } from "../../redux/store";
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
  const navigate = useNavigate();

  // ✅ Get user token from redux
  const { token } = useSelector((state: RootState) => state.user);

  const handleAddToCart = async () => {
    if (!token) {
      // ✅ User not logged in
      toast.error("Please login first to add product to cart");
      navigate("/login");
      return;
    }

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
        className="mt-3 w-full border border-gray-400 bg-transparent text-black dark:text-white py-2 rounded-md hover:bg-green-100 dark:hover:bg-green-900 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;
