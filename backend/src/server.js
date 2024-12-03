const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const auth = require("./middleware/auth");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Task = require("./models/Task");
const UserPreferences = require("./models/UserPreferences");

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
    "https://mica-productivity-cambboyle.vercel.app",
    "https://mica-productivity.herokuapp.com",
    "https://mica-productivity-4277d211fc20.herokuapp.com"
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
    console.log("Attempting to connect to the database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Define model associations
    User.hasMany(Task);
    Task.belongsTo(User);
    User.hasOne(UserPreferences);
    UserPreferences.belongsTo(User);

    console.log("Syncing database...");
    await sequelize.sync();
    console.log("Database synchronized successfully.");
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Environment:", process.env.NODE_ENV);
    });
  } catch (error) {
    console.error("Unable to connect to the database:");
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Initialize the application
initializeDatabase().catch(error => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
