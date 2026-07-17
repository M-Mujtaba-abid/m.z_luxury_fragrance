// import nodemailer from "nodemailer";

// const sendEmail = async (to, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // ya smtp host bhi use kar sakte ho
//       auth: {
//         user: process.env.EMAIL_USER, // 👈 env se aayega
//         pass: process.env.EMAIL_PASS, // 👈 env se aayega
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully");
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//     throw error;
//   }
// };

// export default sendEmail;


import nodemailer from "nodemailer";

// Built fresh per call (not hoisted to module scope) so it always reads
// EMAIL_USER/EMAIL_PASS after dotenv.config() has run, regardless of when
// this module gets pulled into the import graph relative to that call.
const buildTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = buildTransporter();
    const mailOptions = {
      from: `"Luxury Fragrance M.Z" <${process.env.EMAIL_USER}>`, // 👈 sender name
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// order: Sequelize Order instance. items: OrderItem instances (may be empty,
// e.g. the Stripe webhook flow doesn't persist line items today).
export const sendOrderConfirmationEmail = async (order, items = []) => {
  const itemsList = items.length
    ? items
        .map(
          (item) =>
            `- ${item.productName}${item.variantSize ? ` (${item.variantSize})` : ""} x${item.quantity} — Rs.${item.subtotal}`
        )
        .join("\n")
    : "(itemized breakdown not available for this order)";

  const text =
    `Hi ${order.customerName},\n\n` +
    `Thank you for your order #${order.id}!\n\n` +
    `${itemsList}\n\n` +
    `Total: Rs.${order.totalAmount}\n` +
    `Shipping to: ${order.shippingStreet}, ${order.shippingCity}, ${order.shippingCountry}\n\n` +
    `We'll notify you again once your order ships.\n\n` +
    `— Luxury Fragrance M.Z`;

  const transporter = buildTransporter();
  const mailOptions = {
    from: `"Luxury Fragrance M.Z" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmation — #${order.id}`,
    text,
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Order confirmation email sent successfully");
};

export default sendEmail;
