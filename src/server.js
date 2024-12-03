const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const { router: auth, authMiddleware } = require('./routes/auth');
require("dotenv").config();

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for CORS
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
  exposedHeaders: ["x-auth-token"],
  credentials: true
};

app.use(cors(corsOptions));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// Routes
// Public routes
app.use("/api/auth", auth);

// Protected routes
app.use("/api/tasks", authMiddleware, taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
    await sequelize.sync({ alter: true });
    console.log("Models synchronized!");
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
