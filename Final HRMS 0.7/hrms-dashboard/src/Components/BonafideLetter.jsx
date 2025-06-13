import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BonafideLetter.css';
import HRLetterPageNavbar from '../pages/HRLetterPageNavbar ';

const BonafideLetter = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTasksBtn = () => {
    navigate("/BonafideLetterForm");
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/bonafide-letter');
        setLetters(res.data);
      } catch (err) {
        console.error('Failed to fetch bonafide letters:', err);
      }
    };

    fetchLetters();
  }, []);

 const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this record?')) {
    try {
      await axios.delete(`http://localhost:8000/api/bonafide-letter/${id}`);
      setLetters(letters.filter(letter => letter._id !== id));
      alert('Record deleted successfully!');
    } catch (err) {
      console.error('Failed to delete bonafide letter:', err);
      alert('Failed to delete record. Please try again.');
    }
  }
};


  // 🔍 Filter letters based on search term
  const filteredLetters = letters.filter((letter) => {
    const search = searchTerm.toLowerCase();
    return (
      letter.employeeId?.toLowerCase().includes(search) ||
      letter.reasonForRequest?.toLowerCase().includes(search) ||
      letter.otherReason?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bonafide-page-container">
      <HRLetterPageNavbar />

      <div className="bonafide-main-container">
        <div className="bonafide-action-header">
          <div className="bonafide-search-container">
            <input
              type="text"
              className="bonafide-search-input"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bonafide-search-button">
              <i className="bonafide-search-icon">🔍</i>
            </button>
          </div>

          <button className="bonafide-add-record-btn" onClick={handleTasksBtn}>
            Add Record
          </button>
        </div>

        <div className="bonafide-table-scroll-container">
          <div className="bonafide-table-wrapper">
            <div className="bonafide-table-header">
              <div className="bonafide-table-cell bonafide-checkbox-cell">
                {/* <input type="checkbox" /> */}
              </div>
              <div className="bonafide-table-cell">EmployeeID</div>
              <div className="bonafide-table-cell">Date of request</div>
              <div className="bonafide-table-cell">Reason for request</div>
              <div className="bonafide-table-cell">Other Reason</div>
              <div className="bonafide-table-cell bonafide-actions-header">Actions</div>
            </div>

            <div className="bonafide-table-body">
              {filteredLetters.length === 0 ? (
                <div className="bonafide-no-records-message">No records found</div>
              ) : (
                filteredLetters.map((letter, index) => (
                  <div key={index} className="bonafide-table-row">
                    <div className="bonafide-table-cell bonafide-checkbox-cell">
                      {/* <input type="checkbox" /> */}
                    </div>
                    <div className="bonafide-table-cell">{letter.employeeId}</div>
                    <div className="bonafide-table-cell">
                      {new Date(letter.requestDate).toLocaleDateString()}
                    </div>
                    <div className="bonafide-table-cell">{letter.reasonForRequest}</div>
                    <div className="bonafide-table-cell">
                      {letter.reasonForRequest === 'other' ? letter.otherReason : '-'}
                    </div>
                    <div className="bonafide-table-cell bonafide-actions-cell">
                      <button
                        className="bonafide-delete-btn"
                        onClick={() => handleDelete(letter._id)}
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

export default BonafideLetter;
