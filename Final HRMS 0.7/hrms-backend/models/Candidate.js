const mongoose = require('mongoose');
const CandidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, 'Mobile number must be a 10-digit number']
  },
  status: { type: String, default: "In Progress" },
  department: { type: String, required: true },
  sourceOfHire: { type: String, required: true },
  expectedJoiningDate: { type: Date },
  panCard: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN number must be valid (e.g. ABCDE1234F)']
  },
  aadhaarCard: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{12}$/, 'Aadhaar number must be a 12-digit number']
  },
  uanNumber: {
    type: String,
    match: [/^[0-9]{12}$/, 'UAN number must be a 12-digit number'],
    unique: true,
    sparse: true
  },
  currentLocation: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Candidate', CandidateSchema);