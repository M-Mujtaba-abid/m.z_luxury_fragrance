
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import {
  fetchOrderById,
  updateOrderStatus,
} from "../../../redux/Admin/AdminThunk/OrderThunk";
import OrderSlip from "./OrderSlip";

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const { order } = useSelector((state: RootState) => state.order);
  const { loading } = useSelector((state: RootState) => state.loader);

  const [status, setStatus] = useState(order?.status || "pending");

  useEffect(() => {
    if (id) dispatch(fetchOrderById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (order?.id)
      dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] px-6 md:px-16 lg:px-32 pb-12 min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Order Details</h1>

      <div className="space-y-4">
        {/* Customer Info */}
        <p>
          <span className="font-semibold">Customer Name:</span>{" "}
          {order.customerName}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {order.customerEmail}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {order.customerPhone || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Shipping Address:</span>{" "}
          {order.shippingStreet}, {order.shippingCity}, {order.shippingState},{" "}
          {order.shippingPostalCode}, {order.shippingCountry}
        </p>
        <p>
          <span className="font-semibold">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <select
            value={status}
            onChange={handleStatusChange}
            className="px-3 py-1 rounded border bg-white border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order Items */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Order Items</h2>
          <div className="space-y-3">
            {order.OrderItems?.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center gap-3 p-2 border rounded border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.Product.productImage}
                    alt={item.Product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.quantity} x Rs.{item.priceAtPurchase}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">Subtotal:  Rs. {item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount & Created At */}
        <div className="mt-4">
          <p className="font-semibold text-lg">
            Total Amount: Rs. {order.totalAmount}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Order Created At: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Order Slip */}
      <div className="mt-6">
        <OrderSlip order={order} />
      </div>
    </div>
  );
};

export default OrderDetails;
