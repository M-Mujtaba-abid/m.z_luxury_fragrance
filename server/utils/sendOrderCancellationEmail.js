import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, infoBox, infoRow, button } from "./emailTemplates/components.js";

const sendOrderCancellationEmail = async ({ order }) => {
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";
  const wasPaid = order.paymentStatus === "paid";

  const bodyHtml = [
    heading("Order Cancelled"),
    paragraph(`Hi ${order.customerName}, your order has been cancelled as requested.`),
    infoBox(
      [infoRow("Order ID", `#${order.id}`), infoRow("Total Amount", `PKR ${order.totalAmount}`)].join("")
    ),
    wasPaid
      ? paragraph(
          "Since this order was paid by card, your refund will be processed to your original payment method. It may take a few business days to reflect."
        )
      : "",
    paragraph("If you didn't request this cancellation or have any questions, please reply to this email."),
    button(shopUrl, "Continue Shopping"),
  ].join("");

  const html = wrapEmailTemplate({
    title: `Order #${order.id} - Cancelled`,
    preheader: `Your order #${order.id} has been cancelled.`,
    bodyHtml,
  });

  const textLines = [
    `Hi ${order.customerName},`,
    "",
    "Your order has been cancelled as requested.",
    "",
    `Order ID: ${order.id}`,
    `Total Amount: PKR ${order.totalAmount}`,
    "",
  ];

  if (wasPaid) {
    textLines.push(
      "Since this order was paid by card, your refund will be processed to your original payment method. It may take a few business days to reflect.",
      ""
    );
  }

  textLines.push(
    "If you didn't request this cancellation or have any questions, please reply to this email.",
    "",
    "Thanks,",
    "M.Z Luxury Fragrance"
  );

  await sendEmail(order.customerEmail, `Order #${order.id} - Cancelled`, {
    text: textLines.join("\n"),
    html,
  });
};

export default sendOrderCancellationEmail;
