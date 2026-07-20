
// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import dotenv from "dotenv"
// Import routes
import UserRoute from "./routes/user.route.js";
import ProductRoute from "./routes/product.route.js";
import cartItemRoute from "./routes/cartItem.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import webhookRoute from "./routes/webhook.route.js";
import reviewRoute from "./routes/review.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import compareRoute from "./routes/compare.route.js";
import contactRoute from "./routes/contact.route.js";
import testimonialRoute from "./routes/testimonial.route.js";

const app = express();
dotenv.config();

// ------------------- Middleware -------------------



const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.LOCAL_URL,
  "https://luxuryfragrancemz.vercel.app",
  "https://m-z-luxury-fragrance-61m9.vercel.app",
].filter(Boolean);
const isLocalhostOrigin = (origin) => /^http:\/\/localhost:\d+$/.test(origin);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

console.log(`ye hosted version he ${process.env.CLIENT_URL} and ye local host he ${process.env.LOCAL_URL} `)

app.use(cookieParser());
app.use("/record", webhookRoute);
app.use(express.json());

// ------------------- Routes -------------------

app.use("/user", UserRoute);
app.use("/product", ProductRoute);
app.use("/cartitem", cartItemRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);
app.use("/review", reviewRoute);
app.use("/wishlist", wishlistRoute);
app.use("/compare", compareRoute);
app.use("/contact", contactRoute);
app.use("/testimonial", testimonialRoute);
// app.use("/record", webhookRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Ecommerce API Running...");
});

// Error middleware (last)
app.use(errorMiddleware);

// ------------------- Database & Server -------------------
// Note: Database connection, sync, and server listening are managed in index.js

export default app;
