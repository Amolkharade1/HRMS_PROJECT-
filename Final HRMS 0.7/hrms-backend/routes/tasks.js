const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Public
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      taskOwner: req.body.taskOwner,
      assignedTo: req.body.assignedTo,
      taskName: req.body.taskName,
      description: req.body.description,
      startDate: req.body.startDate,
      dueDate: req.body.dueDate,
      reminder: req.body.reminder,
      priority: req.body.priority,
      status: req.body.status,
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.taskOwner = req.body.taskOwner || task.taskOwner;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.taskName = req.body.taskName || task.taskName;
    task.description = req.body.description || task.description;
    task.startDate = req.body.startDate || task.startDate;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.reminder = req.body.reminder || task.reminder;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.remove();
    res.status(200).json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;