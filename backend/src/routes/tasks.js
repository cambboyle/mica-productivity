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

    console.log('Fetching tasks with conditions:', filterConditions);
    const tasks = await Task.findAll({
      attributes: ['id', 'userId', 'title', 'description', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt'],
      where: filterConditions,
      order: [['createdAt', 'DESC']],
      raw: true
    });

    console.log(`Found ${tasks.length} tasks for user ${req.user.id}`);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

// POST: Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;
    console.log('Creating new task for user:', req.user.id);
    console.log('Task data:', { title, description, priority, dueDate, status });

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Strict date validation
    if (!dueDate) {
      return res.status(400).json({ error: "Due date is required" });
    }

    // Check if the date string matches YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return res.status(400).json({ error: "Invalid date format. Please use the date picker" });
    }

    // Validate that it's a real date
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid date. Please select a valid date" });
    }

    // Additional validation for reasonable date values
    const [year, month, day] = dueDate.split('-').map(Number);
    const isValidDate = (year >= 2000 && year <= 2100) && // reasonable year range
                       (month >= 1 && month <= 12) &&      // valid month
                       (day >= 1 && day <= 31);            // valid day
    
    if (!isValidDate) {
      return res.status(400).json({ error: "Invalid date values. Please select a valid date" });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      priority: priority || 'medium',
      dueDate: date,
      status: status || 'todo'
    });

    console.log('Task created:', task.toJSON());
    res.status(201).json(task.get({ plain: true }));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

// PUT: Update a task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log(`Updating task ${id} for user ${req.user.id}`);
    console.log('Updates:', updates);

    const task = await Task.findOne({
      attributes: ['id', 'userId', 'title', 'description', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt'],
      where: {
        id,
        userId: req.user.id
      },
      raw: true
    });

    if (!task) {
      console.log(`Task ${id} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.update(
      {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        dueDate: updates.dueDate,
        status: updates.status
      },
      {
        where: { id, userId: req.user.id },
        returning: ['id', 'userId', 'title', 'description', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt']
      }
    );

    const updatedTask = await Task.findOne({
      attributes: ['id', 'userId', 'title', 'description', 'priority', 'dueDate', 'status', 'createdAt', 'updatedAt'],
      where: { id, userId: req.user.id },
      raw: true
    });

    console.log('Task updated:', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting task ${id} for user ${req.user.id}`);

    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!task) {
      console.log(`Task ${id} not found for user ${req.user.id}`);
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    console.log(`Task ${id} deleted successfully`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

module.exports = router;
