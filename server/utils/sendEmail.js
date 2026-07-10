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

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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
