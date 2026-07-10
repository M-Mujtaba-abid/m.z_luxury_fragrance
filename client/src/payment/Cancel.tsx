// // import React from 'react'

// const Cancel = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
//       <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
//       <p className="mb-4">Your payment was not completed. Your cart has not been changed.</p>
//       <a href="/web/cart" className="text-blue-600 hover:underline">Return to cart</a>
//     </div>
//   )
// }

// export default Cancel


// import React from "react";

import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white px-4">
      <h1 className="text-4xl font-bold mb-4 text-red-500">Payment Canceled</h1>
      <p className="mb-6 text-center">
        Your payment was not completed. Your cart has not been changed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/web/cart")}
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          Return to Cart
        </button>
        <button
          onClick={() => navigate("/web")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cancel;
