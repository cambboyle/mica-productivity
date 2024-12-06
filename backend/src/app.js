const express = require("express");
const app = express();
const cors = require("cors");
const Task = require("./models/Task");
const auth = require("./middleware/auth");

// Middleware for JSON request body parsing
app.use(express.json());

// Enable CORS with specific options
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mica-productivity.vercel.app',
    'https://mica-productivity-git-main.vercel.app',
    'https://mica-productivity-cambboyle.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API!");
});

// Apply auth middleware to the /api/tasks route
app.get("/api/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
  }
});

module.exports = app;
