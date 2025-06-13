import React, { useState } from "react";
import AttendanceNavbar from "../pages/AttendanceNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import nodatafound from '../assets/no-data-found.png';
import "./Attendance.css";

const DayDetailsModal = ({ isOpen, onClose, day }) => {
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  if (!isOpen) return null;

  const formattedFullDate = day?.fullDate
    ? new Date(day.fullDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    : "";

  return (
    <div className="attendance-modal-overlay">
      <div className="attendance-modal-content">
        <div className="attendance-modal-header">
          <strong>{formattedFullDate}</strong>
          <span className="attendance-modal-close" onClick={onClose}>✕</span>
        </div>
        <div className="attendance-modal-body">
          {!isAddingEntry ? (
            <>
              <button className="attendance-btn-Add-entry" onClick={() => setIsAddingEntry(true)}>Add Entry</button>
              <div className="attendance-empty-state">
                <img src={nodatafound} alt="No entries" style={{ width: 150, marginTop: 20 }} />
                <p style={{ marginTop: 10 }}>No Check-in and Check-out entry found</p>
              </div>
            </>
          ) : (
            <div className="attendance-entry-form">
              <div className="attendance-entry-row">
                <div className="attendance-entry-group">
                  <input type="time" defaultValue="01:30" />
                  <select>
                    <option>Same Day</option>
                    <option>Next Day</option>
                    <option>Previous Day</option>
                    
                  </select>
                </div>
                <div className="attendance-entry-group">
                  <input type="time" defaultValue="01:30" />
                  <select>
                    <option>Same Day</option>
                    <option>Next Day</option>
                    <option>Previous Day</option>
                  </select>
                </div>
              </div>

              <div className="attendance-entry-row">
                <textarea placeholder="Check-in notes" rows="3"></textarea>
                <textarea placeholder="Check-out notes" rows="3"></textarea>
              </div>

              <div className="attendance-entry-buttons">
                <button className="attendance-btn-Add-entry-save">Save</button>
                <button className="attendance-btn-Add-entry-cancel" onClick={() => setIsAddingEntry(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <div className="attendance-modal-footer">
          <div>First Check-In: <strong>-</strong></div>
          <div>Last Check-Out: <strong>-</strong></div>
          <div>Total Hours: <strong>00:00 Hrs</strong></div>
        </div>
      </div>
    </div>
  );
};

const Attendance = () => {
  const [startDate, setStartDate] = useState(new Date("2025-05-11"));
  const [endDate, setEndDate] = useState(new Date("2025-05-17"));
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = date =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const shiftWeek = delta => {
    const s = new Date(startDate);
    s.setDate(s.getDate() + delta * 7);
    const e = new Date(endDate);
    e.setDate(e.getDate() + delta * 7);
    setStartDate(s);
    setEndDate(e);
  };

  const getWeekDays = start => {
    const days = [];
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push({
        day: names[d.getDay()],
        date: d.getDate().toString().padStart(2, "0"),
        fullDate: d, // 🟢 Added full date for use in modal
        time: "--:--",
        hours: "00:00 Hrs worked"
      });
    }
    return days;
  };

  const days = getWeekDays(startDate);

  const openModal = day => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  return (
    <div className="attendance-page-wrapper">
      <AttendanceNavbar />

      <div className="attendance-container">
        {/* Date Range Selector */}
        <div className="attendance-date-range-container">
          <button className="attendance-nav-arrow" onClick={() => shiftWeek(-1)}>{"<"}</button>
          <div
            className="attendance-date-range clickable"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <i className="fa fa-calendar" style={{ marginRight: 8 }} />
            {formatDate(startDate)} – {formatDate(endDate)}
          </div>
          <button className="attendance-nav-arrow" onClick={() => shiftWeek(+1)}>{">"}</button>

          {showCalendar && (
            <div className="attendance-calendar-popover">
              <DatePicker
                selected={startDate}
                onChange={d => {
                  const e = new Date(d);
                  e.setDate(d.getDate() + 6);
                  setStartDate(d);
                  setEndDate(e);
                  setShowCalendar(false);
                }}
                inline
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="attendance-controls">
          <div className="shift-info">General [ 9:00 AM – 6:00 PM ]</div>
          <input
            type="text"
            placeholder="Add notes for check-out"
            className="attendance-note-input"
          />
          <div className="attendance-checkout-box">
            Clock-in <br /> 00:00:19 Hrs
          </div>
        </div>

        {/* Weekly Records */}
        <div className="attendance-week-records">
          {days.map((item, idx) => (
            <div
              key={idx}
              className="attendance-day-row clickable"
              onClick={() => openModal(item)}
            >
              <div className="attendance-day-label">
                <div className="attendance-day-circle">{item.date}</div>
                <div>{item.day}</div>
              </div>
              <div className="attendance-dot-track">
                <span className="attendance-dot" /><span className="attendance-dot" />
              </div>
              <div className="attendance-time-info">{item.time}</div>
              <div className="attendance-hours-info">{item.hours}</div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="attendance-footer-summary">
          <div>Payable Days <span className="attendance-blue">2 Days</span></div>
          <div>Present      <span className="attendance-green">0 Days</span></div>
          <div>On Duty      <span className="attendance-purple">0 Days</span></div>
          <div>Paid Leave   <span className="attendance-yellow">0 Days</span></div>
          <div>Holidays     <span className="attendance-cyan">0 Days</span></div>
          <div>Weekend      <span className="attendance-gray">2 Days</span></div>
        </div>
      </div>

      <DayDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        day={selectedDay || {}}
      />
    </div>
  );
};

export default Attendance;
