import * as newsletterService from "../services/newsletter.service.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import renderUnsubscribePage from "../utils/unsubscribePage.js";

// Public: subscribe an email to the newsletter
export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const subscriber = await newsletterService.subscribeEmail(email);

  res
    .status(201)
    .json(new ApiResponse(201, subscriber, "Thank you for subscribing! Please check your inbox."));
});

// Public: one-click unsubscribe link from the email footer - renders an HTML
// page (not JSON) since a browser lands here directly, success or failure.
export const unsubscribe = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    await newsletterService.unsubscribeByToken(token);
    res
      .status(200)
      .type("html")
      .send(
        renderUnsubscribePage({
          success: true,
          message: "You will no longer receive our newsletter. We're sorry to see you go.",
        })
      );
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      res
        .status(404)
        .type("html")
        .send(
          renderUnsubscribePage({
            success: false,
            message: "This unsubscribe link is invalid or has already been used.",
          })
        );
      return;
    }
    throw error;
  }
});

// Admin-only: subscriber count + full list for the dashboard
export const getSubscribers = asyncHandler(async (req, res) => {
  const data = await newsletterService.getAllSubscribers();

  res.status(200).json(new ApiResponse(200, data, "Subscribers fetched successfully"));
});

// Admin-only: manually send a newsletter to every active subscriber
export const sendNewsletter = asyncHandler(async (req, res) => {
  const { subject, message, productIds } = req.body;

  const result = await newsletterService.sendNewsletterToSubscribers({
    subject,
    message,
    productIds: productIds || [],
  });

  res.status(200).json(new ApiResponse(200, result, "Newsletter sent"));
});
