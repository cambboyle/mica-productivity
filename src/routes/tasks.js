const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET: Fetch tasks with optional filters
router.get("/", async (req, res) => {
  try {
    const { priority, status } = req.query;
    let filterConditions = {
      userId: req.user.id // Add user context from auth middleware
    };

    if (priority) filterConditions.priority = priority;
    if (status) filterConditions.status = status;

    const tasks = await Task.findAll({
      where: filterConditions,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST: Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, tags } = req.body;

    // Basic validation: Ensure that required fields are provided
    if (!title || !priority) {
      return res.status(400).json({ error: "Title and priority are required" });
    }

    // Create the task with user context
    const newTask = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      tags,
      userId: req.user.id // Add user context from auth middleware
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT: Update task status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, priority, dueDate } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Update task properties
    task.status = status || task.status;
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
