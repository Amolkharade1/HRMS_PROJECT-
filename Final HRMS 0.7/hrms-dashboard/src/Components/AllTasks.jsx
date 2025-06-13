import React, { useState, useEffect } from "react";
import "./AllTasks.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH } from 'react-icons/fa';
import TaskNavbar from "../pages/TaskNavbar";

const AllTasks = () => {
  const navigate = useNavigate();
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task._id !== id));
      setDropdownIndex(null);
      setEditModeIndex(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (index) => {
    setEditModeIndex(index);
    setDropdownIndex(index);
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
        throw new Error('Failed to update task status');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task =>
        task._id === id ? updatedTask : task
      ));

      setDropdownIndex(null);
      setEditModeIndex(null);
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
        <div className="all-tasks-page-wrapper-v2">
          <div className="loading-message">Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TaskNavbar />
        <div className="all-tasks-page-wrapper-v2">
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskNavbar />
      <div className="all-tasks-page-wrapper-v2">
        <div className="tasks-container-v2">
          <div className="controls-wrapper-v2">
            <div className="filters-wrapper-v2">
              <div className="filter-button-v2">Total <strong>{tasks.length}</strong></div>
              <div className="open-button-v2">
                Open <span className="open-count-v2">{tasks.filter(t => t.status === 'Open').length}</span>
              </div>
              <div className="filter-button-v2">
                Completed <span className="completed-count-v2">{tasks.filter(t => t.status === 'Completed').length}</span>
              </div>
            </div>

            <div className="actions-right-v2">
              <input
                type="text"
                placeholder="Search tasks..."
                className="search-input-v2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="add-task-button-v2" onClick={handleTasksBtn}>Add Task</button>
            </div>
          </div>

          <div className="list-wrapper-v2">
            <div className="header-row-v2">
              <div className="column-v2 details-v2">Task Details</div>
              <div className="column-v2 status-v2">Status</div>
              <div className="column-v2 assigned-v2">Assigned To</div>
              <div className="column-v2 action-v2">Actions</div>
            </div>

            <div className="task-list-container">
              {filteredTasks.length === 0 ? (
                <div className="no-tasks-message">No tasks found</div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div className="task-item-v2" key={task._id}>
                    <div className="column-v2 details-v2">
                      <input type="checkbox" className="checkbox-v2" />
                      <span className="emoji-v2">👤</span>
                      <div className="text-wrapper-v2">
                        <div className="title-v2" style={{ color: '#1A73E8' }}>{task.taskName || 'Untitled Task'}</div>
                        <div className="desc-v2 single-line-v2">
                          {task.description || 'No description provided'}
                        </div>
                        <div className="task-meta-v2" style={{ color: task.dueDate ? '#E74C3C' : '#888' }}>
                          {task.dueDate && `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <div className="column-v2 status-v2">
                      <span className={`status-badge-v2 ${
                        task.status === 'Open' ? 'open-v2' : 'completed-v2'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="column-v2 assigned-v2">
                      {task.assignedTo ? (
                        <>
                          <span className="emoji-v2">👤</span>
                          <span className="assigned-name">{task.assignedTo}</span>
                        </>
                      ) : (
                        <span className="unassigned-label">Unassigned</span>
                      )}
                    </div>
                    <div className="column-v2 action-v2">
                      <div className="action-container">
                        <div
                          className="task-action-icon-wrapper"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dropdownIndex === index) {
                              setDropdownIndex(null);
                              setEditModeIndex(null);
                            } else {
                              setDropdownIndex(index);
                              setEditModeIndex(null);
                            }
                          }}
                        >
                          <FaEllipsisH className="task-action-icon" />
                        </div>

                        {dropdownIndex === index && (
                          <div
                            className="task-dropdown-menu"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {editModeIndex === index ? (
                              <>
                                <div
                                  className="task-dropdown-status"
                                  onClick={() => updateStatus(task._id, 'Open')}
                                >
                                  Mark as Open
                                </div>
                                <div
                                  className="task-dropdown-status"
                                  onClick={() => updateStatus(task._id, 'Completed')}
                                >
                                  Mark as Completed
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="task-dropdown-option"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(index);
                                  }}
                                >
                                  Edit
                                </div>
                                <div
                                  className="task-dropdown-option"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(task._id);
                                  }}
                                >
                                  Delete
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
  );
};

export default AllTasks;