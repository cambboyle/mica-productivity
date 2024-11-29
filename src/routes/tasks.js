const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// POST: Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, tags } = req.body;

    // Basic validation: Ensure that required fields are provided
    if (!title || !priority) {
      return res.status(400).json({ error: "Title and priority are required" });
    }

    // Create the task
    const newTask = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      tags,
    });

    res.status(201).json(newTask); // Send the created task back
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// GET: Fetch all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll(); // Fetch all tasks from the database
    res.status(200).json(tasks); // Send the tasks back
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// PUT: Update task status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = status; // Update the status
    await task.save(); // Save the changes

    res.status(200).json(task); // Return the updated task
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy(); // Delete the task from the database
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
