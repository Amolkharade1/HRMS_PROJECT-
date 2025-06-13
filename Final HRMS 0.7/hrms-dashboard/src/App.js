
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import Dashboard from './Components/Dashboard';
import DashboardNavbar from './pages/DashboardNavbar';
import Attendance from './Components/Attendance';
import AttendanceNavbar from './pages/AttendanceNavbar';
import Homepage from './Components/Home';
import MoreFile from './Components/FileSavePage';

import ProfileSettingsPage from './Components/ProfileSettingsPage';
import ProfileEditablePage from './Components/ProfileEditablePage';
import InnerOrganizationFile from './Components/InnerOrganizationFile';
import InnerEmployeeFile from './Components/InnerEmployeeFile';
import InnerHRFormsTemplates from './Components/InnerHR_Forms_Templates';
import Onboarding from './Components/Onboarding';
import OnboardingForm from './Components/OnboardingForm';

import LeaveSummary from './Components/LeaveSummary';
import ApplyLeaveForm from './Components/ApplyLeaveForm';
import LeaveBalance from './Components/LeaveBalance';
import LeaveRequests from './Components/LeaveRequests';
import ShiftSchedule from './Components/ShiftSchedule';
import Attendanceshift from './Components/AttendanceShift';

import MyTasks from "./Components/MyTasks";
import TrackTasks from "./Components/TrackTasks";
import AllTasks from "./Components/AllTasks";
import FormView from "./Components/FormView";
import AddTaskForm from "./Components/AddTaskForm";
import AddExitDetails from "./Components/AddExitDetails";
import ExitDetailsView from "./Components/ExitDetailsView";
import Login from './Components/Login';
import SignUp from './Components/SignUp';



import AddressProof from "./Components/AddressProof";
import AddressProofForm from "./Components/AddressProofForm";
import BonafideLetter from "./Components/BonafideLetter";
import BonafideLetterForm from './Components/BonafideLetterForm';
import ExperienceLetter from './Components/ExperienceLetter';
import ExperienceLetterForm from './Components/ExperienceLetterForm';
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {

        return localStorage.getItem('isAuthenticated') === 'true';
    });

    const handleLogin = (success) => {
        if (success) {
            setIsLoggedIn(true);
            localStorage.setItem('isAuthenticated', 'true');
        }
    };
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userToken'); // Clear the token as well
    }


    return (
        <Router>
            <div className="app-container">
                {isLoggedIn ? (
                    <>
                        <Sidebar />
                        <div className="main-content">
                            <Routes>

                                <Route path="/" element={<Navigate to="/homepage" />} />
                                <Route path="/homepage" element={<Homepage onLogout={handleLogout} />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/attendance" element={<Attendance />} />
                                <Route path="/homepage" element={<Homepage />} />
                                <Route path="/morefile" element={<MoreFile />} />
                                <Route path="/innerfilesave" element={<InnerOrganizationFile />} />
                                <Route path="/inner-hr-forms-templates" element={<InnerHRFormsTemplates />} />

                                <Route path="/profile-settings" element={<ProfileSettingsPage />} />
                                <Route path="/edit-profile" element={<ProfileEditablePage />} />
                                <Route path="/inner-employee-file" element={<InnerEmployeeFile />} />

                                <Route path="/onboarding" element={<Onboarding />} />
                                <Route path="/onboarding-form" element={<OnboardingForm />} />

                                <Route path="/leavesummary" element={<LeaveSummary />} />
                                <Route path="/applyleave" element={<ApplyLeaveForm />} />
                                <Route path="/leavebalance" element={<LeaveBalance />} />
                                <Route path="/leaverequests" element={<LeaveRequests />} />

                                <Route path="/shiftschedule" element={<ShiftSchedule />} />
                                <Route path="/attendanceshift" element={<Attendanceshift />} />


                                <Route path="/MyTasks" element={<MyTasks />} />
                                <Route path="/TrackTasks" element={<TrackTasks />} />
                                <Route path="/AllTasks" element={<AllTasks />} />
                                <Route path="/FormView" element={<FormView />} />
                                <Route path="/AddTaskForm" element={<AddTaskForm />} />
                                <Route path="/exitdetails" element={<ExitDetailsView />} />
                                <Route path="/add-exit-details" element={<AddExitDetails />} />
                                <Route path="/add-exit-details/:id" element={<AddExitDetails />} />

                                <Route path="/AddressProof" element={<AddressProof />} />
                                <Route path="/AddressProofForm" element={<AddressProofForm />} />
                                <Route path="/BonafideLetter" element={<BonafideLetter />} />
                                <Route path="/BonafideLetterForm" element={<BonafideLetterForm />} />
                                <Route path="/ExperienceLetter" element={<ExperienceLetter />} />
                                <Route path="/ExperienceLetterForm" element={<ExperienceLetterForm />} />

                            </Routes>
                        </div>
                    </>
                ) : (
                    <Routes>
                        <Route path="/" element={<Login onLogin={handleLogin} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );

};
export default App;