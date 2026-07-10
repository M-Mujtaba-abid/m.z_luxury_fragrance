import dotenv from "dotenv"
import app from "./app.js"
import { connectDB, sequelize } from "./config/db.js";
dotenv.config()

const port = process.env.PORT || 8000;

// Connect to database and sync models
const initDb = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("All models synced successfully");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
};

initDb();

// Only start the Express listener when running outside Vercel's serverless environment
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
}

// Export default app for Vercel compatibility
export default app;