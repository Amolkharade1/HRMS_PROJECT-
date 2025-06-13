// DashboardNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './AllNavBar.css';
import userlogo from '../assets/user logo.jpg';
import OverviewProfile from '../assets/OverviewProfile.jpg';
import searchImg from '../assets/search.png';
import phoneIcon from '../assets/phoneIcon.png';
import settingIcon from '../assets/settings.png';
import notification from '../assets/Notification.png';

const FileSavePageNavbar = () => {
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);

    // Add specific logic for searching in different routes
    if (location.pathname === '/homepage') {
      alert(`Searching "${query}" on Home Page`);
      // Implement actual search logic here
    } else if (location.pathname === '#') {
      alert(`Searching "${query}" on Dashboard`);
      // Implement actual search logic here
    } else {
      alert(`Search not available on this page`);
    }
  };

  return (
    <>
      <nav className="all-navbar">
        <Link to="/morefile" className={`all-nav-links ${location.pathname === '/morefile' ? 'active' : ''}`}>
          My Files
        </Link>

        <div className="all-nav-icons">
          <button className="all-add_button" onClick={() => setShowQuickActions(!showQuickActions)}>+</button>
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
        <Link to="/morefile" className={`all-tab ${location.pathname === '/morefile' ? 'active' : ''}`}>Shared with Me
</Link>
        {/* <Link to="/inner-employee-file" className={`all-tab ${location.pathname === '/inner-employee-file' ? 'active' : ''}`}>Shared with My Role</Link> */}
      </div>
    </>
  );
};

export default FileSavePageNavbar;
