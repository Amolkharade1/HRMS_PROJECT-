
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProfileSettingsPage.css';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(location.state?.updatedUser || null);
  const [loading, setLoading] = useState(!location.state?.updatedUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.updatedUser) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('/api/users/profile');
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
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
    }
  }, [navigate, location.state]);

  const renderField = (label, value) => (
    <div className="profile-info-row" key={label}>
      <span className="profile-label">{label}</span>
      <span className="profile-value">{value || '-'}</span>
    </div>
  );

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div>
      <nav className="profile-navbar">
        <div className="profile-nav-links">
          <span>Profile Settings</span>
        </div>
      </nav>

      <div className="profile-container">
        <button className="profile-close-button" onClick={() => navigate('/homepage')}>
          &times;
        </button>

        <div className="profile-header">
         <img 
  src={
    userData?.profileImage 
      ? userData.profileImage.startsWith('http') 
        ? userData.profileImage 
        : `${axios.defaults.baseURL}${userData.profileImage}`
      : 'https://via.placeholder.com/120'
  } 
  alt="Profile" 
  className="profile-image" 
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/120';
  }}
/>
          <h2 className="profile-name">
            {userData?.firstName || ''} {userData?.lastName || ''}
          </h2>
          <button
            onClick={() => navigate('/edit-profile', { state: { currentUserData: userData } })}
            className="edit-profile-icon-btn"
          >
            Edit Profile
          </button>
        </div>

        <div className="profile-section-wrapper">
          <div className="profile-section">
            <div className="profile-section-title">Basic Information</div>
            <div className="profile-info-grid">
              {renderField('Employee ID', userData?.employeeId)}
              {renderField('User Name', userData?.username)}
              {renderField('First Name', userData?.firstName)}
              {renderField('Last Name', userData?.lastName)}
              {renderField('Email Address', userData?.email)}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Work Information</div>
            <div className="profile-info-grid">
              {renderField('Department', userData?.department)}
              {renderField('Role', userData?.zohoRole)}
              {renderField('Location', userData?.location)}
              {renderField('Employment Type', userData?.employmentType)}
              {renderField('Designation', userData?.designation)}
              {renderField('Employee Status', userData?.employeeStatus)}
              {renderField('Source Of Hire', userData?.sourceOfHire)}
              {renderField('Date Of Joining', userData?.dateOfJoining)}
              {renderField('Current Experience', userData?.currentExperience)}
              {renderField('Total Experience', userData?.totalExperience)}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Personal Details</div>
            <div className="profile-form-grid">
              {renderField('Date of Birth', userData?.dob)}
              {renderField('Expertise', userData?.expertise)}
              {renderField('Gender', userData?.gender)}
              {renderField('Marital Status', userData?.maritalStatus)}
              {renderField('About Me', userData?.aboutMe)}
            </div>
          </div>

          <div className="profile-section1">
            <div className="profile-section-title1">Identity Information</div>
            <div className="profile-info-grid1">
              {renderField('UAN', userData?.uanNO)}
              {renderField('PAN', userData?.panNO)}
              {renderField('Aadhaar', userData?.aadhaarNO)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;