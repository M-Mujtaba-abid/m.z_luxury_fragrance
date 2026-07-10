
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

const app = express();
dotenv.config();

// ------------------- Middleware -------------------



app.use(cors({
  origin: ["https://luxuryfragrancemz.vercel.app" , "http://localhost:5173"],
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
// app.use("/record", webhookRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Ecommerce API Running...");
});

// Error middleware (last)
app.use(errorMiddleware);

// ------------------- Database & Server -------------------

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test DB connection
    console.log("Postgres + Sequelize connected successfully");

    await sequelize.sync({ alter: true }); // Sync all models
    console.log("All models synced successfully");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1); // stop server if DB fails
  }
};

startServer();

export default app;
