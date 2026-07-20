import { COLORS } from "./baseTemplate.js";

// Small table-based building blocks shared by every email type, so content
// files only describe what to say, not how to lay it out.

export const heading = (text) =>
  `<h1 style="margin:0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: ${COLORS.black};">${text}</h1>`;

export const paragraph = (html) =>
  `<p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:${COLORS.text};">${html}</p>`;

export const button = (href, label) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
  <tr>
    <td align="center" style="border-radius:4px; background-color:${COLORS.black};">
      <a href="${href}" target="_blank" style="display:inline-block; padding:13px 28px; font-family: Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; letter-spacing:1px; color:${COLORS.goldLight}; text-decoration:none; text-transform:uppercase;">${label}</a>
    </td>
  </tr>
</table>`;

export const divider = () =>
  `<hr style="border:none; border-top:1px solid ${COLORS.border}; margin:24px 0;" />`;

// Label/value row used for order id, total, payment method, status, etc.
export const infoRow = (label, value) => `
<tr>
  <td style="padding:6px 0; font-size:14px; color:${COLORS.muted};">${label}</td>
  <td align="right" style="padding:6px 0; font-size:14px; color:${COLORS.black}; font-weight:bold;">${value}</td>
</tr>`;

export const infoBox = (rowsHtml) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bodyBg}; border-radius:6px; padding:16px 18px; margin: 0 0 20px;">
  ${rowsHtml}
</table>`;

// Order items list rendered as a simple table: name/size, qty, subtotal.
export const itemsTable = (items) => {
  if (!items.length) return "";

  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid ${COLORS.border}; font-size:14px; color:${COLORS.text};">
        ${item.name}${item.size ? ` <span style="color:${COLORS.muted};">(${item.size})</span>` : ""}<br/>
        <span style="color:${COLORS.muted}; font-size:13px;">Qty: ${item.quantity}</span>
      </td>
      <td align="right" style="padding:10px 0; border-bottom:1px solid ${COLORS.border}; font-size:14px; color:${COLORS.black}; white-space:nowrap;">
        ${item.subtotal}
      </td>
    </tr>`
    )
    .join("");

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 8px 0 20px;">
  ${rows}
</table>`;
};

export const statusBadge = (label, color = COLORS.gold) => `
<span style="display:inline-block; padding:4px 12px; border-radius:12px; background-color:${color}; color:${COLORS.black}; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">${label}</span>`;
