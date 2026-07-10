import dotenv from "dotenv"
import app from "./app.js"
import { connectDB, sequelize } from "./config/db.js";
dotenv.config()

const port = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log("All models synced successfully");

    // Start Express app
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
};

startServer();