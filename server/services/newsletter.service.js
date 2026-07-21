import crypto from "crypto";
import { Op } from "sequelize";
import Subscriber from "../models/subscriber.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import sendNewsletterConfirmationEmail from "../utils/sendNewsletterConfirmationEmail.js";
import sendNewsletterCampaignEmail from "../utils/sendNewsletterCampaignEmail.js";

const getServerUrl = () =>
  (process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8000}`).replace(/\/$/, "");

const buildUnsubscribeUrl = (token) => `${getServerUrl()}/newsletter/unsubscribe/${token}`;

const generateUnsubscribeToken = () => crypto.randomBytes(32).toString("hex");

export const subscribeEmail = async (rawEmail) => {
  const email = rawEmail.trim().toLowerCase();
  const existing = await Subscriber.findOne({ where: { email } });

  if (existing && existing.isActive) {
    throw new ApiError(409, "This email is already subscribed to our newsletter");
  }

  let subscriber;
  if (existing) {
    // Previously unsubscribed - resubscribing reactivates the same record
    // (and the same unsubscribe link) rather than creating a duplicate row.
    existing.isActive = true;
    existing.subscribedAt = new Date();
    await existing.save();
    subscriber = existing;
  } else {
    subscriber = await Subscriber.create({
      email,
      unsubscribeToken: generateUnsubscribeToken(),
    });
  }

  const unsubscribeUrl = buildUnsubscribeUrl(subscriber.unsubscribeToken);

  // The record is already saved above regardless of delivery, so a bounced
  // confirmation email shouldn't turn a successful subscribe into a 500.
  try {
    await sendNewsletterConfirmationEmail({ email: subscriber.email, unsubscribeUrl });
  } catch (error) {
    console.error(`Failed to send newsletter confirmation email to ${subscriber.email}:`, error);
  }

  return subscriber;
};

export const unsubscribeByToken = async (token) => {
  const subscriber = await Subscriber.findOne({ where: { unsubscribeToken: token } });
  if (!subscriber) throw new ApiError(404, "Invalid or expired unsubscribe link");

  subscriber.isActive = false;
  await subscriber.save();

  return subscriber;
};

export const getAllSubscribers = async () => {
  const subscribers = await Subscriber.findAll({ order: [["createdAt", "DESC"]] });
  const activeCount = subscribers.filter((s) => s.isActive).length;

  return { total: subscribers.length, activeCount, subscribers };
};

// Batches sends so one bad address can't derail the run, and adds a short
// pause between batches to stay well under Gmail's per-minute sending rate
// (its hard cap is a daily quota - see sendEmail.js - but bursting hundreds
// of sends in a tight loop still risks throttling/soft-bouncing).
const BATCH_SIZE = 15;
const BATCH_DELAY_MS = 2000;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chunk = (list, size) => {
  const chunks = [];
  for (let i = 0; i < list.length; i += size) chunks.push(list.slice(i, i + size));
  return chunks;
};

export const sendNewsletterToSubscribers = async ({ subject, message, productIds = [] }) => {
  const subscribers = await Subscriber.findAll({ where: { isActive: true } });
  if (subscribers.length === 0) {
    throw new ApiError(400, "There are no active subscribers to send to");
  }

  let products = [];
  if (productIds.length) {
    products = await Product.findAll({
      where: { id: { [Op.in]: productIds }, publishStatus: "published" },
    });
  }

  const sent = [];
  const failed = [];

  for (const batch of chunk(subscribers, BATCH_SIZE)) {
    for (const subscriber of batch) {
      const unsubscribeUrl = buildUnsubscribeUrl(subscriber.unsubscribeToken);
      try {
        await sendNewsletterCampaignEmail({
          email: subscriber.email,
          subject,
          message,
          products,
          unsubscribeUrl,
        });
        sent.push(subscriber.email);
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
        failed.push(subscriber.email);
      }
    }
    await delay(BATCH_DELAY_MS);
  }

  return { total: subscribers.length, sentCount: sent.length, failedCount: failed.length, failed };
};
