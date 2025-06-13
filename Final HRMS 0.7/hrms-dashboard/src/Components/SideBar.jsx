import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css';
import logoImg from '../assets/HRMS.jpg';
import {
    MdHome, MdPersonAdd, MdTimeToLeave, MdAccessTime, MdSettings,
    MdBarChart, MdExpandMore, MdListAlt, MdMenu, MdInsertDriveFile,
    MdEmojiPeople, MdStarBorder, MdCardTravel, MdChecklist,
    MdAttachMoney, MdApartment
} from 'react-icons/md';

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const routeGroups = {
        '/AddressProof': ['/AddressProof', '/BonafideLetter', '/ExperienceLetter'], // HR Letters group
        '/MyTasks': ['/MyTasks','/TrackTasks', '/AllTasks', '/FormView','/AddTaskForm','/AddExitDetails','/ExitDetailsView'],                      // Tasks group
        '/morefile': ['/morefile', '/innerfilesave','/inner-employee-file','/inner-hr-forms-templates'],                                 // Files group
        '/exitdetails': ['/exitdetails'],  
        '/homepage': ['/homepage', '/dashboard','/profile-settings','/edit-profile'], // Home group 
        '/leavesummary': ['/leavesummary', '/applyleave', '/leavebalance', '/leaverequests','/shiftschedule'], // Leave Tracker group 
        '/exitdetails': ['/exitdetails','/add-exit-details'] // Exit Details group
    };

    const isActive = (path) => {
        if (routeGroups[path]) {
            return routeGroups[path].some((subPath) => currentPath.startsWith(subPath));
        }
        return currentPath.startsWith(path);
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="sidebar-mobile-header">
                <MdMenu onClick={() => setIsOpen(!isOpen)} className="sidebar-hamburger-icon" />
                <img src={logoImg} alt="HRMS Logo" className="sidebar-logo-img" />
                <span className="sidebar-mobile-logo">HRMS</span>
            </div>

            <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo-section">
                    <img src={logoImg} alt="HRMS Logo" className="sidebar-logo-img" />
                    <span className="sidebar-logo-text">HRMS</span>
                </div>

                <nav className="sidebar-Main-links">
                    <Link to="/homepage" className={`sidebar-Main-link ${isActive('/homepage') ? 'active' : ''}`}>
                        <MdHome /> Home
                    </Link>
                    <Link to="/onboarding" className={`sidebar-Main-link ${isActive('/onboarding') ? 'active' : ''}`}>
                        <MdPersonAdd /> Onboarding
                    </Link>
                    <Link to="/leavesummary" className={`sidebar-Main-link ${isActive('/leavesummary') ? 'active' : ''}`}>
                        <MdTimeToLeave /> Leave Tracker
                    </Link>
                    <Link to="/attendance" className={`sidebar-Main-link ${isActive('/attendance') ? 'active' : ''}`}>
                        <MdListAlt /> Attendance
                    </Link>
                    <a href="#" className="sidebar-Main-link">
                        <MdAccessTime /> Time Tracker
                    </a>
                    <Link to="/AddressProof" className={`sidebar-Main-link ${isActive('/AddressProof') ? 'active' : ''}`}>
                        <MdStarBorder /> HR Letters
                    </Link>
                    <Link to="/exitdetails" className={`sidebar-Main-link ${isActive('/exitdetails') ? 'active' : ''}`}>
                        <MdApartment /> General
                    </Link>
                    <Link to="/morefile" className={`sidebar-Main-link ${isActive('/morefile') ? 'active' : ''}`}>
                        <MdInsertDriveFile /> Files
                    </Link>
                    <Link to="/MyTasks" className={`sidebar-Main-link ${isActive('/MyTasks') ? 'active' : ''}`}>
                        <MdChecklist /> Tasks
                    </Link>
                </nav>
            </div>
        </>
    );
}
