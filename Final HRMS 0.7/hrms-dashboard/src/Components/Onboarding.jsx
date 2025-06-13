import React, { useEffect, useState, useRef } from "react";
import "./Onboarding.css";
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import OnboardingNavbar from "../pages/OnboardingNavbar";
const Onboarding = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Fetch all candidates
    useEffect(() => {
        fetchCandidates();
    }, []);
    const fetchCandidates = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/candidates");
            setCandidates(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch candidates.");
            setLoading(false);
        }
    };
    const handleEdit = async (candidate) => {
        const updatedStatus = prompt("Enter new status (e.g., Pending, Completed, In Progress):", candidate.status);
        if (updatedStatus && updatedStatus !== candidate.status) {
            try {
                await axios.put(`http://localhost:8000/api/candidates/${candidate._id}`, {
                    ...candidate,
                    status: updatedStatus
                });
                fetchCandidates();
                alert("Candidate status updated successfully.");
            } catch (error) {
                alert("Failed to update candidate status.");
            }
        }
        setOpenMenuIndex(null);
    };
    const handleDelete = async (candidateId) => {
        if (window.confirm("Are you sure you want to delete this candidate?")) {
            try {
                await axios.delete(`http://localhost:8000/api/candidates/${candidateId}`);
                setCandidates(prev => prev.filter(c => c._id !== candidateId));
                alert("Candidate deleted successfully.");
            } catch (error) {
                alert("Failed to delete candidate.");
            }
        }
        setOpenMenuIndex(null);
    };
    const toggleMenu = (index, e) => {
        e.stopPropagation(); // Prevent event from bubbling up to document
        setOpenMenuIndex(prev => (prev === index ? null : index));
    };
    const filteredCandidates = candidates.filter(candidate =>
        Object.values(candidate)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );
    return (
        <div className="app-layout">
            <main className="main-content">
                <OnboardingNavbar />
                <div className="view-controls">
                    <div className="view-dropdown-wrapper">
                        <header className="header">
                            {/* <h2>Candidate</h2> */}
                        </header>
                    </div>
                    <div className="header-right">
                        <div className="search-container">
                            <input
                                className="search-box"
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="search-icon" />
                        </div>
                        <Link to="/onboarding-form" className="add-btn">
                            <FaPlus style={{ marginRight: '6px' }} />
                            New Onboarding
                        </Link>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-scroll">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email Address</th>
                                    <th>Mobile Number</th>
                                    <th>Status</th>
                                    <th>Role</th>
                                    <th>Hiring Source</th>
                                    <th>PAN Card</th>
                                    <th>Aadhaar Card</th>
                                    <th>UAN Number</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="11">Loading...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan="11">{error}</td></tr>
                                ) : filteredCandidates.length > 0 ? (
                                    filteredCandidates.map((candidate, index) => (
                                        <tr key={candidate._id}>
                                            <td>{candidate.firstName}</td>
                                            <td>{candidate.lastName}</td>
                                            <td>{candidate.email}</td>
                                            <td>{candidate.mobile}</td>
                                            <td className={`status ${candidate.status?.replace(" ", "-").toLowerCase()}`}>
                                                {candidate.status}
                                            </td>
                                            <td>{candidate.department}</td>
                                            <td>{candidate.sourceOfHire}</td>
                                            <td>{candidate.panCard}</td>
                                            <td>{candidate.aadhaarCard}</td>
                                            <td>{candidate.uanNumber}</td>
                                            <td className="action-cell" ref={dropdownRef}>
                                                <button
                                                    className="action-dot"
                                                    onClick={(e) => toggleMenu(index, e)}
                                                >
                                                    <BsThreeDots />
                                                </button>
                                                {openMenuIndex === index && (
                                                    <div className="dropdown-menu-dot">
                                                        <div onClick={() => handleEdit(candidate)}>Edit</div>
                                                        <div onClick={() => handleDelete(candidate._id)}>Delete</div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="11">No candidates found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="footer">
                        <span>Total Record: <span className="blue-link">{filteredCandidates.length}</span></span>
                        <div className="pagination">
                            <select>
                                <option>10</option>
                                <option>20</option>
                                <option>30</option>
                                <option>50</option>
                            </select>
                            <span>{'<'}</span>
                            <span>1</span>
                            <span>{'>'}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Onboarding;