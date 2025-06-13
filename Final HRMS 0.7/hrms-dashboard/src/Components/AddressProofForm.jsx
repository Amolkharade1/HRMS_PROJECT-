import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddressProofForm.css';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AddressProofForm = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    requestDate: '',
    reasonForRequest: '',
    otherReason: '',
    hasAddressChange: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    dateOfJoining: '',
    designation: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setFormData(prev => ({
          ...prev,
          employeeId: response.data.employeeId || '',
          dateOfJoining: response.data.dateOfJoining || '',
          designation: response.data.designation || ''
        }));
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          navigate('/homepage');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    if (type === 'text') {
      newValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employeeId.trim()) errors.employeeId = "Employee ID is required.";
    if (!formData.requestDate.trim()) errors.requestDate = "Request date is required.";
    if (!formData.reasonForRequest) errors.reasonForRequest = "Reason for request is required.";
    if (formData.reasonForRequest === 'other' && !formData.otherReason.trim()) {
      errors.otherReason = "Please specify the reason.";
    }
    if (!formData.hasAddressChange) errors.hasAddressChange = "Please select address change option.";
    if (formData.hasAddressChange === 'yes') {
      if (!formData.addressLine1.trim()) errors.addressLine1 = "Address Line 1 is required.";
      if (!formData.city.trim()) errors.city = "City is required.";
      if (!formData.state) errors.state = "State is required.";
      if (!formData.country) errors.country = "Country is required.";
      if (!formData.postalCode.trim()) errors.postalCode = "Postal Code is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = { ...formData };
      await axios.post('/api/address-proof', payload);
      alert('Submitted successfully!');
      navigate('/AddressProof');
    } catch (error) {
      console.error(error);
      alert('Submission failed');
    }
  };

  const cancelBtn = () => {
    navigate("/AddressProof");
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="ap-address-proof-container">
      <div className="ap-form-scroll-container">
        <div className="ap-header">
          <h2>Add Address Proof</h2>
        </div>

        <div className="ap-form-box">
          <h3 className="ap-section-title">Address Proof Details</h3>

          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>EmployeeID <span className="ap-required">*</span></label>
              <input type="text" name="employeeId" className="ap-input-field" value={formData.employeeId} onChange={handleChange} />
              {formErrors.employeeId && <small className="ap-error">{formErrors.employeeId}</small>}
            </div>
            <div className="ap-form-group">
              <label>Date of request <span className="ap-required">*</span></label>
              <input type="date" name="requestDate" className="ap-input-field" value={formData.requestDate} onChange={handleChange} />
              {formErrors.requestDate && <small className="ap-error">{formErrors.requestDate}</small>}
            </div>
          </div>

          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Date of Joining</label>
              <input type="text" name="dateOfJoining" className="ap-input-field" value={formData.dateOfJoining} disabled />
            </div>
            <div className="ap-form-group">
              <label>Designation</label>
              <input type="text" name="designation" className="ap-input-field" value={formData.designation} disabled />
            </div>
          </div>

          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Reason for request <span className="ap-required">*</span></label>
              <select name="reasonForRequest" className="ap-input-field" value={formData.reasonForRequest} onChange={handleChange}>
                <option value="">Select</option>
                <option value="address_change">Address Change</option>
                <option value="new_requirement">New Requirement</option>
                <option value="gas_connection">Gas Connection</option>
                <option value="broadband_connection">Broadband Connection</option>
                <option value="opening_bank_account">Opening a Bank Account</option>
                <option value="other">Other</option>
              </select>
              {formErrors.reasonForRequest && <small className="ap-error">{formErrors.reasonForRequest}</small>}
            </div>
            <div className="ap-form-group">
              <label>Enter the Reason for request <span className="ap-required">*</span></label>
              <input
                type="text"
                name="otherReason"
                className="ap-input-field"
                placeholder="If others is chosen"
                value={formData.otherReason}
                onChange={handleChange}
                disabled={formData.reasonForRequest !== 'other'}
              />
              {formData.reasonForRequest === 'other' && formErrors.otherReason && <small className="ap-error">{formErrors.otherReason}</small>}
            </div>
          </div>

          <div className="ap-form-row">
            <div className="ap-form-group ap-full-width">
              <label>Is there any change in Present address <span className="ap-required">*</span></label>
              <select name="hasAddressChange" className="ap-input-field" value={formData.hasAddressChange} onChange={handleChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {formErrors.hasAddressChange && <small className="ap-error">{formErrors.hasAddressChange}</small>}
            </div>
          </div>

          {formData.hasAddressChange === 'yes' && (
            <>
              <div className="ap-form-row">
                <div className="ap-form-group ap-full-width">
                  <h4 className="ap-subsection-title">New Present Address <span className="ap-required">*</span></h4>
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group ap-full-width">
                  <label>Address Line 1 <span className="ap-required">*</span></label>
                  <input type="text" name="addressLine1" className="ap-input-field" value={formData.addressLine1} onChange={handleChange} />
                  {formErrors.addressLine1 && <small className="ap-error">{formErrors.addressLine1}</small>}
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group ap-full-width">
                  <label>Address Line 2</label>
                  <input type="text" name="addressLine2" className="ap-input-field" value={formData.addressLine2} onChange={handleChange} />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label>City <span className="ap-required">*</span></label>
                  <input type="text" name="city" className="ap-input-field" value={formData.city} onChange={handleChange} />
                  {formErrors.city && <small className="ap-error">{formErrors.city}</small>}
                </div>
                <div className="ap-form-group">
                  <label>State <span className="ap-required">*</span></label>
                  <select name="state" className="ap-input-field" value={formData.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    <option value="MH">Maharashtra</option>
                    <option value="KA">Karnataka</option>
                  </select>
                  {formErrors.state && <small className="ap-error">{formErrors.state}</small>}
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label>Country <span className="ap-required">*</span></label>
                  <select name="country" className="ap-input-field" value={formData.country} onChange={handleChange}>
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                  </select>
                  {formErrors.country && <small className="ap-error">{formErrors.country}</small>}
                </div>
                <div className="ap-form-group">
                  <label>Postal Code <span className="ap-required">*</span></label>
                  <input type="text" name="postalCode" className="ap-input-field" value={formData.postalCode} onChange={handleChange} />
                  {formErrors.postalCode && <small className="ap-error">{formErrors.postalCode}</small>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="ap-form-actions">
        <button className="ap-btn ap-blue" onClick={handleSubmit}>Submit</button>
        
        <button className="ap-btn ap-gray" onClick={cancelBtn}>Cancel</button>
      </div>
    </div>
  );
};

export default AddressProofForm;