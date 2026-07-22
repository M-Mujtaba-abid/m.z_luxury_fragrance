import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCheckoutSessionQuery } from "../../queries/paymentQueries";
import { useCart } from "../../hooks/useCart";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: session, isLoading: loading, error } = useCheckoutSessionQuery(sessionId);
  const { clearCart } = useCart();

  // When session is fetched and paid, clear the cart
  useEffect(() => {
    if (session && session.payment_status === "paid") {
      clearCart().catch(() => {});
    }
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!session) return <p>No session found.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white px-4">
      <h1 className="text-4xl font-bold mb-4 text-green-500">🎉 Payment Successful!</h1>
      <p className="text-lg mb-1">Thank you, {session.customer_details?.name}</p>
      <p className="text-md mb-2">Email: {session.customer_details?.email}</p>
      <p className="text-md mb-4">
        Amount Paid: {(session.amount_total / 100).toFixed(2)} {session.currency.toUpperCase()}
      </p>
      <p className="mb-6 text-green-400 font-medium">Your order has been placed successfully.</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/myorders")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          See Orders
        </button>
      </div>
    </div>
  );
};

export default Success;
