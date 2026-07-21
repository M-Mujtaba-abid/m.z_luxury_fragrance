import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, infoBox, infoRow, itemsTable, button, divider } from "./emailTemplates/components.js";
import { normalizeOrderItem, formatItemsListText } from "./emailTemplates/orderItems.js";

// Admin-facing "new order" alert - sent to the store's own inbox (EMAIL_USER)
// so the order can be fulfilled even without checking the admin panel.
const sendAdminNewOrderEmail = async ({ order, items = [] }) => {
  const adminEmail = process.env.EMAIL_USER;
  const normalizedItems = items.map(normalizeOrderItem);
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";
  const adminOrderUrl = `${shopUrl.replace(/\/$/, "")}/admin/orders`;

  const shippingAddress = `${order.shippingStreet}, ${order.shippingCity}, ${
    order.shippingState || ""
  } ${order.shippingPostalCode || ""}, ${order.shippingCountry}`;

  const bodyHtml = [
    heading("New Order Received"),
    paragraph(`A new order has just been placed on the store.`),
    infoBox(
      [
        infoRow("Order ID", `#${order.id}`),
        infoRow("Customer", order.customerName),
        infoRow("Phone", order.customerPhone),
        infoRow("Email", order.customerEmail),
        infoRow("Total Amount", `PKR ${order.totalAmount}`),
        infoRow("Payment Method", order.paymentMethod),
      ].join("")
    ),
    normalizedItems.length ? itemsTable(normalizedItems) : "",
    divider(),
    paragraph(`<strong>Shipping Address</strong><br/>${shippingAddress}`),
    button(adminOrderUrl, "View in Admin Panel"),
  ].join("");

  const html = wrapEmailTemplate({
    title: `New Order #${order.id}`,
    preheader: `New order from ${order.customerName} - PKR ${order.totalAmount}`,
    bodyHtml,
  });

  const textLines = [
    "A new order has just been placed on the store.",
    "",
    `Order ID: ${order.id}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Email: ${order.customerEmail}`,
    `Total Amount: PKR ${order.totalAmount}`,
    `Payment Method: ${order.paymentMethod}`,
    "",
  ];

  const itemsListText = formatItemsListText(normalizedItems);
  if (itemsListText) textLines.push("Items:", itemsListText, "");

  textLines.push("Shipping Address:", shippingAddress, "", `View in admin panel: ${adminOrderUrl}`);

  await sendEmail(adminEmail, `New Order Received - #${order.id}`, {
    text: textLines.join("\n"),
    html,
  });
};

export default sendAdminNewOrderEmail;
