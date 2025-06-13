const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  companyVehicle: { type: String },
  equipments: { type: String },
  libraryBooks: { type: String },
  security: { type: String },
  exitInterview: { type: String },
  noticePeriod: { type: String },
  resignationLetter: { type: String },
  managerClearance: { type: String },
});

const exitDetailSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  separationDate: { type: String, required: true },
  interviewer: { type: String, required: true },
  reasonForLeaving: { type: String },
  rejoinOrganization: { type: String },
  likedMost: { type: String },
  improveStaffWelfare: { type: String },
  additionalComments: { type: String },
  checklist: { type: checklistSchema },
}, { timestamps: true });

module.exports = mongoose.model('ExitDetail', exitDetailSchema);