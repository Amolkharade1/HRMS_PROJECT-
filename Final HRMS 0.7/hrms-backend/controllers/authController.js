const UserLogin = require('../models/UserLogin');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { uploadMiddleware } = require('../middlewares/uploadMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'upload/images' }); // or diskStorage()
const path = require('path');
const fs = require('fs');
const uploadDir = 'upload/images';


// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExists = await UserLogin.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email or username');
  }

  // Create user
  const user = await UserLogin.create({
    username,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: 'Registration successful!'
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await UserLogin.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials. Password must be at least 8 characters and contain: 1 letter, 1 number, and 1 special character');
  }

  // Generate token
  try {
    const token = generateToken(user._id);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500);
    throw new Error('Could not generate authentication token');
  }
});

// @desc    Simple password reset (direct update)
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  // Basic validation
  if (!email || !newPassword) {
    res.status(400);
    throw new Error('Please provide email and new password');
  }

  // Find user by email
  const user = await UserLogin.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await UserLogin.findById(req.user.id).select('-password');
  
//   if (!user) {
//     res.status(404);
//     throw new Error('User not found');
//   }

//   res.status(200).json({
//     username: user.username,
//     email: user.email,
//     // Add any other fields you want to return
//   });
// });
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserLogin.findById(req.user.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    // Basic Information
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    employeeId: user.employeeId,
    
    // Work Information
    department: user.department,
    zohoRole: user.zohoRole,
    location: user.location,
    employmentType: user.employmentType,
    designation: user.designation,
    employeeStatus: user.employeeStatus,
    sourceOfHire: user.sourceOfHire,
    dateOfJoining: user.dateOfJoining,
    currentExperience: user.currentExperience,
    totalExperience: user.totalExperience,
    
    // Personal Details
    dob: user.dob,
    expertise: user.expertise,
    gender: user.gender,
    maritalStatus: user.maritalStatus,
    aboutMe: user.aboutMe,
    
    // Identity Information
    uanNO: user.uanNO,
    panNO: user.panNO,
    aadhaarNO: user.aadhaarNO,
    
    // Profile Image
    profileImage: user.profileImage
  });
});

// Protect middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback to checking cookies (if using them)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserLogin.findById(decoded.id).select('-password');
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await UserLogin.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.files && req.files.profileImage && req.files.profileImage.length > 0) {
  user.profileImage = `/upload/images/${req.files.profileImage[0].filename}`;
}


  const {
    username, email, firstName, lastName, department, designation, aboutMe,
    employeeId, nickname, zohoRole, location, employmentType, employeeStatus,
    sourceOfHire, dateOfJoining, currentExperience, totalExperience, uanNO,
    panNO, aadhaarNO, dob, expertise, gender, maritalStatus
  } = req.body;

  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (department !== undefined) user.department = department;
  if (designation !== undefined) user.designation = designation;
  if (aboutMe !== undefined) user.aboutMe = aboutMe;
  if (employeeId !== undefined) user.employeeId = employeeId;
  if (nickname !== undefined) user.nickname = nickname;
  if (zohoRole !== undefined) user.zohoRole = zohoRole;
  if (location !== undefined) user.location = location;
  if (employmentType !== undefined) user.employmentType = employmentType;
  if (employeeStatus !== undefined) user.employeeStatus = employeeStatus;
  if (sourceOfHire !== undefined) user.sourceOfHire = sourceOfHire;
  if (dateOfJoining !== undefined) user.dateOfJoining = dateOfJoining;
  if (currentExperience !== undefined) user.currentExperience = currentExperience;
  if (totalExperience !== undefined) user.totalExperience = totalExperience;
  if (uanNO !== undefined) user.uanNO = uanNO;
  if (panNO !== undefined) user.panNO = panNO;
  if (aadhaarNO !== undefined) user.aadhaarNO = aadhaarNO;
  if (dob !== undefined) user.dob = dob;
  if (expertise !== undefined) user.expertise = expertise;
  if (gender !== undefined) user.gender = gender;
  if (maritalStatus !== undefined) user.maritalStatus = maritalStatus;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    department: updatedUser.department,
    designation: updatedUser.designation,
    aboutMe: updatedUser.aboutMe,
    employeeId: updatedUser.employeeId,
    nickname: updatedUser.nickname,
    zohoRole: updatedUser.zohoRole,
    location: updatedUser.location,
    employmentType: updatedUser.employmentType,
    employeeStatus: updatedUser.employeeStatus,
    sourceOfHire: updatedUser.sourceOfHire,
    dateOfJoining: updatedUser.dateOfJoining,
    currentExperience: updatedUser.currentExperience,
    totalExperience: updatedUser.totalExperience,
    uanNO: updatedUser.uanNO,
    panNO: updatedUser.panNO,
    aadhaarNO: updatedUser.aadhaarNO,
    dob: updatedUser.dob,
    expertise: updatedUser.expertise,
    gender: updatedUser.gender,
    maritalStatus: updatedUser.maritalStatus,
  profileImage: updatedUser.profileImage || null, // Just return the path without base URL
    message: 'Profile updated successfully'
  });
});
module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  getUserProfile,
  protect,
  updateUserProfile,
  
};