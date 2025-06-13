import React, { useState, useEffect,useRef, } from 'react';
import './Home.css';
import OverviewImage from '../assets/BackWall.png';
import OverviewProfile from '../assets/OverviewProfile.jpg';
import logoImg from '../assets/HRMS.jpg';
import DashboardNavbar from '../pages/DashboardNavbar';
import { FiBriefcase, FiSliders } from 'react-icons/fi';
import { CiLock } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Home({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Activities');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [userProfile, setUserProfile] = useState({
    profileImage: OverviewProfile,
    firstName: '',
    lastName: '',
    designation: ''
  });
  const [loading, setLoading] = useState(true);

  const [tabVisibility, setTabVisibility] = useState({
    Activities: true,
    Feeds: true,
    Profile: true,
    Approvals: true,
    Leave: true,
    Attendance: true,
    Timesheets: true,
    Jobs: false,
    Files: false,
    "HR Process": false,
    "Career History": false,
    Goals: false,
    Feedback: false,
    "Related Data": false
  });

const settingsDropdownRef = useRef(null);
  useClickOutside(settingsDropdownRef, () => {
    setShowSettingsDropdown(false);
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        const userData = response.data;

        setUserProfile({
          profileImage: userData.profileImage
            ? userData.profileImage.startsWith('http')
              ? userData.profileImage
              : `${axios.defaults.baseURL}${userData.profileImage}`
            : OverviewProfile,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          designation: userData.designation || 'Team Member'
        });

      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Set dynamic greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    };

    const updateDay = () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date().getDay();
      return days[today];
    };

    // Set initial greeting
    setGreetingMessage(updateGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreetingMessage(updateGreeting());
    }, 60000); // every 60 seconds

    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);


  const handleToggleChange = (tab) => {
    setTabVisibility(prev => {
      const currentlyEnabledTabs = Object.keys(prev).filter(key => prev[key]);
      const isTurningOn = !prev[tab];

      if (isTurningOn) {
        if (currentlyEnabledTabs.length < 10) {
          return { ...prev, [tab]: true };
        } else {
          const newTabVisibility = { ...prev };
          const tabToTurnOff = currentlyEnabledTabs[9];
          newTabVisibility[tabToTurnOff] = false;
          newTabVisibility[tab] = true;
          return newTabVisibility;
        }
      } else {
        return { ...prev, [tab]: false };
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    onLogout();
  };

  if (loading) {
    return (
      <div className="home-loading-container">
        <div className="home-loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }




  return (
    <div>
      <DashboardNavbar />
      <div className="home-container">
        <div
          className="Home-header-image"
          style={{ backgroundImage: `url(${OverviewImage})` }}
        />

        <button className="home-top-right-button" onClick={() => setShowMenuModal(true)}>
          <IoIosMore />
        </button>
        {showMenuModal && (
          <div className="home-modal-overlay" onClick={() => setShowMenuModal(false)}>
            <div className="home-menu-modal" onClick={(e) => e.stopPropagation()}>
              <button className="home-close-button" onClick={() => setShowMenuModal(false)}>×</button>
              <ul className="home-modal-options">
                <li onClick={() => {
                  setShowMenuModal(false);
                  navigate("/profile-settings");
                }}>
                  Profile Settings
                </li>
                <li className="logout-item" onClick={handleLogout}>Log Out</li>

              </ul>
            </div>
          </div>
        )}

        <div className="left-panel">
          <div className="Home-profile-card">
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="Home-profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = OverviewProfile;
              }}
            />
            <h1 className="home-user-id">
              <span className="home-user-name">
                {userProfile.firstName} {userProfile.lastName}
              </span>
            </h1>
            <p className="home-user-role">{userProfile.designation}</p>
            <p
              className={`home-current-day ${['Sunday', 'Saturday'].includes(currentDay) ? 'red' : 'normal'}`}
            >
              {currentDay}
            </p>


            <div className="home-time-display">
              <span className="home-time-part">00</span><span className="home-time-separator">:</span>
              <span className="home-time-part">00</span><span className="home-time-separator">:</span>
              <span className="home-time-part">00</span>
            </div>
            <button className="home-check-in-button">Clock-in</button>
          </div>

          <div className="home-reportees-card">
            <h3 className="section-title">Reportees</h3>
            <ul className="home-reportee-list">
              {[...Array(5)].map((_, i) => (
                <li key={i}>
                  <img src={OverviewProfile} alt="Reportee" className="home-reportee-avatar" />
                  S{19 + i} - Christopher Brown
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="home-main-panel">
          <div className='Home-navdiv'>
            <nav className="home-nav-tabs">
              <div className="home-tab-group">
                {Object.entries(tabVisibility).map(([tabName, isVisible]) =>
                  isVisible && (
                    <span
                      key={tabName}
                      className={`home-tab ${activeTab === tabName ? 'active' : ''}`}
                      onClick={() => setActiveTab(tabName)}
                    >
                      {tabName}
                    </span>
                  )
                )}
              </div>

              <span className="home-tab home-settings-icon" onClick={() => {
                setShowSettingsDropdown(prev => !prev);
                setShowDropdown(false);
              }}>
                <FiSliders />
              </span>
            </nav>

            {showSettingsDropdown && (
              <div className="home-settings-dropdown" ref={settingsDropdownRef}>
                <div className="home-dropdown-item" disabled>
                  Activities
                  <label className="homeswitch-disabled">
                    <CiLock />
                  </label>
                </div>
                {[
                  "Feeds", "Profile", "Approvals", "Leave", "Attendance", "Timesheets",
                  "Jobs", "Files", "HR Process", "Career History", "Goals", "Feedback", "Related Data"
                ].map(tab => (
                  <div className="home-dropdown-item" key={tab}>
                    {tab}
                    <label className="home-switch">
                      <input
                        type="checkbox"
                        checked={tabVisibility[tab]}
                        onChange={() => handleToggleChange(tab)}
                      />
                      <span className="home-slider round"></span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="home-scrollable-section">
            {activeTab === 'Activities' && (
              <div className="Activeties-section">
                {/* <div className="demo-banner">
                  <div className="demo-text">
                    <h2 className="demo-title">Schedule a free demo</h2>
                    <p className="demo-subtitle">
                      Get an expert walkthrough, tailored to your business needs.
                    </p>
                  </div>
                  <button className="request-demo-btn">Request Demo</button>
                </div> */}

                {/* Dynamic Greeting */}
                <div className="home-morning-greeting">
                  <img src={logoImg} alt="HRMS Logo" className="hrms-logo" />
                  <div className="home-greeting-text">
                    <h2 className="home-good-morning">
                      {greetingMessage}{' '}
                      <span className="home-greeting-name">
                        {userProfile.firstName} {userProfile.lastName}
                      </span>
                    </h2>
                    <p className="home-day-wish">Have a productive day!</p>
                  </div>
                </div>

                <div className="home-check-in-reminder">
                  <div className="home-check-in-icon">📅</div>
                  <div className="home-check-in-content">
                    <p className="home-reminder-text">Check-in reminder</p>
                    <p className="home-reminder-detail">Your shift has already started</p>
                    <p className="home-reminder-time">
                      <strong>General</strong> – 9:30 AM - 6:30 PM
                    </p>
                  </div>
                </div>

                <div className="home-work-schedule-extended">
                  <div className="home-work-schedule-header">
                    <FiBriefcase className="home-schedule-icon" />
                    <div>
                      <h3 className="home-section-title home-colored-title">Work Schedule</h3>
                      <p className="home-schedule-dates">04-May-2025 - 10-May-2025</p>
                    </div>
                  </div>
                  <div className="home-shift-box">
                    <strong>General</strong> <br />
                    <span className="home-shift-time">9:30 AM - 6:30 PM</span>
                  </div>
                  <div className="home-week-timeline">
                    {[...Array(7)].map((_, i) => {
                      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      const statuses = ["Weekend", "Absent", "Absent", "Absent", "Today", "", "Weekend"];
                      const dates = ["04", "05", "06", "07", "08", "09", "10"];
                      return (
                        <div className="home-day-status" key={i}>
                          <span className="home-day-label">{days[i]}</span>
                          <span className={`home-day-date ${i === 4 ? 'home-highlight-date' : ''}`}>{dates[i]}</span>
                          <span className={`home-status-label ${statuses[i].toLowerCase()}`}>{statuses[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Feeds' && (
              <div className='Feeds-section'>
                <h3 className="section-title">Feeds</h3>
                <div className="feeds-content">
                  <p>No new updates available.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
