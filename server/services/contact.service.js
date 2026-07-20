import Contact from "../models/contact.model.js";
import ApiError from "../utils/apiError.js";
import sendEmail from "../utils/sendEmail.js";

export const createContactMessage = async ({ name, email, subject, message }) => {
  const contact = await Contact.create({ name, email, subject, message });
  return contact;
};

export const getAllMessages = async () => {
  const messages = await Contact.findAll({ order: [["createdAt", "DESC"]] });
  return messages;
};

export const replyToMessage = async (id, replyText) => {
  const contact = await Contact.findByPk(id);
  if (!contact) throw new ApiError(404, "Message not found");

  contact.adminReply = replyText;
  contact.status = "replied";
  await contact.save();

  const emailBody =
    `Hi ${contact.name},\n\n` +
    `Thanks for reaching out to us. Here is a copy of your original message and our reply:\n\n` +
    `Your message:\n${contact.message}\n\n` +
    `Our reply:\n${replyText}\n\n` +
    `Best regards,\nLuxury Fragrance M.Z Support Team`;

  // The reply is already persisted above and visible in the admin panel
  // regardless of delivery, so a bounced/failed notification email
  // shouldn't turn a successful reply into a 500 for the admin.
  try {
    await sendEmail(contact.email, `Re: ${contact.subject}`, emailBody);
  } catch (error) {
    console.error(`Failed to send reply email for contact #${contact.id}:`, error);
  }

  return contact;
};
