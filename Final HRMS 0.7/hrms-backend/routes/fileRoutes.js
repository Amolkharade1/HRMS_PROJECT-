const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const File = require('../models/File'); // 🔁 Import model
const { uploadFile } = require('../controllers/fileController');

// ✅ POST - Upload file
router.post('/uploads', upload.single('file'), uploadFile);

// ✅ GET - Fetch all organization files (Inline handler)
router.get('/organization-files', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

module.exports = router;
