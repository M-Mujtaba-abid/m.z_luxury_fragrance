import sendEmail from "./sendEmail.js";

const formatItemsList = (items = []) => {
  if (!items.length) return "";
  return items
    .map((item) => `- ${item.Product?.title || item.productName || "Item"} x${item.quantity}`)
    .join("\n");
};

const sendOrderConfirmationEmail = async ({ order, items = [] }) => {
  const itemsList = formatItemsList(items);

  const lines = [
    `Hi ${order.customerName},`,
    "",
    "Thank you for your order! Here are your order details:",
    "",
    `Order ID: ${order.id}`,
    `Total Amount: PKR ${order.totalAmount}`,
    `Payment Method: ${order.paymentMethod}`,
    `Status: ${order.status}`,
    "",
  ];

  if (itemsList) {
    lines.push("Items:", itemsList, "");
  }

  lines.push(
    "Shipping Address:",
    `${order.shippingStreet}, ${order.shippingCity}, ${order.shippingState || ""} ${
      order.shippingPostalCode || ""
    }, ${order.shippingCountry}`,
    "",
    "We'll notify you once your order ships.",
    "",
    "Thanks for shopping with Luxury Fragrance M.Z!"
  );

  await sendEmail(order.customerEmail, `Order Confirmation - #${order.id}`, lines.join("\n"));
};

export default sendOrderConfirmationEmail;
