import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, button } from "./emailTemplates/components.js";

const sendWelcomeEmail = async ({ firstName, email }) => {
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";

  const bodyHtml = [
    heading(`Welcome, ${firstName}!`),
    paragraph(
      "Thank you for creating an account with <strong>M.Z Luxury Fragrance</strong>. Your account is ready, and you're all set to explore our collection of premium fragrances."
    ),
    paragraph("Enjoy a seamless shopping experience, order tracking, and faster checkout on your next purchase."),
    button(shopUrl, "Start Shopping"),
  ].join("");

  const html = wrapEmailTemplate({
    title: "Welcome to M.Z Luxury Fragrance",
    preheader: "Your account has been created successfully.",
    bodyHtml,
  });

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for creating an account with M.Z Luxury Fragrance. Your account is ready, and you're all set to explore our collection of premium fragrances.",
    "",
    `Start shopping: ${shopUrl}`,
    "",
    "Thanks for joining us!",
  ].join("\n");

  await sendEmail(email, "Welcome to M.Z Luxury Fragrance", { text, html });
};

export default sendWelcomeEmail;
