const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const candidatesRoutes = require('./routes/candidates');
const leaveRoutes = require('./routes/leaveRoutes');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const tasks = require('./routes/tasks');
const exitDetailsRouter = require('./routes/exitDetails');
const fileRoutes = require('./routes/fileRoutes'); // Existing file routes
const employeeFileRoutes = require('./routes/employeefileRoutes'); // ✅ New Employee File Routes

const HRAddressProofRoutes = require('./routes/HRAddressProofRoutes');
const bonafideRoutes = require('./routes/BonafideRoutes'); // ✅ Bonafide route import
const experienceLetterRoutes = require('./routes/ExperienceLetterRoutes'); // ✅ NEW
app.get("/", (req, res) => {
  res.send("✅ HRMS Backend is live and working!");
});



require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ CORS Configuration — use only this!
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/upload/images', express.static(path.join(__dirname, 'upload/images')));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static file serving (e.g. uploaded documents/images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/candidates', candidatesRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/users', authRoutes); // Signup/Login route
app.use('/api/tasks', tasks);
app.use('/api/exitdetails', exitDetailsRouter);
app.use('/api/files', fileRoutes);
app.use('/api/employeeFile', employeeFileRoutes); // ✅ New route added

app.use('/api', HRAddressProofRoutes);
app.use('/api', bonafideRoutes); // ✅ Bonafide route mount
app.use('/api', experienceLetterRoutes); // ✅ NEW





// Error handling
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// ✅ DB Connection and Server Start
// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('DB connection failed:', err);
//   });

