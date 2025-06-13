const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskOwner: {
    type: String,
    required: [true, 'Please add a task owner'],
  },
  assignedTo: {
    type: String,
    required: [true, 'Please assign the task to someone'],
  },
  taskName: {
    type: String,
    required: [true, 'Please add a task name'],
    trim: true,
    maxlength: [100, 'Task name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  reminder: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['High', 'Moderate', 'Low'],
    default: 'Moderate',
  },
  status: {
    type: String,
    enum: ['Open', 'Completed'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', TaskSchema);