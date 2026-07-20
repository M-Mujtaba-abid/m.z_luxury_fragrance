
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useMyOrdersQuery } from "../../../queries/orderQueries";
import { useEligibleOrdersQuery } from "../../../queries/reviewQueries";
import { useNavigate } from "react-router-dom";
import ReviewFormModal from "../../../components/user/ReviewFormModal";

// Same status color language used on Order Tracking / admin Order Directory.
const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  confirmed: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
  shipped: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  delivered: "bg-green-500/15 text-green-300 border border-green-500/30",
  cancelled: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.user);

  const { data: orders = [], isLoading, error } = useMyOrdersQuery(!!token);
  const { data: eligibleOrders = [] } = useEligibleOrdersQuery(!!token);

  const [reviewTarget, setReviewTarget] = useState<{
    orderId: number;
    productId: number;
    productTitle: string;
    productImage: string;
  } | null>(null);

  const isEligibleForReview = (orderId: number, productId: number) =>
    eligibleOrders.some((e) => e.orderId === orderId && e.productId === productId);

  if (!token) {
    return (
      <div className="min-h-screen pt-[80px] flex items-center justify-center bg-luxury-ink">
        <div className="bg-luxury-card border border-luxury-gold/10 shadow-md p-6 rounded-xl text-center">
          <p className="text-luxury-cream mb-4 font-medium">
            Please login first to see your orders.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg bg-luxury-gold text-luxury-ink font-semibold hover:bg-luxury-gold-bright transition-colors duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[80px] flex items-center justify-center bg-luxury-ink">
        <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[80px] flex items-center justify-center bg-luxury-ink">
        <div className="bg-red-950/40 border border-red-900/50 text-red-300 rounded-lg p-4 text-sm">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] bg-luxury-ink py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-luxury-cream/60">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-luxury-card border border-luxury-gold/10 shadow-md rounded-xl p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-logo text-lg font-semibold text-luxury-gold">
                    Order #{order.id}
                  </h2>
                  <span className="text-sm text-luxury-cream/50">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Address */}
                <div className="mb-4 text-sm text-luxury-cream/80">
                  <p>
                    <span className="font-medium text-luxury-gold">Delivery Address:</span>{" "}
                    <span className="text-luxury-cream">
                      {order.shippingStreet}, {order.shippingCity}
                    </span>
                  </p>
                </div>

                {/* Products */}
                <div className="divide-y divide-luxury-gold/10">
                  {order.OrderItems?.map((item: any) => (
                    <div key={item.id} className="flex items-center py-3 gap-4">
                      <img
                        src={item.Product?.productImage}
                        alt={item.Product?.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-luxury-cream font-medium">
                          {item.Product?.title}
                        </h3>
                        <p className="text-sm text-luxury-cream/60">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-luxury-gold">
                        Rs. {item.priceAtPurchase * item.quantity}
                      </span>
                      {order.status === "delivered" && (
                        isEligibleForReview(order.id, item.productId) ? (
                          <button
                            onClick={() =>
                              setReviewTarget({
                                orderId: order.id,
                                productId: item.productId,
                                productTitle: item.Product?.title,
                                productImage: item.Product?.productImage,
                              })
                            }
                            className="ml-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide bg-luxury-gold text-luxury-ink hover:bg-luxury-gold-bright transition-colors duration-300 whitespace-nowrap"
                          >
                            Write a Review
                          </button>
                        ) : (
                          <span className="ml-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                            Reviewed
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 flex justify-end font-semibold text-luxury-cream">
                  <span className="font-bold">Total: </span>
                  <span className="text-luxury-gold">Rs. {order.totalAmount}</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${
                      statusStyles[order.status] || ""
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewTarget && (
        <ReviewFormModal
          isOpen={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          orderId={reviewTarget.orderId}
          productId={reviewTarget.productId}
          productTitle={reviewTarget.productTitle}
          productImage={reviewTarget.productImage}
        />
      )}
    </div>
  );
};

export default MyOrders;
