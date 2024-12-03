const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const auth = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const preferenceRoutes = require("./routes/preferences");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
  exposedHeaders: ["x-auth-token"],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/preferences", auth, preferenceRoutes);

const PORT = process.env.PORT || 5000;

// Database connection and sync
const initializeDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log("All models synchronized successfully!");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

// Initialize the application
initializeDatabase();
