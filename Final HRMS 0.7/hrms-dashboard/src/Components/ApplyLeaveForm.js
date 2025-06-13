import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ApplyLeaveForm.css';

const ApplyLeaveForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    leaveType: '',
    duration: '',
    startDate: '',
    endDate: '',
    teamEmail: '',
    reason: ''
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update startDate and endDate in formData
    const updatedFormData = {
      ...formData,
      startDate: startDate ? startDate.toDateString() : '',
      endDate: endDate ? endDate.toDateString() : ''
    };

    try {
      const response = await fetch('http://localhost:8000/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        alert('Leave applied successfully!');
        // After successful submission, navigate to another page or reset form
        navigate('/leavesummary');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Something went wrong'}`);
      }
    } catch (error) {
      alert('Failed to submit the leave request. Please try again.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/leavesummary');
  };

  return (
    <div className="applyleave-container">
      <div className="applyleave-header">
        <h2>Apply Leave</h2>
      </div>
      <div className="applyleave-form-box">
        <form className="applyleave-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="applyleave-form-group">
            <label>Name <span className="applyleave-required">*</span></label>
            <input
              type="text"
              className="applyleave-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Leave Type */}
          <div className="applyleave-form-group">
            <label>Leave Type <span className="applyleave-required">*</span></label>
            <select
              className="applyleave-input"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Leave Without Pay">Leave Without Pay</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Sabbatical Leave">Sabbatical Leave</option>
            </select>
          </div>

          {/* Duration */}
          <div className="applyleave-form-group">
            <label>Duration <span className="applyleave-required">*</span></label>
            <select
              className="applyleave-input"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Full Day">Full Day</option>
              <option value="Multiple">Multiple</option>
              <option value="First Half">First Half</option>
              <option value="Second Half">Second Half</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="applyleave-form-group">
            <label>Date <span className="applyleave-required">*</span></label>
            <div className="applyleave-date-group">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="applyleave-input"
                dateFormat="dd-MMM-yyyy"
                placeholderText="Start Date"
                required
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="applyleave-input"
                dateFormat="dd-MMM-yyyy"
                placeholderText="End Date"
                required
              />
            </div>
          </div>

          {/* Team Email */}
          <div className="applyleave-form-group">
            <label>Team Email ID</label>
            <input
              type="email"
              className="applyleave-input"
              name="teamEmail"
              value={formData.teamEmail}
              onChange={handleChange}
            />
          </div>

          {/* Reason */}
          <div className="applyleave-form-group">
            <label>Reason for Leave</label>
            <textarea
              className="applyleave-textarea"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="applyleave-actions">
            <button type="submit" className="applyleave-submit-btn">Submit</button>
            <button type="button" className="applyleave-cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveForm;
