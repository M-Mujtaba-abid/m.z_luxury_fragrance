import { COLORS } from "./emailTemplates/baseTemplate.js";

const BRAND_NAME = "M.Z Luxury Fragrance";

// Standalone HTML page (not an email) shown when a subscriber clicks the
// unsubscribe link in their browser - reuses the email brand palette so it
// doesn't feel like a jarring, unstyled drop-off from the newsletter email.
const renderUnsubscribePage = ({ success, message }) => {
  const shopUrl = process.env.CLIENT_URL || "https://m-z-luxury-fragrance-61m9.vercel.app";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${success ? "Unsubscribed" : "Unsubscribe"} - ${BRAND_NAME}</title>
<style>
  body { margin:0; padding:0; background-color:${COLORS.bodyBg}; font-family: Arial, Helvetica, sans-serif; }
  .card { max-width:480px; margin:64px auto; background:#FFFFFF; border-radius:8px; overflow:hidden; border:1px solid ${COLORS.border}; }
  .header { background-color:${COLORS.black}; padding:28px 24px; text-align:center; border-bottom:3px solid ${COLORS.gold}; }
  .brand { font-family: Georgia, 'Times New Roman', serif; font-size:19px; letter-spacing:2.5px; color:${COLORS.goldLight}; text-transform:uppercase; }
  .body { padding:36px 32px; text-align:center; color:${COLORS.text}; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size:22px; color:${COLORS.black}; margin:0 0 16px; }
  p { font-size:15px; line-height:1.6; margin:0 0 24px; }
  a.button { display:inline-block; padding:13px 28px; background-color:${COLORS.black}; color:${COLORS.goldLight}; text-decoration:none; font-size:14px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; border-radius:4px; }
</style>
</head>
<body>
  <div class="card">
    <div class="header"><div class="brand">${BRAND_NAME}</div></div>
    <div class="body">
      <h1>${success ? "You've Been Unsubscribed" : "Unsubscribe Link Invalid"}</h1>
      <p>${message}</p>
      <a class="button" href="${shopUrl}">Return to Homepage</a>
    </div>
  </div>
</body>
</html>`;
};

export default renderUnsubscribePage;
