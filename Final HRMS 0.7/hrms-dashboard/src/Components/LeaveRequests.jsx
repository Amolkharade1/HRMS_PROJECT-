import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH } from 'react-icons/fa';
import './LeaveRequests.css';
import LeavePageLayout from './LeavePageLayout';
import LeaveTrackerNavbar from "../pages/LeaveTrackerNavbar";
import axios from 'axios';

const LeaveRequests = () => {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const handleAddRequestClick = () => {
    navigate('/applyleave');
  };

  const handleEdit = (index, e) => {
    e.stopPropagation();
    setEditModeIndex(editModeIndex === index ? null : index);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/leaves/${id}`, { status });
      const updated = leaveData.map((leave) =>
        leave._id === id ? { ...leave, status } : leave
      );
      setLeaveData(updated);
      setEditModeIndex(null);
      setDropdownIndex(null);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/leaves/${id}`);
      setLeaveData(leaveData.filter((leave) => leave._id !== id));
      setDropdownIndex(null);
    } catch (err) {
      alert('Failed to delete leave');
    }
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/leaves');
        setLeaveData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leave data.');
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIndex(null);
        setEditModeIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredLeaves = leaveData.filter((leave) =>
    leave.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.teamEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { color: "#f59e0b", backgroundColor: "white" };
      case "Approved":
        return { color: "#10b981", backgroundColor: "white" };
      case "Rejected":
        return { color: "#ef4444", backgroundColor: "white" };
      default:
        return { color: "#6b7280", backgroundColor: "white" };
    }
  };

  const handleActionClick = (index, e) => {
    e.stopPropagation();
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: buttonRect.top + window.scrollY - 10,
      left: buttonRect.left + window.scrollX - 130
    });
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  return (
     <div>
      <LeaveTrackerNavbar/>
    <LeavePageLayout>
      <div className="leave-main-container">
        <div className="leave-header-controls">
          <input
            className="leave-input-search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="leave-btn-add" onClick={handleAddRequestClick}>
            + Add Request
          </button>
        </div>

        <div className="leave-table-area">
          <h3 className="leave-section-title">Leave Requests</h3>

          {loading ? (
            <div className="leave-status-message">Loading...</div>
          ) : error ? (
            <div className="leave-status-message">{error}</div>
          ) : filteredLeaves.length === 0 ? (
            <div className="leave-status-message">No matching leave requests</div>
          ) : (
            <>
              <div className="leave-table-container">
                <table className="leave-data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Leave Type</th>
                      <th>Duration</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Email</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map((leave, index) => (
                      <tr key={leave._id || index}>
                        <td>{leave.name}</td>
                        <td>{leave.leaveType}</td>
                        <td>{leave.duration}</td>
                        <td>{leave.startDate?.slice(0, 10)}</td>
                        <td>{leave.endDate?.slice(0, 10)}</td>
                        <td>{leave.email || leave.teamEmail}</td>
                        <td>{leave.reason}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={getStatusColor(leave.status)}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="leave-action-column">
                          <div
                            className="leave-action-icon-wrapper"
                            onClick={(e) => handleActionClick(index, e)}
                          >
                            <FaEllipsisH className="leave-action-icon" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="leave-record-count">
                Total Record Count: {filteredLeaves.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating dropdown menu */}
      {dropdownIndex !== null && (
        <div 
          ref={dropdownRef}
          className="floating-action-dropdown"
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 1000
          }}
        >
          <div
            className="action-option"
            onClick={(e) => handleEdit(dropdownIndex, e)}
          >
            Edit
          </div>

          {editModeIndex === dropdownIndex && (
            <div className="floating-edit-status-options">
              <div
                className="status-option"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(filteredLeaves[dropdownIndex]._id, "Pending");
                }}
              >
                Mark as Pending
              </div>
              <div
                className="status-option"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(filteredLeaves[dropdownIndex]._id, "Approved");
                }}
              >
                Approve
              </div>
              <div
                className="status-option"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(filteredLeaves[dropdownIndex]._id, "Rejected");
                }}
              >
                Reject
              </div>
            </div>
          )}

          <div
            className="action-option delete-option"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(filteredLeaves[dropdownIndex]._id);
            }}
          >
            Delete
          </div>
        </div>
      )}
    </LeavePageLayout>
    </div>
  );
};

export default LeaveRequests;