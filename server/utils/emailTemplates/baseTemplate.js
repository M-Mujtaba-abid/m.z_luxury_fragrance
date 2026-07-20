const BRAND_NAME = "M.Z Luxury Fragrance";

export const COLORS = {
  gold: "#C9A227",
  goldLight: "#E8C766",
  black: "#0B0B0B",
  bodyBg: "#F4F1EA",
  text: "#2B2B2B",
  muted: "#6B6B6B",
  border: "#E8E2D0",
};

const LOGO_URL = `${(process.env.CLIENT_URL || "https://luxuryfragrancemz.vercel.app").replace(/\/$/, "")}/logo.jpg`;

// Single wrapper every outgoing email HTML body passes through, so
// header/footer/branding live in exactly one place. Callers only supply the
// inner content (bodyHtml) and a preheader (the snippet clients show next to
// the subject line in the inbox list).
export const wrapEmailTemplate = ({ title = BRAND_NAME, preheader = "", bodyHtml }) => `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${title}</title>
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; background-color: ${COLORS.bodyBg}; }
  @media screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .email-padding { padding-left: 22px !important; padding-right: 22px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.bodyBg};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bodyBg};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:8px; overflow:hidden; border: 1px solid ${COLORS.border};">
          <tr>
            <td align="center" style="background-color:${COLORS.black}; padding: 28px 24px; border-bottom: 3px solid ${COLORS.gold};">
              <img src="${LOGO_URL}" width="60" height="60" alt="${BRAND_NAME}" style="display:block; margin: 0 auto; border-radius:50%; border: 2px solid ${COLORS.gold};" />
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 19px; letter-spacing: 2.5px; color: ${COLORS.goldLight}; margin-top: 14px; text-transform: uppercase;">${BRAND_NAME}</div>
            </td>
          </tr>
          <tr>
            <td class="email-padding" style="padding: 36px 40px; font-family: Arial, Helvetica, sans-serif; color:${COLORS.text}; font-size:15px; line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:${COLORS.black}; padding: 22px 24px;">
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; color:#B8B8B8; line-height:1.7;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.<br/>
                This is a transactional email regarding your account or order.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export default wrapEmailTemplate;
