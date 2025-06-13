import React, { useState, useEffect } from "react";
import "./TrackTasks.css";
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH } from 'react-icons/fa';
import TaskNavbar from "../pages/TaskNavbar";

const TrackTasks = () => {
    const navigate = useNavigate();
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [expandedStatusIndex, setExpandedStatusIndex] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/tasks');
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const data = await response.json();
                setTasks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleTasksBtn = () => navigate("/AddTaskForm");

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete task');
            setTasks(tasks.filter(task => task._id !== id));
            setDropdownIndex(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (index) => {
        setExpandedStatusIndex(expandedStatusIndex === index ? null : index);
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update task status');
            const updatedTask = await response.json();
            setTasks(tasks.map(task => task._id === id ? updatedTask : task));
            setDropdownIndex(null);
            setExpandedStatusIndex(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div>
                <TaskNavbar />
                <div className="track-tasks-wrapper">
                    <div className="tt-loading">Loading tasks...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <TaskNavbar />
                <div className="track-tasks-wrapper">
                    <div className="tt-error">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <TaskNavbar />
            <div className="track-tasks-wrapper">
                <div className="tt-container">
                    <div className="tt-controls-row">
                        <div className="tt-filters-wrapper">
                            <div className="tt-filter-btn">Total <strong>{tasks.length}</strong></div>
                            <div className="tt-open-btn">
                                Open <span className="tt-open-count">{tasks.filter(t => t.status === 'Open').length}</span>
                            </div>
                            <div className="tt-filter-btn">
                                Completed <span className="tt-completed-count">{tasks.filter(t => t.status === 'Completed').length}</span>
                            </div>
                        </div>

                        <div className="tt-actions-right">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="tt-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="tt-add-task-button" onClick={handleTasksBtn}>Add Task</button>
                        </div>
                    </div>

                    <div className="tt-task-list-container">
                        <div className="tt-task-list">
                            <div className="tt-task-header">
                                <div className="tt-col tt-details">Task Details</div>
                                <div className="tt-col tt-status-header">Status</div>
                                <div className="tt-col tt-assigned">Assigned To</div>
                                <div className="tt-col tt-action-col">Actions</div>
                            </div>

                            <div className="tt-task-list-scrollable">
                                {filteredTasks.length === 0 ? (
                                    <div className="tt-no-tasks">No tasks found</div>
                                ) : (
                                    filteredTasks.map((task, index) => (
                                        <div className="tt-task-row" key={task._id}>
                                            <div className="tt-col tt-details">
                                                <input type="checkbox" className="tt-checkbox" />
                                                <span className="tt-avatar-icon">👤</span>
                                                <div className="tt-task-text">
                                                    <div className="tt-task-title">{task.taskName || 'Untitled Task'}</div>
                                                    <div className="tt-task-desc tt-truncate">
                                                        {task.description || 'No description'}
                                                    </div>
                                                    <div className="tt-task-meta">
                                                        {task.dueDate && (
                                                            <span className="tt-due-date">
                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tt-col tt-status">
                                                <span className={`tt-status-badge ${
                                                    task.status === 'Open' ? 'tt-status-open' : 'tt-status-completed'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div className="tt-col tt-assigned">
                                                {task.assignedTo ? (
                                                    <>
                                                        <span className="tt-avatar-icon">👤</span>
                                                        <span className="tt-assigned-name">{task.assignedTo}</span>
                                                    </>
                                                ) : (
                                                    <span className="tt-unassigned">Unassigned</span>
                                                )}
                                            </div>
                                            <div className="tt-col tt-action-col">
                                                <div className="tt-action-container">
                                                    <div
                                                        className="tt-action-icon-wrapper"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDropdownIndex(dropdownIndex === index ? null : index);
                                                            setExpandedStatusIndex(null);
                                                        }}
                                                    >
                                                        <FaEllipsisH className="tt-action-icon" />
                                                    </div>

                                                    {dropdownIndex === index && (
                                                        <div
                                                            className="tt-dropdown-menu"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div
                                                                className="tt-dropdown-option"
                                                                onClick={() => handleEdit(index)}
                                                            >
                                                                Edit
                                                            </div>
                                                            <div
                                                                className="tt-dropdown-option"
                                                                onClick={() => handleDelete(task._id)}
                                                            >
                                                                Delete
                                                            </div>

                                                            {expandedStatusIndex === index && (
                                                                <>
                                                                    <div
                                                                        className="tt-dropdown-status"
                                                                        onClick={() => updateStatus(task._id, 'Open')}
                                                                    >
                                                                        Mark as Open
                                                                    </div>
                                                                    <div
                                                                        className="tt-dropdown-status"
                                                                        onClick={() => updateStatus(task._id, 'Completed')}
                                                                    >
                                                                        Mark as Completed
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackTasks;