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

export default sendEmail;
