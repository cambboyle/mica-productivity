const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// GET: Fetch tasks with optional filters
router.get("/", async (req, res) => {
  try {
    const { priority, status } = req.query;
    let filterConditions = {
      userId: req.user.id
    };

    if (priority) filterConditions.priority = priority;
    if (status) filterConditions.status = status;

    const tasks = await Task.findAll({
      where: filterConditions,
      order: [['createdAt', 'DESC']]
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
});

// POST: Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask = await Task.create({
      title,
      description,
      priority: priority || "medium",
      dueDate,
      status: status || "todo",
      userId: req.user.id
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Server error while creating task" });
  }
});

// PUT: Update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;
    const taskId = req.params.id;

    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update({
      title,
      description,
      priority,
      dueDate,
      status
    });

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error while updating task" });
  }
});

// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Server error while deleting task" });
  }
});

module.exports = router;
