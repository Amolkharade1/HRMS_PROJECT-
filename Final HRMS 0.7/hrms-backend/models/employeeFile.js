const mongoose = require('mongoose');

const onlyAlphabets = [/^[a-zA-Z\s]+$/, 'Only letters and spaces are allowed'];

const employeeFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    match: onlyAlphabets,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters'],
    match: [/^[a-zA-Z0-9\s.,!@#$%^&*()\-_=+]*$/, 'Description contains invalid characters']
  },
  sharedWithType: {
    type: String,
    trim: true,
    match: onlyAlphabets
  },
  sharedWith: {
    type: String,
    trim: true,
    match: onlyAlphabets
  },
  folder: {
    type: String,
    trim: true,
    match: onlyAlphabets
  },
  isPolicy: {
    type: Boolean,
    default: false
  },
  noDeadline: {
    type: Boolean,
    default: false
  },
  enforceDeadline: {
    type: Boolean,
    default: false
  },
  downloadAccess: {
    type: Boolean,
    default: true
  },
  notifyFeed: {
    type: Boolean,
    default: true
  },
  notifyEmail: {
    type: Boolean,
    default: false
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
    trim: true
  },
  permissions: {
    view: {
      employee: { type: Boolean, default: false },
      manager: { type: Boolean, default: false }
    },
    download: {
      employee: { type: Boolean, default: false },
      manager: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('EmployeeFile', employeeFileSchema);
