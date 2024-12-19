const express = require("express");
const app = express();
const cors = require("cors");
const { Task } = require("./models");
const auth = require("./middleware/auth");
const projectRoutes = require("./routes/projects");
const projectTaskRoutes = require("./routes/projectTasks");
const authRoutes = require("./routes/auth");
const { validate } = require('uuid');

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

// UUID validation middleware
const validateUUID = (req, res, next) => {
  const { projectId, taskId } = req.params;
  
  if (projectId && !validate(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID format' });
  }
  
  if (taskId && !validate(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }
  
  next();
};

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API!");
});

// Auth routes (no UUID validation needed)
app.use("/api/auth", authRoutes);

// Project and task routes
app.use("/api", [validateUUID], projectRoutes);
app.use("/api", [validateUUID], projectTaskRoutes);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

module.exports = app;
