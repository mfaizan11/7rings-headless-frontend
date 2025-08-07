'use client';

import { useState } from 'react';
import { addToCart } from '../api/cart';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  productId: number | string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { updateCart, openCartSidebar } = useCart();

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent the Link parent from navigating
    event.stopPropagation(); // Stop the event from bubbling up

    setLoading(true);
    setError(null);

    try {
      const cartData = await addToCart(productId);
      updateCart(cartData);
      openCartSidebar();
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      // Optional: auto-hide the error message after a few seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
    </>
  );
};

export default AddToCartButton;