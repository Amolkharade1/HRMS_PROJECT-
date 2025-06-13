const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userLoginSchema = new mongoose.Schema({

  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: false,
    trim: true,
    minlength: [2, 'Username must be at least 2 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
   password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'], // Changed from 8 to 6
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
   firstName: {
    type: String,
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  department: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  aboutMe: {
    type: String,
    trim: true,
    maxlength: [500, 'About me cannot exceed 500 characters']
  },
  profileImage: {
    type: String // This will store the path to the image
  },
  employeeId: { 
    type: String,
    unique: true
  },
  nickname: { type: String },
  zohoRole: { type: String },
  location: { type: String },
  employmentType: { type: String },
  employeeStatus: { type: String },
  sourceOfHire: { type: String },
  dateOfJoining: { type: String },
  currentExperience: { type: String },
  totalExperience: { type: String },
  uanNO: { type: String,unique: true },
  panNO: { type: String,unique: true },
  aadhaarNO: { type: String,unique: true},
  dob: { type: String },
  expertise: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
});
 


// Hash password before saving
userLoginSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update timestamp before update
userLoginSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});



userLoginSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Could not compare passwords');
  }
};

module.exports = mongoose.model('UserLogin', userLoginSchema);