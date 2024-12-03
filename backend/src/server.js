const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const auth = require("./middleware/auth");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const preferenceRoutes = require("./routes/preferences");

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://mica-productivity.vercel.app",
    "https://mica-productivity-git-main.vercel.app",
    "https://mica-productivity-cambboyle.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
  exposedHeaders: ["x-auth-token"],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Mica Productivity API is running");
});

// Routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/preferences", auth, preferenceRoutes);

const PORT = process.env.PORT || 5000;

// Database connection and sync
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await sequelize.sync();
    console.log("Database synchronized successfully.");
    
    // Only start listening after database is ready
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

// Initialize the application
initializeDatabase();
