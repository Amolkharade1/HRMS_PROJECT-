// bonafideLetterValidator.js

exports.validateBonafideLetter = (req, res, next) => {
  const {
    employeeId,
    requestDate,
    reasonForRequest,
    otherReason
  } = req.body;

  // Required field validation
  if (!employeeId || !requestDate || !reasonForRequest) {
    return res.status(400).json({
      message: 'Employee ID, request date, and reason for request are required.'
    });
  }

  // Conditionally required: otherReason if "other" is selected
  if (reasonForRequest === 'other' && (!otherReason || otherReason.trim() === '')) {
    return res.status(400).json({
      message: 'Please specify the reason when selecting "Other".'
    });
  }

  next(); // Proceed to controller or next middleware
};
