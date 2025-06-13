const mongoose = require('mongoose');

const onlyAlphabets = [/^[a-zA-Z\s]+$/, 'Only letters and spaces are allowed'];

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    match: onlyAlphabets,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    match: [/^[a-zA-Z\s]*$/, 'Only letters and spaces are allowed in description'],
    maxlength: [300, 'Description cannot exceed 300 characters'],
  },
  sharedWith: {
    type: String,
    required: [true, 'Shared With is required'],
    trim: true,
    match: onlyAlphabets,
  },
  folder: {
    type: String,
    required: [true, 'Folder is required'],
    trim: true,
    match: onlyAlphabets,
  },
  expiryDate: {
    type: Date,
  },
  isPolicy: {
    type: Boolean,
    default: false,
  },
  noDeadline: {
    type: Boolean,
    default: false,
  },
  enforceDeadline: {
    type: Boolean,
    default: false,
  },
  ackDeadline: {
    type: Date,
  },
  downloadAccess: {
    type: Boolean,
    default: true,
  },
  notifyFeed: {
    type: Boolean,
    default: true,
  },
  notifyEmail: {
    type: Boolean,
    default: false,
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('File', fileSchema);
