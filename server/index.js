import dotenv from "dotenv"
import app from "./app.js"
import { connectDB } from "./config/db.js";
import { startReviewRequestCron } from "./cron/reviewRequestJob.js";
dotenv.config()

const port = process.env.PORT || 8000;

// Schema is managed exclusively via sequelize-cli migrations (see migrations/).
// sync({ alter: true }) is intentionally NOT used here - on a hosted DB it can
// generate unpredictable/breaking ALTER statements (e.g. it failed trying to
// convert Users.userRole to an enum type). Just verify the connection works.
const initDb = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
};

initDb();

// Only start the Express listener (and the cron scheduler, which needs a
// long-running process) when running outside Vercel's serverless environment
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
  startReviewRequestCron();
}

// Export default app for Vercel compatibility
export default app;