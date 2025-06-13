import React, { useState } from 'react';
import './AddTaskForm.css';
import { useNavigate } from 'react-router-dom';

const AddTaskForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    taskOwner: '',
    assignedTo: '',
    taskName: '',
    description: '',
    startDate: '',
    dueDate: '',
    reminder: '',
    priority: 'Select',
    status: 'select'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = () => {
    navigate("/MyTasks");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.taskName || formData.status === 'select') {
      setError('Task name and status are required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priority: formData.priority === 'Select' ? 'Moderate' : formData.priority
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const data = await response.json();
      console.log('Task created:', data);
      navigate("/MyTasks");
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAndNew = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.taskName || formData.status === 'select') {
      setError('Task name and status are required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priority: formData.priority === 'Select' ? 'Moderate' : formData.priority
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const data = await response.json();
      console.log('Task created:', data);
      
      // Reset form for new entry
      setFormData({
        taskOwner: '',
        assignedTo: '',
        taskName: '',
        description: '',
        startDate: '',
        dueDate: '',
        reminder: '',
        priority: 'Select',
        status: 'select'
      });
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ds-task-form-container">
      <div className="ds-task-form-header">
        <h2 className="ds-task-form-title">Add Task</h2>
      </div>
      
      <div className="ds-task-form-box">
        <h3 className="ds-task-form-section-title">Task Details</h3>


        <form className="ds-task-form" onSubmit={handleSubmit}>
          <div className="ds-form-row">
            <label className="ds-form-label">Task owner</label>
            <div className="ds-form-input-container">
              <input 
                type="text" 
                className="ds-form-input" 
                name="taskOwner"
                value={formData.taskOwner}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">Assigned to</label>
            <div className="ds-form-input-container">
              <input 
                type="text" 
                className="ds-form-input" 
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">
              Task name <span className="ds-required-marker">*</span>
            </label>
            <div className="ds-form-input-container">
              <input 
                type="text" 
                className="ds-form-input" 
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">Description</label>
            <div className="ds-form-input-container">
              <textarea 
                rows="3" 
                className="ds-form-input ds-form-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">Start Date</label>
            <div className="ds-form-input-container">
              <input 
                type="date" 
                className="ds-form-input" 
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">Due Date</label>
            <div className="ds-form-input-container">
              <input 
                type="date" 
                className="ds-form-input" 
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">Reminder</label>
            <div className="ds-form-input-container">
              <input 
                type="datetime-local" 
                className="ds-form-input" 
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">Priority</label>
            <div className="ds-form-input-container">
              <select 
                className="ds-form-input ds-form-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Select</option>
                <option>High</option>
                <option>Moderate</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="ds-form-row">
            <label className="ds-form-label">
              Status <span className="ds-required-marker">*</span>
            </label>
            <div className="ds-form-input-container">
              <select 
                className="ds-form-input ds-form-select" 
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option>select</option>
                <option>Open</option>
              </select>
            </div>
          </div>

          <div className="ds-form-actions">
            <button 
              type="submit" 
              className="ds-btn ds-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              type="button" 
              className="ds-btn ds-btn-outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;