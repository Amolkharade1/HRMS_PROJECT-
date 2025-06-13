

const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate'); // Import the validate middleware
const { uploadMiddleware } = require('../middlewares/uploadMiddleware1');
const multer = require('multer');
const upload = multer({ dest: 'upload/images' }); // or diskStorage()

// Register route
router.post(
  '/signup',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 8+ characters').isLength({ min: 8 })
  ],
  validate, // Add the validate middleware
  authController.registerUser
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validate, // Add the validate middleware
  authController.loginUser
);

// Reset password route
router.post(
  '/reset-password',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('newPassword', 'Password must be 8+ characters').isLength({ min: 8 })
  ],
  validate, // Add the validate middleware
  authController.resetPassword
);
// Add this to your authRoutes.js
router.get(
  '/profile',
  authController.protect, // Add this middleware if you want to protect the route
  authController.getUserProfile
);

router.put(
  '/profile',
  authController.protect,         
  uploadMiddleware,               
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('username', 'Username must be at least 2 characters').optional().isLength({ min: 2 })
  ],
  validate,                       
  authController.updateUserProfile
);


module.exports = router;