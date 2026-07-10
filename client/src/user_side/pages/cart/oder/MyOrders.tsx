
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import { fetchMyOrders } from "../../../../redux/Admin/AdminThunk/OrderThunk";
import { useNavigate } from "react-router-dom";

const MyOrders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, error} = useSelector(
    (state: RootState) => state.order
  );
  const { token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className="min-h-screen pt-[80px] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
          <p className="text-gray-800 dark:text-gray-100 mb-4 font-medium">
            Please login first to see your orders.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
  //       <p className="text-gray-700 dark:text-gray-300">Loading orders...</p>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Orders
        </h1>

        {orders?.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            You have no orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders?.map((order: any) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{order.id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Address */}
                <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Delivery Address:</span>{" "}
                    {order.shippingStreet}, {order.shippingCity}
                  </p>
                </div>

                {/* Products */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.OrderItems?.map((item: any) => (
                    <div key={item.id} className="flex items-center py-3 gap-4">
                      <img
                        src={item.Product?.productImage}
                        alt={item.Product?.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-white font-medium">
                          {item.Product?.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Rs. {item.priceAtPurchase * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4  flex justify-end font-semibold text-gray-900 dark:text-white">
                  <span className="font-bold ">Total: </span>
                  <span>Rs. {order.totalAmount}</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide 
      ${
        order.status === "pending"
          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
          : ""
      }
      ${
        order.status === "confirmed"
          ? "bg-indigo-200 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-100"
          : ""
      }
      ${
        order.status === "shipped"
          ? "bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-100"
          : ""
      }
      ${
        order.status === "delivered"
          ? "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-100"
          : ""
      }
      ${
        order.status === "cancelled"
          ? "bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-100"
          : ""
      }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
