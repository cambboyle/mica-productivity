const Task = require("../models/Task"); // Import the Task model

// Create a new task
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  const userId = req.user.id; // Get user ID from the authenticated request

  try {
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      userId, // Associate the task with the user ID
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tasks for the authenticated user
const getTasks = async (req, res) => {
  const userId = req.user.id; // Get user ID from the authenticated request

  try {
    const tasks = await Task.findAll({ where: { userId } }); // Fetch tasks for the authenticated user
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTask, getTasks };
