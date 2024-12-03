const express = require("express");
const app = express();
const cors = require("cors");

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

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

module.exports = app;
