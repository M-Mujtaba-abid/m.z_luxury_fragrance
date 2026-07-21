import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, infoBox, infoRow, button, statusBadge } from "./emailTemplates/components.js";

const STATUS_COPY = {
  pending: {
    label: "Pending",
    message: "Your order is pending confirmation.",
  },
  confirmed: {
    label: "Confirmed",
    message: "Good news - your order has been confirmed and is now being prepared.",
  },
  shipped: {
    label: "Shipped",
    message: "Your order is on its way! It has been handed over for delivery.",
  },
  delivered: {
    label: "Delivered",
    message: "Your order has been delivered. We hope you love your new fragrance!",
  },
};

const sendOrderStatusUpdateEmail = async ({ order, status }) => {
  const copy = STATUS_COPY[status] || { label: status, message: "Your order status has been updated." };
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";
  const trackUrl = `${shopUrl.replace(/\/$/, "")}/track-order`;

  const bodyHtml = [
    heading("Order Status Update"),
    paragraph(`Hi ${order.customerName}, ${copy.message}`),
    infoBox(
      [infoRow("Order ID", `#${order.id}`), infoRow("Status", statusBadge(copy.label))].join("")
    ),
    button(trackUrl, "Track Your Order"),
  ].join("");

  const html = wrapEmailTemplate({
    title: `Order #${order.id} - ${copy.label}`,
    preheader: `Your order #${order.id} is now ${copy.label.toLowerCase()}.`,
    bodyHtml,
  });

  const text = [
    `Hi ${order.customerName},`,
    "",
    copy.message,
    "",
    `Order ID: ${order.id}`,
    `Status: ${copy.label}`,
    "",
    `Track your order: ${trackUrl}`,
    "",
    "Thanks for shopping with M.Z Luxury Fragrance!",
  ].join("\n");

  await sendEmail(order.customerEmail, `Order #${order.id} - ${copy.label}`, { text, html });
};

export default sendOrderStatusUpdateEmail;
