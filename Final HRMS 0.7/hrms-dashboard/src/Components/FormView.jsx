import React, { useState, useEffect } from "react";
import "./FormView.css";
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH } from 'react-icons/fa';
import TaskNavbar from "../pages/TaskNavbar";

const FormView = () => {
    const navigate = useNavigate();
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [editModeIndex, setEditModeIndex] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/tasks');
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
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

    const handleTasksBtn = () => {
        navigate("/AddTaskForm");
    };

    const handleEdit = (index) => {
        setEditModeIndex(index);
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            const updatedTask = await response.json();
            setTasks(tasks.map(task => task._id === id ? updatedTask : task));
            setEditModeIndex(null);
            setDropdownIndex(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            setTasks(tasks.filter(task => task._id !== id));
            setDropdownIndex(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredTasks = tasks.filter(task =>
        task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div>
                <TaskNavbar />
                <div className="form-view-wrapper">Loading tasks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <TaskNavbar />
                <div className="form-view-wrapper">Error: {error}</div>
            </div>
        );
    }

    return (
        <div>
            <TaskNavbar />
            <div className="form-view-wrapper">
                <div className="form-view-container">
                    <div className="form-controls">
                        <div className="search-box-container">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="task-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="action-buttons">
                            <button className="form-add-task-btn" onClick={handleTasksBtn}>Add Task</button>
                        </div>
                    </div>

                    <div className="form-table-container">
                        <table className="form-task-table">
                            <thead>
                                <tr>
                                    <th className="form-th-checkbox"><input type="checkbox" /></th>
                                    <th className="form-th">Task name</th>
                                    <th className="form-th">Due Date</th>
                                    <th className="form-th">Priority</th>
                                    <th className="form-th">Status</th>
                                    <th className="form-th">Task Owner</th>
                                    <th className="form-th">Action</th>
                                </tr>
                            </thead>
                            <tbody className="form-table-body">
                                {filteredTasks.map((task, index) => (
                                    <tr className="form-tr" key={task._id}>
                                        <td className="form-td-checkbox"><input type="checkbox" /></td>
                                        <td className="form-td">{task.taskName}</td>
                                        <td className="form-td">{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td className={`form-td form-priority-${(task.priority || '').toLowerCase()}`}>
                                            {task.priority || 'Moderate'}
                                        </td>
                                        <td className={`form-td form-status-${(task.status || '').toLowerCase()}`}>
                                            {task.status}
                                        </td>
                                        <td className="form-td">{task.owner || 'Unknown'}</td>
                                        <td className="form-td form-action-column">
                                            <div
                                                className="form-action-icon-wrapper"
                                                onClick={() => {
                                                    if (dropdownIndex === index) {
                                                        setDropdownIndex(null);
                                                        setEditModeIndex(null);
                                                    } else {
                                                        setDropdownIndex(index);
                                                        setEditModeIndex(null);
                                                    }
                                                }}
                                            >
                                                <FaEllipsisH className="form-action-icon" />
                                                {dropdownIndex === index && (
                                                    <div className="form-dropdown-menu">
                                                        {editModeIndex === index ? (
                                                            <>
                                                                <div className="form-dropdown-status" onClick={() => updateStatus(task._id, 'Open')}>Mark as Open</div>
                                                                <div className="form-dropdown-status" onClick={() => updateStatus(task._id, 'Completed')}>Mark as Completed</div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="form-dropdown-option" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>Edit</div>
                                                                <div className="form-dropdown-option" onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}>Delete</div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="form-task-footer">
                        <span className="form-total-records">
                            Total Record Count: <span className="form-record-count">{filteredTasks.length}</span>
                        </span>
                        <div className="form-pagination">
                            <select className="form-page-size">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                            <span className="form-page-info">1 - {filteredTasks.length}</span>
                            <button className="form-pagination-btn">{'<'}</button>
                            <button className="form-pagination-btn">{'>'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormView;