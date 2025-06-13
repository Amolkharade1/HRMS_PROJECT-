import React, { useState, useEffect } from "react";
import "./MyTasks.css";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH } from 'react-icons/fa';
import TaskNavbar from "../pages/TaskNavbar";

const MyTasks = () => {
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
    } catch (err) {
      setError(err.message);
    }
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
        throw new Error('Failed to update task status');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task =>
        task._id === id ? updatedTask : task
      ));
      setEditModeIndex(null);
      setDropdownIndex(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to format assigned members with line breaks
  const formatAssignedMembers = (members) => {
    if (!members) return null;
    
    const memberList = members.split(',').map(m => m.trim());
    const chunks = [];
    const chunkSize = 10;
    
    for (let i = 0; i < memberList.length; i += chunkSize) {
      chunks.push(memberList.slice(i, i + chunkSize).join(', '));
    }
    
    return chunks.map((chunk, index) => (
      <div key={index} className="my-tasks-assigned-chunk">
        {chunk}
      </div>
    ));
  };

  const filteredTasks = tasks.filter(task =>
    task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <TaskNavbar />
        <div className="my-tasks-page-wrapper-v2">
          <div className="my-tasks-loading">Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TaskNavbar />
        <div className="my-tasks-page-wrapper-v2">
          <div className="my-tasks-error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskNavbar />
      <div className="my-tasks-page-wrapper-v2">
        <div className="my-tasks-container-v2">
          <div className="my-tasks-controls-wrapper-v2">
            <div className="my-tasks-filters-wrapper-v2">
              <div className="my-tasks-filter-button-v2">Total <strong>{tasks.length}</strong></div>
              <div className="my-tasks-open-button-v2">
                Open <span className="my-tasks-open-count-v2">{tasks.filter(t => t.status === 'Open').length}</span>
              </div>

              <div className="my-tasks-filter-button-v2">
                Completed <span className="my-tasks-completed-count-v2">{tasks.filter(t => t.status === 'Completed').length}</span>
              </div>
            </div>

            <div className="my-tasks-actions-right-v2">
              <input
                type="text"
                placeholder="Search tasks..."
                className="my-tasks-search-input-v2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="my-tasks-add-task-button-v2" onClick={handleTasksBtn}>Add Task</button>
            </div>
          </div>

          <div className="my-tasks-list-container-v2">
            <div className="my-tasks-list-wrapper-v2">
              <div className="my-tasks-header-row-v2">
                <div className="my-tasks-column-v2 my-tasks-details-v2">Task Details</div>
                <div className="my-tasks-column-v2 my-tasks-status-v2">Status</div>
                <div className="my-tasks-column-v2 my-tasks-action-v2">Action</div>
              </div>

              <div className="my-tasks-scrollable-content">
                {filteredTasks.length === 0 ? (
                  <div className="my-tasks-no-tasks">No tasks found</div>
                ) : (
                  filteredTasks.map((task, index) => (
                    <div className="my-tasks-task-item-v2" key={task._id}>
                      <div className="my-tasks-column-v2 my-tasks-details-v2">
                        <input type="checkbox" className="my-tasks-checkbox-v2" />
                        <span className="my-tasks-emoji-v2">👤</span>
                        <div className="my-tasks-text-wrapper-v2">
                          <div className="my-tasks-title-v2" style={{ color: '#1A73E8' }}>{task.taskName}</div>
                          <div className="my-tasks-desc-v2 my-tasks-single-line-v2">
                            {task.description || 'No description'}
                          </div>
                          <div className="my-tasks-meta-v2">
                            {task.assignedTo && (
                              <div className="my-tasks-assigned-members">
                                {formatAssignedMembers(task.assignedTo)}
                              </div>
                            )}
                            {task.dueDate && (
                              <div className="my-tasks-due-date" style={{ color: '#E74C3C' }}>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="my-tasks-column-v2 my-tasks-status-v2">
                        <span className={`my-tasks-status-badge-v2 ${task.status === 'Open' ? 'my-tasks-open-v2' : 'my-tasks-completed-v2'
                          }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="my-tasks-column-v2 my-tasks-action-v2">
                        <div
                          className="my-tasks-action-icon-wrapper"
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
                          <FaEllipsisH className="my-tasks-action-icon" />
                          {dropdownIndex === index && (
                            <div className="my-tasks-dropdown-menu">
                              {editModeIndex === index ? (
                                <>
                                  <div
                                    className="my-tasks-dropdown-status"
                                    onClick={() => updateStatus(task._id, 'Open')}
                                  >
                                    Mark as Open
                                  </div>
                                  <div
                                    className="my-tasks-dropdown-status"
                                    onClick={() => updateStatus(task._id, 'Completed')}
                                  >
                                    Mark as Completed
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="my-tasks-dropdown-option"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(index);
                                    }}
                                  >
                                    Edit
                                  </div>
                                  <div
                                    className="my-tasks-dropdown-option"
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
    </div>
  );
};

export default MyTasks;