import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, productCards, divider } from "./emailTemplates/components.js";

// `message` arrives as admin-authored HTML from the RichTextEditor (bold/
// italic/lists) - trusted content, since only an authenticated admin can
// reach this send path, so it's embedded as-is rather than sanitized.
const stripHtml = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatPrice = (product) => {
  if (product.isOnSale && product.discountPrice) {
    return `PKR ${product.discountPrice} (was PKR ${product.price})`;
  }
  return `PKR ${product.price}`;
};

const sendNewsletterCampaignEmail = async ({ email, subject, message, products = [], unsubscribeUrl }) => {
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";

  const productList = products.map((product) => ({
    name: product.title,
    imageUrl: product.productImage,
    price: formatPrice(product),
    link: `${shopUrl.replace(/\/$/, "")}/web/product-detail/${product.id}`,
  }));

  const bodyHtml = [
    heading(subject),
    message,
    productList.length ? divider() : "",
    productCards(productList),
    `<p style="margin:24px 0 0; font-size:12px; color:#6B6B6B;">You're receiving this because you subscribed to M.Z Luxury Fragrance's Olfactive Journals. <a href="${unsubscribeUrl}" style="color:#6B6B6B;">Unsubscribe</a>.</p>`,
  ].join("");

  const html = wrapEmailTemplate({
    title: subject,
    preheader: stripHtml(message).slice(0, 120),
    bodyHtml,
  });

  const textLines = [subject, "", stripHtml(message)];
  if (productList.length) {
    textLines.push(
      "",
      "Featured:",
      ...productList.map((p) => `- ${p.name} (${p.price}): ${p.link}`)
    );
  }
  textLines.push("", `Unsubscribe: ${unsubscribeUrl}`);

  await sendEmail(email, subject, { text: textLines.join("\n"), html });
};

export default sendNewsletterCampaignEmail;
