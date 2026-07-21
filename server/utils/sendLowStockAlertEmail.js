import sendEmail from "./sendEmail.js";
import { wrapEmailTemplate } from "./emailTemplates/baseTemplate.js";
import { heading, paragraph, button } from "./emailTemplates/components.js";
import { COLORS } from "./emailTemplates/baseTemplate.js";

// Admin-facing alert - sent to the store's own inbox (EMAIL_USER) whenever a
// just-placed order pushed a product/variant at or below the low-stock threshold.
const sendLowStockAlertEmail = async ({ lowStockItems }) => {
  const adminEmail = process.env.EMAIL_USER;
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";
  const adminProductsUrl = `${shopUrl.replace(/\/$/, "")}/admin/products`;

  const rows = lowStockItems
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid ${COLORS.border}; font-size:14px; color:${COLORS.text};">
        ${item.name}${item.size ? ` <span style="color:${COLORS.muted};">(${item.size})</span>` : ""}
      </td>
      <td align="right" style="padding:10px 0; border-bottom:1px solid ${COLORS.border}; font-size:14px; font-weight:bold; color:${
        item.stock === 0 ? "#B23B3B" : COLORS.black
      };">
        ${item.stock === 0 ? "Out of stock" : `${item.stock} left`}
      </td>
    </tr>`
    )
    .join("");

  const bodyHtml = [
    heading("Low Stock Alert"),
    paragraph(
      "The following item(s) are running low after a recent order and may need restocking soon:"
    ),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 8px 0 20px;">${rows}</table>`,
    button(adminProductsUrl, "Manage Products"),
  ].join("");

  const html = wrapEmailTemplate({
    title: "Low Stock Alert",
    preheader: `${lowStockItems.length} item(s) running low on stock`,
    bodyHtml,
  });

  const text = [
    "The following item(s) are running low after a recent order and may need restocking soon:",
    "",
    ...lowStockItems.map(
      (item) =>
        `- ${item.name}${item.size ? ` (${item.size})` : ""}: ${
          item.stock === 0 ? "Out of stock" : `${item.stock} left`
        }`
    ),
    "",
    `Manage products: ${adminProductsUrl}`,
  ].join("\n");

  await sendEmail(adminEmail, "Low Stock Alert", { text, html });
};

export default sendLowStockAlertEmail;
