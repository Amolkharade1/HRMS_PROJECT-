import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeavePageLayout from "./LeavePageLayout";
import "./LeaveSummary.css";
import axios from "axios";
import LeaveTrackerNavbar from "../pages/LeaveTrackerNavbar";
import { FaEllipsisH } from "react-icons/fa";

const initialLeaveData = [
  { type: "Casual Leave", available: 12, booked: 0, icon: "⚙️" },
  { type: "Earned Leave", available: 12, booked: 0, icon: "✅" },
  { type: "Leave Without Pay", available: 0, booked: 0, icon: "⏰" },
  { type: "Paternity Leave", available: 0, booked: 0, icon: "👶" },
  { type: "Sabbatical Leave", available: 0, booked: 0, icon: "📚" },
  { type: "Sick Leave", available: 12, booked: 0, icon: "🩺" },
];

const LeaveSummary = () => {
  const navigate = useNavigate();
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [bookedCount, setBookedCount] = useState(0);
  const [absentMonths, setAbsentMonths] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownIndex(null);
      setEditIndex(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleApplyLeave = () => navigate("/applyleave");

  const handleEdit = (index, e) => {
    e.stopPropagation();
    setEditIndex(editIndex === index ? null : index);
  };

  const updateStatus = async (leaveId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/leaves/${leaveId}`, { status: newStatus });
      const updated = upcomingLeaves.map((leave) =>
        leave._id === leaveId ? { ...leave, status: newStatus } : leave
      );
      setUpcomingLeaves(updated);
      setEditIndex(null);
    } catch {
      alert("Failed to update leave status.");
    }
  };

  const handleDelete = async (leaveId) => {
    try {
      await axios.delete(`http://localhost:8000/api/leaves/${leaveId}`);
      setUpcomingLeaves(upcomingLeaves.filter((leave) => leave._id !== leaveId));
    } catch {
      alert("Error deleting leave.");
    }
  };

  const computeLeaveData = () => {
    const updatedLeaveData = initialLeaveData.map((leaveType) => {
      const bookedLeaves = upcomingLeaves.filter(
        (leave) =>
          leave.leaveType === leaveType.type &&
          (leave.status === "Pending" || leave.status === "Approved")
      );

      return {
        ...leaveType,
        booked: bookedLeaves.length,
        available: Math.max(leaveType.available - bookedLeaves.length, 0),
      };
    });

    return updatedLeaveData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesRes, bookedRes, monthlyRes] = await Promise.all([
          axios.get("http://localhost:8000/api/leaves"),
          axios.get("http://localhost:8000/api/leaves/booked/count"),
          axios.get("http://localhost:8000/api/leaves/monthly/count"),
        ]);
        setUpcomingLeaves(leavesRes.data);
        setBookedCount(bookedRes.data.count);
        setAbsentMonths(monthlyRes.data.count);
        setLoading(false);
      } catch {
        setError("Failed to fetch leave data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatedLeaveData = computeLeaveData();

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
      <LeaveTrackerNavbar />
      <LeavePageLayout>

        <div className="leave-toolbar">
          <div className="leave-toolbar-left">
            <span>Leave booked this year: {bookedCount}</span>
            <span>Absent Months: {absentMonths}</span>
          </div>
          <div className="leave-toolbar-center">
            <span>01-Jan-2025 - 31-Dec-2025</span>
          </div>
          <div className="leave-toolbar-right">
            <button className="leave-apply-btn" onClick={handleApplyLeave}>
              + Apply Leave
            </button>
          </div>
        </div>

        <div className="leave-cards">
          {updatedLeaveData.map((item, index) => (
            <div key={index} className="leave-card">
              <div className="leave-card-icon">{item.icon}</div>
              <div className="leave-card-title">{item.type}</div>
              <div className="leave-card-info">
                <div>
                  <span className="leave-label">Available </span>
                  <span className="leave-value">{item.available}</span>
                </div>
                <div>
                  <span className="leave-label">Booked </span>
                  <span className="leave-value">{item.booked}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="leave-summary-container">
          <div className="leave-upcoming">
            <h3>Upcoming Leaves</h3>

            {loading ? (
              <div className="loading-message">Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : upcomingLeaves.length > 0 ? (
              <>

                <div className="leave-table-container">
                  <table className="leave-table">
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
                      {upcomingLeaves.map((leave, index) => (
                        <tr key={leave._id || index}>
                          <td>{leave.name}</td>
                          <td>{leave.leaveType}</td>
                          <td>{leave.duration}</td>
                          <td>{leave.startDate.slice(0, 10)}</td>
                          <td>{leave.endDate.slice(0, 10)}</td>
                          <td>{leave.teamEmail}</td>
                          <td>{leave.reason}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={getStatusColor(leave.status)}
                            >
                              {leave.status}
                            </span>
                          </td>
                          <td className="action-cell">
                            <div
                              className="action-menu-wrapper"
                              onClick={(e) => handleActionClick(index, e)}
                            >
                              <FaEllipsisH className="action-icon" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
                </div>


                {/* Action dropdown positioned relative to the clicked button */}
                {dropdownIndex !== null && (
                  <div
                    className="floating-action-dropdown"
                    style={{
                      position: 'absolute',
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`
                    }}
                  >
                    <div
                      className="action-option"
                      onClick={(e) => handleEdit(dropdownIndex, e)}
                    >
                      Edit
                    </div>

                    {editIndex === dropdownIndex && (
                      <div className="floating-edit-status-options">
                        <div
                          className="status-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(upcomingLeaves[dropdownIndex]._id, "Pending");
                          }}
                        >
                          Mark as Pending
                        </div>
                        <div
                          className="status-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(upcomingLeaves[dropdownIndex]._id, "Approved");
                          }}
                        >
                          Approve
                        </div>
                        <div
                          className="status-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(upcomingLeaves[dropdownIndex]._id, "Rejected");
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
                        handleDelete(upcomingLeaves[dropdownIndex]._id);
                      }}
                    >
                      Delete
                    </div>
                    
                  </div>
                  
                )}

                {/* <div className="total-records">
                  Total Record Count: {upcomingLeaves.length}
                </div> */}
              </>
            ) : (
              <div className="no-leaves-message">No upcoming leaves</div>
            )}
          </div>
        </div>
      </LeavePageLayout>

    </div>

  );
};

export default LeaveSummary;