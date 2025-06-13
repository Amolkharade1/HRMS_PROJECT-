// AttendanceNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './AllNavBar.css';
import userlogo from '../assets/user logo.jpg';
import searchImg from '../assets/search.png';
import OverviewProfile from '../assets/OverviewProfile.jpg';
import settingIcon from '../assets/settings.png';
import notification from '../assets/Notification.png';

const AttendanceNavbar = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const quickActionsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    console.log('Searching for:', query);

    if (location.pathname === '/attendance') {
      alert(`Searching "${query}" on Attendance Summary page`);
      // Add your actual search logic here
    } else {
      alert(`Search is not supported on this page.`);
    }
  };

  return (
    <>
      <nav className="all-navbar">
        <div className="all-nav-links">
          <span tab active>
            MyData
          </span>
        </div>
        <div className="all-nav-icons">
          <button className="all-add_button" onClick={() => setShowQuickActions(!showQuickActions)}>
            +
          </button>
          {showQuickActions && (
            <div className="all-quick-actions-dropdown" ref={quickActionsRef}>
              <div className="all-dropdown-header">
                <span>Quick Actions</span>
                <img src={settingIcon} alt="Settings Icon" className="all-settings-icon" />
              </div>
              <input type="text" placeholder="Search" className="all-dropdown-search" />
              <ul className="all-dropdown-list">
                <li>Candidate</li>
                <li>Employee</li>
                <li>Department</li>
                <li>Designation</li>
                <li>Leave</li>
                <li>Address Proof</li>
                <li>Bonafide Letter</li>
                <li>Experience Letter</li>
                <li>Travel Request</li>
                <li>Travel Expense</li>
                <li>Task</li>
                <li>Exit Details</li>
              </ul>
            </div>
          )}

          {/* <img
            src={searchImg}
            alt="Search Icon"
            className="all-icon-button"
            onClick={() => setShowSearchInput(!showSearchInput)}
          /> */}

          {showSearchInput && (
            <input
              type="text"
              className="all-search-input"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchText);
                }
              }}
              autoFocus
            />
          )}

          <img src={notification} alt="Notification Bell" className="all-icon-button" />
          <img src={settingIcon} alt="Settings Icon" className="all-icon-button" />
          <Link to="/profile-settings">
            <img src={OverviewProfile} alt="User Profile" className="all-profile-pic" />
          </Link>
        </div>
      </nav>

      <div className="all-tabs">
        <Link to="/attendance" className={`all-tab ${location.pathname === '/attendance' ? 'active' : ''}`}>
          Attendance Summary
        </Link>

        <Link to="/attendanceshift" className={`all-tab ${location.pathname === '/attendanceshift' ? 'active' : ''}`}>Shift</Link>
        {/* <Link to="/attendanceshift" className="all-tab">
          Shift
        </Link> */}
      </div>
    </>
  );
};

export default AttendanceNavbar;
