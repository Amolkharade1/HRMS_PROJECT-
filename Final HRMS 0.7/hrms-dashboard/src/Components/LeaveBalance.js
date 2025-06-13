import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeavePageLayout from "./LeavePageLayout";
import LeaveTrackerNavbar from "../pages/LeaveTrackerNavbar";
import "./LeaveBalance.css";
import axios from "axios";

const initialLeaveData = [
  { type: "Casual Leave", available: 12, booked: 0, icon: "🌊", color: "#e0e7ff" },
  { type: "Earned Leave", available: 12, booked: 0, icon: "⏱️", color: "#d1fae5" },
  { type: "Leave Without Pay", available: 0, booked: 0, icon: "🌅", color: "#ffe4e6" },
  { type: "Paternity Leave", available: 0, booked: 0, icon: "🍼", color: "#fef9c3" },
  { type: "Sabbatical Leave", available: 0, booked: 0, icon: "🔄", color: "#fef3c7" },
  { type: "Sick Leave", available: 12, booked: 0, icon: "🩺", color: "#ede9fe" },
];

const LeaveBalance = () => {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState(initialLeaveData);

  const handleApplyLeave = () => {
    navigate("/applyleave");
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/leaves");

        const updated = initialLeaveData.map((type) => {
          const bookedLeaves = res.data.filter(
            (leave) =>
              leave.leaveType === type.type &&
              (leave.status === "Approved" || leave.status === "Pending")
          );

          const booked = bookedLeaves.length;
          const available = Math.max(type.available - booked, 0);

          return {
            ...type,
            booked,
            available,
          };
        });

        setLeaveData(updated);
      } catch (err) {
        console.error("Error fetching leave data", err);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div>
    <LeaveTrackerNavbar/>
    <LeavePageLayout>
      <div className="leavebalance-container">
        {leaveData.map((leave, index) => (
          <div key={index} className="leavebalance-card">
            <div className="leavebalance-left">
              <div
                className="leavebalance-icon"
                style={{ backgroundColor: leave.color }}
              >
                {leave.icon}
              </div>
              <div className="leavebalance-title">{leave.type}</div>
            </div>
            <div className="leavebalance-right">
              <div className="leavebalance-stats">
                <div className="leavebalance-stat">
                  <div className="leavebalance-label">Available</div>
                  <div className="leavebalance-value">
                    {leave.available} {leave.available === 1 ? "day" : "days"}
                  </div>
                </div>
                <div className="leavebalance-stat">
                  <div className="leavebalance-label">Booked</div>
                  <div className="leavebalance-value">
                    {leave.booked} {leave.booked === 1 ? "day" : "days"}
                  </div>
                </div>
              </div>
              <button className="leavebalance-applybtn" onClick={handleApplyLeave}>
                Apply Leave
              </button>
            </div>
          </div>
        ))}
      </div>
    </LeavePageLayout>
    </div>
  );
};

export default LeaveBalance;
