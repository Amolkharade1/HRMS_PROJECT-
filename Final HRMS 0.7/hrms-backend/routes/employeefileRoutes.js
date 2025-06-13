// const express = require('express');
// const router = express.Router();
// const upload = require('../middlewares/employeeuploadMiddleware');
// const { uploadEmployeeFile } = require('../controllers/EmployeefileController');

// // Corrected route to match frontend POST URL and file field name
// router.post('/Empuploads', upload.single('employeeFile'), uploadEmployeeFile);

// module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/employeeuploadMiddleware');
const EmployeeFile = require('../models/employeeFile');

// POST route (upload file)
const { uploadEmployeeFile } = require('../controllers/EmployeefileController');
router.post('/Empuploads', upload.single('employeeFile'), uploadEmployeeFile);

// ✅ GET route (inline logic here)
router.get('/employee-files', async (req, res) => {
  try {
    const files = await EmployeeFile.find().sort({ updatedAt: -1 }); // newest first
    res.status(200).json(files);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Server error while fetching files' });
  }
});

module.exports = router;
