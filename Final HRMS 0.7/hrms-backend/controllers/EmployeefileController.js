const EmployeeFile = require('../models/employeeFile');

exports.uploadEmployeeFile = async (req, res) => {
  try {
    const {
      name,
      description,
       sharedWithType,
      sharedWith,
      folder,
      expiryDate,
      isPolicy,
      noDeadline,
      enforceDeadline,
      ackDeadline,
      downloadAccess,
      notifyFeed,
      notifyEmail,
      permissions
    } = req.body;

    const newFile = new EmployeeFile({
      name,
      description,
       sharedWithType,
      sharedWith,
      folder,
      // expiryDate: expiryDate || null,
      isPolicy,
      noDeadline,
      enforceDeadline,
      // ackDeadline: ackDeadline || null,
      downloadAccess,
      notifyFeed,
      notifyEmail,
      permissions: JSON.parse(permissions), // Parse from frontend stringified object
      filePath: req.file?.path || ''
    });

    await newFile.save();
    res.status(201).json({ message: 'Employee file uploaded successfully', file: newFile });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error while uploading file' });
  }
};
