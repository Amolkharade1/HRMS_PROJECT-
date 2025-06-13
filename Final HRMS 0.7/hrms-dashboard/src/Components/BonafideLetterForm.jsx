import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BonafideLetterForm.css';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const BonafideLetterForm = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    requestDate: '',
    reasonForRequest: '',
    otherReason: '',
    dateOfJoining: '',
    designation: '',
    department: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/profile');
        const profile = res.data;

        setFormData(prev => ({
          ...prev,
          employeeId: profile.employeeId || '',
          dateOfJoining: profile.dateOfJoining?.substring(0, 10) || '',
          designation: profile.designation || '',
          department: profile.department || ''
        }));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem('userToken');
          navigate('/homepage');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If "otherReason", ensure only letters/spaces
    if (name === 'otherReason') {
      if (value !== '' && !/^[A-Za-z ]*$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Only letters and spaces allowed' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.requestDate) {
      newErrors.requestDate = 'Date of request is required';
    }

    if (!formData.reasonForRequest) {
      newErrors.reasonForRequest = 'Reason for request is required';
    }

    if (formData.reasonForRequest === 'other') {
      if (!formData.otherReason.trim()) {
        newErrors.otherReason = 'Please enter a reason';
      } else if (!/^[A-Za-z ]+$/.test(formData.otherReason)) {
        newErrors.otherReason = 'Only letters and spaces allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cancelBtn = () => navigate('/BonafideLetter');

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/bonafide-letter', formData);
      alert(response.data.message || 'Bonafide letter submitted!');
      navigate('/BonafideLetter');
    } catch (error) {
      console.error('Submission failed:', error);
      alert(error.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="bl-container">
      <div className="bl-header">
        <h2>Add Bonafide Letter</h2>
      </div>

      <div className="bl-form-box">
        <h3 className="bl-section-title">Bonafide Letter Details</h3>

        <div className="bl-form-row">
          <div className="bl-form-group">
            <label>Employee ID <span className="bl-required">*</span></label>
            <input
              type="text"
              name="employeeId"
              className="bl-input-field"
              value={formData.employeeId}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="bl-form-group">
            <label>Date of Request <span className="bl-required">*</span></label>
            <input
              type="date"
              name="requestDate"
              className="bl-input-field"
              value={formData.requestDate}
              onChange={handleChange}
            />
            {errors.requestDate && <span className="bl-error">{errors.requestDate}</span>}
          </div>
        </div>

        <div className="bl-form-row">
          <div className="bl-form-group">
            <label>Date of Joining</label>
            <input
              type="text"
              className="bl-input-field"
              value={formData.dateOfJoining}
              disabled
            />
          </div>
          <div className="bl-form-group">
            <label>Designation</label>
            <input
              type="text"
              className="bl-input-field"
              value={formData.designation}
              disabled
            />
          </div>
        </div>

        <div className="bl-form-row">
          <div className="bl-form-group">
            <label>Department</label>
            <input
              type="text"
              className="bl-input-field"
              value={formData.department}
              disabled
            />
          </div>
        </div>

        <div className="bl-form-row">
          <div className="bl-form-group">
            <label>Reason for Request <span className="bl-required">*</span></label>
            <select
              name="reasonForRequest"
              className="bl-input-field"
              value={formData.reasonForRequest}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="visa_application">Visa Application</option>
              <option value="higher_studies">Higher Studies</option>
              <option value="opening_bank_account">Opening a Bank Account</option>
              <option value="other">Other</option>
            </select>
            {errors.reasonForRequest && <span className="bl-error">{errors.reasonForRequest}</span>}
          </div>

          <div className="bl-form-group">
            <label>Enter the Reason <span className="bl-required">*</span></label>
            <input
              type="text"
              name="otherReason"
              className="bl-input-field"
              placeholder="If 'Other' is chosen"
              value={formData.otherReason}
              onChange={handleChange}
              disabled={formData.reasonForRequest !== 'other'}
              required={formData.reasonForRequest === 'other'}
            />
            {errors.otherReason && <span className="bl-error">{errors.otherReason}</span>}
          </div>
        </div>
        <div className="bl-form-actions bl-sticky-footer">
        <button className="bl-btn bl-blue" onClick={handleSubmit}>Submit</button>
        {/* <button className="bl-btn bl-blue" disabled>Submit and New</button>
        <button className="bl-btn bl-gray" disabled>Save Draft</button> */}
        <button className="bl-btn bl-gray" onClick={cancelBtn}>Cancel</button>
      </div>
      </div>

      <div className="bl-form-actions bl-sticky-footer">
        <button className="bl-btn bl-blue" onClick={handleSubmit}>Submit</button>
        {/* <button className="bl-btn bl-blue" disabled>Submit and New</button>
        <button className="bl-btn bl-gray" disabled>Save Draft</button> */}
        <button className="bl-btn bl-gray" onClick={cancelBtn}>Cancel</button>
      </div>
    </div>
  );
};

export default BonafideLetterForm;
