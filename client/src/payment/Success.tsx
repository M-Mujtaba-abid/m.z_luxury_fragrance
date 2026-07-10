// // pages/Success.tsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";
// import { getCheckoutSession } from "../redux/payment/PaymentThunk";
// import type { RootState } from "../redux/store";
// import { clearCart, getUserCart } from "../redux/user/cart/CartThunk";

// const Success: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id"); // ✅ Stripe sends ?session_id=

//   const { session, loading, error } = useSelector(
//     (state: RootState) => state.payment
//   );

//   useEffect(() => {
//     if (sessionId) {
//       dispatch(getCheckoutSession(sessionId));
//     }
//   }, [dispatch, sessionId]);

//   // When session is fetched and paid, clear cart once
//   useEffect(() => {
//     if (session && session.payment_status === "paid") {
//       dispatch(clearCart());
//       dispatch(getUserCart());
//     }
//   }, [dispatch, session]);

//   if (loading) return <p>Loading payment details...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;
//   if (!session) return <p>No session found.</p>;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
//       <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
//       <p>Thank you, {session.customer_details?.name}</p>
//       <p>Email: {session.customer_details?.email}</p>
//       <p>
//         Amount Paid: {session.amount_total / 100}{" "}
//         {session.currency.toUpperCase()}
//       </p>
//       <p className="mt-2 text-green-600">Your order has been placed successfully.</p>
//     </div>
//   );
// };

// export default Success;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCheckoutSession } from "../redux/payment/PaymentThunk";
import type { RootState } from "../redux/store";
import { clearCart, getUserCart } from "../redux/user/cart/CartThunk";

const Success: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { session, loading, error } = useSelector(
    (state: RootState) => state.payment
  );

  useEffect(() => {
    if (sessionId) dispatch(getCheckoutSession(sessionId));
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (session && session.payment_status === "paid") {
      dispatch(clearCart());
      dispatch(getUserCart());
    }
  }, [dispatch, session]);

  if (loading) return <p>Loading payment details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
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
          onClick={() => navigate("/web")}
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/web/myorders")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          See Orders
        </button>
      </div>
    </div>
  );
};

export default Success;
