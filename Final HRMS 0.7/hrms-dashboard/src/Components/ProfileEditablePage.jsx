import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileSettingsPage.css';

// Configure axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Add request interceptor for auth token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const EditProfileSettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    nickname: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    zohoRole: '',
    location: '',
    employmentType: '',
    designation: '',
    employeeStatus: '',
    sourceOfHire: '',
    dateOfJoining: '',
    currentExperience: '',
    totalExperience: '',
    uanNO: '',
    panNO: '',
    aadhaarNO: '',
    dob: '',
    expertise: '',
    gender: '',
    maritalStatus: '',
    aboutMe: '',
    profileImage: null,
    previewImage: 'https://via.placeholder.com/120'
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setFormData(prev => ({
          ...prev,
          ...response.data,
          nickname: response.data.username || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          department: response.data.department || '',
          designation: response.data.designation || '',
          aboutMe: response.data.aboutMe || '',
          previewImage: response.data.profileImage || 'https://via.placeholder.com/120'
        }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('userToken');
          navigate('/homepage');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          previewImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'previewImage') return;
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, typeof value === 'string' ? value : String(value));
        }
      });

      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await axios.put('/api/users/profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUserData = {
  ...response.data,
  profileImage: response.data.profileImage || 'https://via.placeholder.com/120'
};
      console.log('✅ Profile updated successfully:', response.data);
      setSuccess(true);
      // ONLY CHANGE MADE - pass the response data through navigation state
      navigate('/profile-settings', { state: { updatedUser: updatedUserData  } });

    } catch (error) {
      const errorMsg = error.response?.data?.message ||
                     error.response?.data?.error ||
                     error.message ||
                     'Update failed';
      setError(errorMsg);
      console.error('Update error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderEditableField = (label, name, value, type = "text", options = [], disabledField = false, placeholder = '') => (
    <div className="profile-info-row" key={name}>
      <label className="profile-label">{label}</label>
      {type === 'select' ? (
        <select
          className="profile-value"
          name={name}
          value={value}
          onChange={handleChange}
          disabled={loading || disabledField}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          className="profile-value"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={loading || disabledField}
        />
      )}
    </div>
  );

  return (
    <div>
      <nav className="profile-navbar">
        <div className="profile-nav-links">
          <span>Edit Profile</span>
        </div>
      </nav>

      <div className="profile-container">
        <button 
          className="profile-close-button" 
          onClick={() => navigate('/homepage')}
          disabled={loading}
        >
          &times;
        </button>

        <div className="profile-header">
          <img src={formData.previewImage} alt="Profile" className="profile-image" />
          <h2 className="profile-name1">{formData.firstName} {formData.lastName}</h2>
          <div className="profile-upload-container">
            <label htmlFor="profileImageUpload" className="custom-upload-btn">
              Choose Profile
            </label>
            <input
              type="file"
              id="profileImageUpload"
              className="hidden-file-input"
              accept="image/*"
              name='profileImage'
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="profile-section-wrapper">
          <div className="profile-section">
            <div className="profile-section-title">Basic Information</div>
            <div className="profile-info-grid">
              {renderEditableField('Employee ID', 'employeeId', formData.employeeId)}
              {renderEditableField('User Name', 'nickname', formData.nickname, 'text', [], true)}
              {renderEditableField('First Name', 'firstName', formData.firstName)}
              {renderEditableField('Last Name', 'lastName', formData.lastName)}
              {renderEditableField('Email Address', 'email', formData.email, 'text', [], true)}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Work Information</div>
            <div className="profile-info-grid">
              {renderEditableField('Department', 'department', formData.department, 'select', ['HR', 'Development', 'Marketing', 'Management'])}
              {renderEditableField('Role', 'zohoRole', formData.zohoRole)}
              {renderEditableField('Location', 'location', formData.location)}
              {renderEditableField('Employment Type', 'employmentType', formData.employmentType, 'select', ['Permanent', 'Contract', 'Intern'])}
              {renderEditableField('Designation', 'designation', formData.designation, 'select', ['CEO', 'Manager', 'Team Lead', 'Software Engineer', 'HR Executive', 'Intern'])}
              {renderEditableField('Employee Status', 'employeeStatus', formData.employeeStatus, 'select', ['Active', 'Inactive', 'Resigned'])}
              {renderEditableField('Source Of Hire', 'sourceOfHire', formData.sourceOfHire, 'select', ['Referral', 'LinkedIn', 'Naukri', 'Internal'])}
              {renderEditableField('Date Of Joining', 'dateOfJoining', formData.dateOfJoining, 'text', [], false, 'YYYY-MM-DD')}
              {renderEditableField('Current Experience', 'currentExperience', formData.currentExperience)}
              {renderEditableField('Total Experience', 'totalExperience', formData.totalExperience)}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Personal Details</div>
            <div className="profile-form-grid">
              {renderEditableField('Date of Birth', 'dob', formData.dob, 'text', [], false, 'YYYY-MM-DD')}
              {renderEditableField('Ask Me About/Expertise', 'expertise', formData.expertise)}
              {renderEditableField('Gender', 'gender', formData.gender, 'select', ['Male', 'Female', 'Other'])}
              {renderEditableField('Marital Status', 'maritalStatus', formData.maritalStatus, 'select', ['Single', 'Married', 'Divorced', 'Widowed'])}
              {renderEditableField('About Me', 'aboutMe', formData.aboutMe)}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Identity Information</div>
            <div className="profile-info-grid">
              {renderEditableField('UAN', 'uanNO', formData.uanNO)}
              {renderEditableField('PAN', 'panNO', formData.panNO)}
              {renderEditableField('Aadhaar', 'aadhaarNO', formData.aadhaarNO)}
            </div>
          </div>
        </div>

        <div className="profile-button-row">
          <button 
            className="profile-btn profile-btn-save" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="profile-btn profile-btn-cancel" 
            onClick={() => navigate('/profile-settings')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Profile updated successfully!</div>}
      </div>
    </div>
  );
};

export default EditProfileSettingsPage;
