import cron from "node-cron";
import { Op } from "sequelize";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import sendReviewRequestEmail from "../utils/sendReviewRequestEmail.js";

const REVIEW_REQUEST_DELAY_DAYS = 2;

// Guest orders have no userId, and Reviews require one (see review.model.js),
// so guests are skipped - there's nowhere for them to actually leave a review.
const findDueOrders = async () => {
  const cutoff = new Date(Date.now() - REVIEW_REQUEST_DELAY_DAYS * 24 * 60 * 60 * 1000);

  return Order.findAll({
    where: {
      status: "delivered",
      reviewRequestSent: false,
      userId: { [Op.ne]: null },
      updatedAt: { [Op.lte]: cutoff },
    },
    include: [{ model: OrderItem, include: [{ model: Product, attributes: ["id", "title"] }] }],
  });
};

const processOrder = async (order) => {
  const productNames = [...new Set(order.OrderItems.map((item) => item.Product?.title || item.productName))];

  await sendReviewRequestEmail({ order, productNames });

  order.reviewRequestSent = true;
  await order.save();
};

export const runReviewRequestJob = async () => {
  const dueOrders = await findDueOrders();

  for (const order of dueOrders) {
    try {
      await processOrder(order);
    } catch (error) {
      console.error(`Failed to send review-request email for order #${order.id}:`, error);
    }
  }

  if (dueOrders.length) {
    console.log(`✅ Review-request emails processed for ${dueOrders.length} order(s)`);
  }
};

// Runs once a day at 10:00 server time - delivered orders past the delay
// window get picked up on the first run after they qualify.
export const startReviewRequestCron = () => {
  cron.schedule("0 10 * * *", () => {
    runReviewRequestJob().catch((error) => {
      console.error("Review-request cron run failed:", error);
    });
  });
};
