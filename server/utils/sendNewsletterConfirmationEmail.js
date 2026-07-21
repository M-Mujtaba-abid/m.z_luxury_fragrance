import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, button } from "./emailTemplates/components.js";

const sendNewsletterConfirmationEmail = async ({ email, unsubscribeUrl }) => {
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";

  const bodyHtml = [
    heading("You're on the List!"),
    paragraph(
      "Thank you for subscribing to the <strong>M.Z Luxury Fragrance</strong> Olfactive Journals. You'll now receive advance access to our limited batches, signature blend drops, and fragrance research straight to your inbox."
    ),
    button(shopUrl, "Explore The Collection"),
    paragraph(
      `<span style="font-size:12px;">Didn't sign up for this? <a href="${unsubscribeUrl}" style="color:#6B6B6B;">Unsubscribe here</a>.</span>`
    ),
  ].join("");

  const html = wrapEmailTemplate({
    title: "Subscribed - M.Z Luxury Fragrance",
    preheader: "You're now subscribed to our Olfactive Journals.",
    bodyHtml,
  });

  const text = [
    "You're on the list!",
    "",
    "Thank you for subscribing to the M.Z Luxury Fragrance Olfactive Journals. You'll now receive advance access to our limited batches, signature blend drops, and fragrance research straight to your inbox.",
    "",
    `Explore the collection: ${shopUrl}`,
    "",
    `Didn't sign up for this? Unsubscribe here: ${unsubscribeUrl}`,
  ].join("\n");

  await sendEmail(email, "Welcome to M.Z Luxury Fragrance's Olfactive Journals", { text, html });
};

export default sendNewsletterConfirmationEmail;
