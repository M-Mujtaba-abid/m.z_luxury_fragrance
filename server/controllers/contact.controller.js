import * as contactService from "../services/contact.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Public: submit a contact inquiry
export const submitMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await contactService.createContactMessage({ name, email, subject, message });

  res.status(201).json(new ApiResponse(201, contact, "Your message has been submitted successfully"));
});

// Admin-only: list all inquiries
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await contactService.getAllMessages();

  res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

// Admin-only: reply to a specific inquiry and email the sender
export const adminReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  const contact = await contactService.replyToMessage(id, replyText);

  res.status(200).json(new ApiResponse(200, contact, "Reply sent successfully"));
});
