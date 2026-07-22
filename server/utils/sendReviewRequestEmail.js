import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, button } from "./emailTemplates/components.js";

const sendReviewRequestEmail = async ({ order, productNames = [] }) => {
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";
  const myOrdersUrl = `${shopUrl.replace(/\/$/, "")}/myorders`;

  const productLine = productNames.length
    ? `<strong>${productNames.join(", ")}</strong>`
    : "your recent order";

  const bodyHtml = [
    heading("How Was Your Fragrance?"),
    paragraph(`Hi ${order.customerName}, we hope you're enjoying ${productLine}!`),
    paragraph(
      "Your feedback helps other customers discover their next favorite scent. Could you spare a minute to leave a review?"
    ),
    button(myOrdersUrl, "Leave a Review"),
  ].join("");

  const html = wrapEmailTemplate({
    title: "How was your fragrance?",
    preheader: "Share your experience and help other customers.",
    bodyHtml,
  });

  const text = [
    `Hi ${order.customerName},`,
    "",
    `We hope you're enjoying ${productNames.length ? productNames.join(", ") : "your recent order"}!`,
    "",
    "Your feedback helps other customers discover their next favorite scent. Could you spare a minute to leave a review?",
    "",
    `Leave a review: ${myOrdersUrl}`,
    "",
    "Thanks,",
    "M.Z Luxury Fragrance",
  ].join("\n");

  await sendEmail(order.customerEmail, "How was your fragrance? Leave a review", { text, html });
};

export default sendReviewRequestEmail;
