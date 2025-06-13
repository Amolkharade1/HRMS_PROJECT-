const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
// Get all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get a single candidate by ID
router.get('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.json(candidate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Create a new candidate
router.post('/', async (req, res) => {
    try {
        const { email, mobile, panCard, aadhaarCard, uanNumber } = req.body;
        // Check for existing unique fields
        const existingFields = await Candidate.findOne({
            $or: [
                { email },
                { mobile },
                { panCard },
                { aadhaarCard },
                ...(uanNumber ? [{ uanNumber }] : [])
            ]
        });
        if (existingFields) {
            const duplicateFields = [];
            if (existingFields.email === email) duplicateFields.push('email');
            if (existingFields.mobile === mobile) duplicateFields.push('mobile');
            if (existingFields.panCard === panCard) duplicateFields.push('PAN card');
            if (existingFields.aadhaarCard === aadhaarCard) duplicateFields.push('Aadhaar card');
            if (uanNumber && existingFields.uanNumber === uanNumber) duplicateFields.push('UAN number');
            return res.status(409).json({
                success: false,
                message: 'Duplicate values found',
                duplicates: duplicateFields
            });
        }
        const newCandidate = new Candidate(req.body);
        await newCandidate.save();
        res.status(201).json({
            success: true,
            message: 'Candidate added successfully'
        });
    } catch (error) {
        console.error('Error saving candidate:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
// Update an existing candidate
router.put('/:id', async (req, res) => {
    try {
        // First check if the candidate exists
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }
        // Check for duplicate values in other documents
        const { email, mobile, panCard, aadhaarCard, uanNumber } = req.body;
        const existingFields = await Candidate.findOne({
            _id: { $ne: req.params.id }, // Exclude current candidate
            $or: [
                { email },
                { mobile },
                { panCard },
                { aadhaarCard },
                ...(uanNumber ? [{ uanNumber }] : [])
            ]
        });
        if (existingFields) {
            const duplicateFields = [];
            if (existingFields.email === email) duplicateFields.push('email');
            if (existingFields.mobile === mobile) duplicateFields.push('mobile');
            if (existingFields.panCard === panCard) duplicateFields.push('PAN card');
            if (existingFields.aadhaarCard === aadhaarCard) duplicateFields.push('Aadhaar card');
            if (uanNumber && existingFields.uanNumber === uanNumber) duplicateFields.push('UAN number');
            return res.status(409).json({
                success: false,
                message: 'Duplicate values found',
                duplicates: duplicateFields
            });
        }
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json({
            success: true,
            message: 'Candidate updated successfully',
            candidate: updatedCandidate
        });
    } catch (error) {
        console.error('Error updating candidate:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
// Delete a candidate
router.delete('/:id', async (req, res) => {
    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!deletedCandidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }
        res.json({
            success: true,
            message: 'Candidate deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
module.exports = router;