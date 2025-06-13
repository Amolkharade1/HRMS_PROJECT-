const express = require('express');
const Leave = require('../models/Leave');
const router = express.Router();

// POST: Apply for Leave
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json({ message: 'Leave application submitted successfully', leave });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all leaves
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

// PUT: Update a leave by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Optional: ensures validation is run
    });
    if (!updated) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update leave' });
  }
});

// DELETE: Delete a leave by ID
router.delete('/:id', async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete leave' });
  }
});

// Count leaves booked this year
router.get("/booked/count", async (req, res) => {
  try {
    const yearStart = new Date("2025-01-01");
    const yearEnd = new Date("2025-12-31");

    const count = await Leave.countDocuments({
      startDate: { $gte: yearStart, $lte: yearEnd },
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching booked leaves" });
  }
});

// Count absent months
router.get("/monthly/count", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const leaves = await Leave.find({
      $or: [
        {
          startDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
        {
          endDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      ],
    });

    res.json({ count: leaves.length });
  } catch (error) {
    console.error("Error fetching current month leave count:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
