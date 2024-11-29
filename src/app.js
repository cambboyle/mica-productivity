const express = require("express");
const app = express();
const cors = require("cors");

// Middleware for JSON request body parsing
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API!");
});

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.findAll(); //
  res.json(tasks);
});

module.exports = app;
