import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExperienceLetter.css';
import HRLetterPageNavbar from '../pages/HRLetterPageNavbar ';

const ExperienceLetter = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTasksBtn = () => {
    navigate("/ExperienceLetterForm");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/experience-letter');
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/experience-letter/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRecords(records.filter(record => record._id !== id));
          alert('Record deleted successfully!');
        } else {
          throw new Error('Failed to delete record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  // 🔍 Filter logic
  const filteredRecords = records.filter(record =>
    record.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.reasonForRequest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.otherReason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="experience-page-container">
      <HRLetterPageNavbar />
      <div className="experience-main-container">
        <div className="experience-action-header">
          <div className="experience-search-container">
            <input
              type="text"
              className="experience-search-input"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="experience-search-button">
              <i className="experience-search-icon">🔍</i>
            </button>
          </div>
          <button className="experience-add-record-btn" onClick={handleTasksBtn}>Add Record</button>
        </div>

        <div className="experience-table-scroll-container">
          <div className="experience-table-wrapper">
            <div className="experience-table-header">
              <div className="experience-table-cell experience-checkbox-cell">
                {/* <input type="checkbox" /> */}
              </div>
              <div className="experience-table-cell">EmployeeID</div>
              <div className="experience-table-cell">Date of request</div>
              <div className="experience-table-cell">Reason for request</div>
              <div className="experience-table-cell">Other Reason</div>
              <div className="experience-table-cell experience-actions-cell">Actions</div>
            </div>

            <div className="experience-table-body">
              {loading ? (
                <div className="experience-no-records-message">Loading...</div>
              ) : filteredRecords.length === 0 ? (
                <div className="experience-no-records-message">No records found</div>
              ) : (
                filteredRecords.map((record, index) => (
                  <div key={index} className="experience-table-row">
                    <div className="experience-table-cell experience-checkbox-cell">
                      {/* <input type="checkbox" /> */}
                    </div>
                    <div className="experience-table-cell">{record.employeeId}</div>
                    <div className="experience-table-cell">{new Date(record.requestDate).toLocaleDateString()}</div>
                    <div className="experience-table-cell">{record.reasonForRequest}</div>
                    <div className="experience-table-cell">{record.otherReason || '-'}</div>
                    <div className="experience-table-cell experience-actions-cell">
                      <button 
                        className="experience-delete-btn" 
                        onClick={() => handleDelete(record._id)}
                        title="Delete"
                      >
                        🗑️ 
                      </button>
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

export default ExperienceLetter;
