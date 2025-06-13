// import React from 'react';
import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import DashboardNavbar from '../pages/DashboardNavbar';
import userlogo from '../assets/user logo.jpg';
import searchImg from '../assets/search.png';
import phoneIcon from '../assets/phoneIcon.png';
import settingIcon from '../assets/settings.png';
import notification from '../assets/Notification.png';

const Dashboard = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const quickActionsRef = useRef(null);

  // Close dropdown when clicking outside
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

  return (
    <div className="dashboard-container">
    
           <DashboardNavbar />
     
      {/* <div className="tabs">
        <button className="tab">Overview</button>
        <button className="tab active">Dashboard</button>
        <button className="tab">Calendar</button>
      </div> */}

      <div className="dashboard-main-content">
        <div className="dashboard-scrollable-content">
          <div className="dashboard-grid">
            <div className="dashboard-card birthday">
              <h3>Birthday</h3>
              <p>No birthdays today</p>
            </div>

            <div className="dashboard-card new-hires">
              <h3>New Hires</h3>
              <div className="dashboard-profile">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Clarkson" />
                <div>
                  <strong>Clarkson Walter</strong><br />
                  Administration - Management<br />
                  📞 +91 2392040320
                </div>
              </div>
              <div className="dashboard-profile">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Hazel" />
                <div>
                  <strong>Hazel Carter</strong><br />
                  Assistant Manager - Marketing<br />
                  📞 +91 2392082735
                </div>
              </div>
            </div>

            <div className="dashboard-card favorites">
              <h3>Favorites</h3>

              <div className="dashboard-favorite">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Olivia Smith" className="Fav-Icon" />
                <div className="dashboard-favorite-details">
                  <strong>Olivia Smith</strong>
                  <div className="dashboard-phone">
                    <img src={phoneIcon} alt="Phone" className="dashboard-phone-icon1" />
                    +91 2392131209
                  </div>
                </div>
              </div>

              <div className="dashboard-favorite">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Andrew Turner" className="Fav-Icon" />
                <div className="favorite-details">
                  <strong>Andrew Turner</strong>
                  <div className="dashboard-phone">
                    <img src={phoneIcon} alt="Phone" className="dashboard-phone-icon1" />
                    +91 2392063496
                  </div>
                </div>
              </div>

              <div className="dashboard-favorite">
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Clarkson Walter" className="Fav-Icon" />
                <div className="dashboard-favorite-details">
                  <strong>Clarkson Walter</strong>
                  <div className="dashboard-phone">
                    <img src={phoneIcon} alt="Phone" className="phone-icon1" />
                    +91 2392040320
                  </div>
                </div>
              </div>

              <div className="dashboard-favorite">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Lilly Williams" className="Fav-Icon" />
                <div className="dashboard-favorite-details">
                  <strong>Lilly Williams</strong>
                  <div className="dashboard-phone">
                    <img src={phoneIcon} alt="Phone" className="dashboard-phone-icon1" />
                    +91 2392011816
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card quick-links">
              <h3>Quick Links</h3>
              <p>No quick links</p>
            </div>

            <div className="dashboard-card announcements">
              <h3>Announcements</h3>
              <p>Welcome to Stoic HRMS</p>
              <span>02 May 12:49 PM</span>
            </div>

            <div className="dashboard-card leave-report">
              <h3>Leave Report</h3>
              <ul className="dashboard-leave-list">
                <li className="dashboard-leave-item casual">
                  <span className="dashboard-leave-count">0</span>
                  <div className="dashboard-leave-info">
                    <strong>Casual Leave</strong>
                    <p>Available 12 Day(s)</p>
                  </div>
                </li>
                <li className="dashboard-leave-item earned">
                  <span className="dashboard-leave-count">0</span>
                  <div className="dashboard-leave-info">
                    <strong>Earned Leave</strong>
                    <p>Available 12 Day(s)</p>
                  </div>
                </li>
                <li className="dashboard-leave-item lwop">
                  <span className="dashboard-leave-count">0</span>
                  <div className="dashboard-leave-info">
                    <strong>Leave Without Pay</strong>
                    <p>Available 0 Day(s)</p>
                  </div>
                </li>
                <li className="dashboard-leave-item paternity">
                  <span className="dashboard-leave-count">0</span>
                  <div className="dashboard-leave-info">
                    <strong>Paternity Leave</strong>
                    <p>Available 0 Day(s)</p>
                  </div>
                </li>
                <li className="dashboard-leave-item sabbatical">
                  <span className="dashboard-leave-count">0</span>
                  <div className="dashboard-leave-info">
                    <strong>Sabbatical Leave</strong>
                    <p>Available 0 Day(s)</p>
                  </div>
                </li>
                <li className="dashboard-leave-item sick">
                  <span className="dashboard-leave-count">0</span>
                  <div className="dashboard-leave-info">
                    <strong>Sick Leave</strong>
                    <p>Available 12 Day(s)</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="dashboard-card">
              <h3>Upcoming Holidays</h3>
              <p>No Data Found</p>
            </div>

            <div className="dashboard-card">
              <h3>My Pending Tasks</h3>
              <p>There are no tasks available</p>
            </div>

            <div className="dashboard-card">
              <h3>My Files</h3>
              <p>No Files Found</p>
            </div>

            <div className="dashboard-card">
              <h3>Work Anniversary</h3>
              <p>No work anniversaries today</p>
            </div>

            <div className="dashboard-card">
              <h3>Wedding Anniversary</h3>
              <p>No wedding anniversaries today</p>
            </div>

            <div className="dashboard-card">
              <h3>On Leave Today</h3>
              <p>None of your direct reportees are on leave today</p>
            </div>

            <div className="dashboard-card">
              <h3>Employee Engagement</h3>
              <p>No pending surveys</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
