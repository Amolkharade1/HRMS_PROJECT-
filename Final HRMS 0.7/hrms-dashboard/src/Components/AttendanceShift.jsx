import React, { useState, useEffect, useRef } from "react";
import "./ShiftSchedule.css";
import LeavePageLayout from "./LeavePageLayout";
import AttendanceNavbar from "../pages/AttendanceNavbar";

const ShiftSchedule = () => {
    const [showModal, setShowModal] = useState(false);
    const [isMonthlyView, setIsMonthlyView] = useState(false);
    const [month, setMonth] = useState(new Date(2025, 4, 1)); // May 2025
    const [weekStartDate, setWeekStartDate] = useState(new Date(2025, 4, 11)); // 11 May 2025 Monday start for weekly view

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const times = [
        "08 AM", "09 AM", "10 AM", "11 AM", "12 PM",
        "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM"
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleViewToggle = (view) => {
        setIsMonthlyView(view === "monthly");
    };

    // Navigate months in monthly view
    const handleMonthChange = (direction) => {
        const newMonth = new Date(month);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setMonth(newMonth);
    };

    // Navigate week in weekly view
    const handleWeekChange = (direction) => {
        const newWeekStart = new Date(weekStartDate);
        newWeekStart.setDate(newWeekStart.getDate() + (7 * direction));
        setWeekStartDate(newWeekStart);
    };

    // Get array of dates for weekly view starting from weekStartDate Sunday
    const getWeekDates = () => {
        const start = new Date(weekStartDate);
        // Adjust start to Sunday of that week:
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        let weekDates = [];
        for (let i = 0; i < 7; i++) {
            let current = new Date(start);
            current.setDate(start.getDate() + i);
            weekDates.push(current);
        }
        return weekDates;
    };

    // Format date as dd-MMM-yyyy
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format range string for toolbar display
    const getRangeText = () => {
        if (isMonthlyView) {
            const start = new Date(month.getFullYear(), month.getMonth(), 1);
            const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
            return `${formatDate(start)} - ${formatDate(end)}`;
        } else {
            const weekDates = getWeekDates();
            return `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;
        }
    };

    return (
        <div>
            <AttendanceNavbar />

            <div className="schedule-container">
                {/* Toolbar */}
                <div className="shift-toolbar">
                    <div className="toolbar-section-left-controls">
                        {!isMonthlyView && <button className="arrow-btn" onClick={() => handleWeekChange(-1)}>‹</button>}
                        {isMonthlyView && <button className="arrow-btn" onClick={() => handleMonthChange(-1)}>‹</button>}
                        <button className="calendar-btn">📅</button>
                        {!isMonthlyView && <button className="arrow-btn" onClick={() => handleWeekChange(1)}>›</button>}
                        {isMonthlyView && <button className="arrow-btn" onClick={() => handleMonthChange(1)}>›</button>}
                    </div>

                    <div className="toolbar-section center-range">
                        <button className="date-picker-btn">
                            <i className="fa fa-calendar"></i>
                            <span className="date-text">{getRangeText()}</span>
                        </button>
                    </div>

                    <div className="toolbar-section right-controls">
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${!isMonthlyView ? 'active' : ''}`}
                                onClick={() => handleViewToggle("weekly")}
                            >
                                Weekly
                            </button>
                            <button
                                className={`view-btn ${isMonthlyView ? 'active' : ''}`}
                                onClick={() => handleViewToggle("monthly")}
                            >
                                Monthly
                            </button>
                        </div>
                        <button className="assign-btn" onClick={openModal}>Assign shift</button>
                        <MoreMenu />
                    </div>
                </div>

                {/* View Switch */}
                {isMonthlyView ? <MonthlyShiftView month={month} /> : <WeeklyShiftView weekStartDate={weekStartDate} />}

                {/* Assign Shift Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="assign-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Assign shift</h3>
                                <button className="close-btn" onClick={closeModal}>×</button>
                            </div>
                            <div className="modal-body">
                                <label>Shift name</label>
                                <select>
                                    <option>Select</option>
                                    <option>9:00 AM - 6:00 PM</option>
                                </select>

                                <label>Dates</label>
                                <div className="date-inputs">
                                    <input type="date" placeholder="dd-MMM-yyyy" />
                                    <input type="date" placeholder="dd-MMM-yyyy" />
                                </div>

                                <label>Reason</label>
                                <input type="text" placeholder="Reason" />
                            </div>
                            <div className="modal-footer">
                                <button className="submit-btn">Submit</button>
                                <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

const WeeklyShiftView = ({ weekStartDate }) => {
    const weekDates = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Calculate all days in week from weekStartDate (or Sunday of that week)
    const start = new Date(weekStartDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day); // go back to Sunday

    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        weekDates.push(date);
    }

    const times = ["08 AM", "09 AM", "10 AM", "11 AM", "12 PM",
        "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM"];

    return (
        <>
            {/* Time Row */}
            <div className="time-labels">
                {times.map(t => (
                    <div className="time-slot" key={t}>{t}</div>
                ))}
            </div>

            {/* Day Rows */}
            {weekDates.map((date, i) => (
                <div className="day-entry" key={i}>
                    <div className="day-label">
                        <div>{dayNames[date.getDay()]}</div>
                        <div className="day-number">{date.getDate()}</div>
                    </div>
                    <div className="shift-box">
                        <div className="shift-title">General</div>
                        <div>9:00 AM - 6:00 PM</div>
                    </div>
                </div>
            ))}
        </>
    );
};

const MonthlyShiftView = ({ month }) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startDayIndex = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const grid = [];

    for (let i = 0; i < startDayIndex; i++) {
        grid.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        grid.push(d);
    }

    return (
        <div className="monthly-view">
            <div className="calendar-header">
                {days.map((day) => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {grid.map((date, idx) => {
                    const dayOfWeek = idx % 7;
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                    return (
                        <div
                            key={idx}
                            className={
                                `calendar-cell ${date ? "" : "empty"} ` +
                                `${isWeekend ? "weekend" : ""}`
                            }
                        >
                            {date && (
                                <>
                                    <div className="date-number">{date}</div>
                                    <div className="shift-box-m">
                                        <div className="shift-title">General</div>
                                        <div className="shift-time">9:00 AM - 6:00 PM</div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MoreMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="more-menu-container" ref={menuRef}>
            <button className="more-btn" onClick={() => setIsOpen(!isOpen)}>
                ⋯
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-item">⬇ Import</div>
                    <div className="dropdown-item">⬆ Export</div>
                    <div className="dropdown-item">📄 Download as PDF</div>
                    <div className="dropdown-item">🖨 Print</div>
                </div>
            )}
        </div>
    );
};

export default ShiftSchedule;

