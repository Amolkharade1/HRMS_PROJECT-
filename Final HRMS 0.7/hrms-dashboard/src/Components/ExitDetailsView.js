import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExitDetailsView.css';
import ExitDetailsNavbar from '../pages/ExitDetailsNavbar';

const ExitDetailsView = () => {
  const navigate = useNavigate();
  const [exitDetails, setExitDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchExitDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/exitdetails');
        if (!response.ok) {
          throw new Error('Failed to fetch exit details');
        }
        const data = await response.json();
        setExitDetails(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchExitDetails();
  }, []);

  const headers = [
    { key: 'employeeId', label: 'Employee ID', width: '120px' },
    { key: 'separationDate', label: 'Separation Date', width: '120px' },
    { key: 'interviewer', label: 'Interviewer', width: '150px' },
    { key: 'reasonForLeaving', label: 'Reason for Leaving', width: '150px' },
    { key: 'rejoinOrganization', label: 'Working for this organization again', width: '120px' },
    { key: 'improveStaffWelfare', label: 'Think the organization do to improve staff welfare', width: '200px' },
    { key: 'likedMost', label: 'What did you like the most of the organization', width: '200px' },
    { key: 'additionalWish', label: 'Anything you wish to share with us', width: '200px' },
    { key: 'checklist.companyVehicle', label: 'Company Vehicle handed in', width: '120px' },
    { key: 'checklist.libraryBooks', label: 'All library books submitted', width: '120px' },
    { key: 'checklist.exitInterview', label: 'Exit interview conducted', width: '120px' },
    { key: 'checklist.resignationLetter', label: 'Resignation letter submitted', width: '120px' },
    { key: 'checklist.equipments', label: 'All equipments handed in', width: '120px' },
    { key: 'checklist.security', label: 'Security', width: '120px' },
    { key: 'checklist.noticePeriod', label: 'Notice Notice period followed', width: '120px' },
    { key: 'checklist.managerClearance', label: 'Manager/Supervisor clearance', width: '120px' },
    { key: 'actions', label: 'Actions', width: '100px' }
  ];

  const handleAddRecord = () => {
    navigate('/add-exit-details');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/exitdetails/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete record');
        }
        setExitDetails(exitDetails.filter(detail => detail._id !== id));
      } catch (error) {
        console.error('Error deleting record:', error);
        setError('Failed to delete record. Please try again.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/add-exit-details/${id}`);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExitDetails = React.useMemo(() => {
    if (!sortConfig.key) return exitDetails;

    return [...exitDetails].sort((a, b) => {
      const keyParts = sortConfig.key.split('.');
      let valueA = a;
      let valueB = b;

      for (const part of keyParts) {
        valueA = valueA[part];
        valueB = valueB[part];
      }

      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [exitDetails, sortConfig]);

  const filteredExitDetails = sortedExitDetails.filter(detail => {
    const searchLower = searchTerm.toLowerCase();
    return (
      detail.employeeId.toLowerCase().includes(searchLower) ||
      (detail.interviewer && detail.interviewer.toLowerCase().includes(searchLower)) ||
      (detail.reasonForLeaving && detail.reasonForLeaving.toLowerCase().includes(searchLower)) ||
      (detail.rejoinOrganization && detail.rejoinOrganization.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <div className="exitview-loading-container">Loading exit details...</div>;
  }

  if (error) {
    return <div className="exitview-error-container">{error}</div>;
  }

  return (
    <div>
      <ExitDetailsNavbar />

      <div className="exitview-container">
        <div className="exitview-table-controls">
          <div className="exitview-search-container">
            <span className="exitview-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="exitview-search-input"
            />
          </div>
          <button className="exitview-add-record-btn" onClick={handleAddRecord}>
            + Add New Record
          </button>
        </div>

        <div className="exitview-table-scroll-container">
          <table className="exitview-table">
            <thead className="exitview-table-header">
              <tr>
                {headers.map((header) => (
                  <th
                    className={`exitview-header-cell ${header.key === 'actions' ? 'exitview-actions-cell' : ''}`}
                    key={header.key}
                    onClick={() => header.key !== 'actions' ? handleSort(header.key) : null}
                    style={{
                      cursor: header.key !== 'actions' ? 'pointer' : 'default',
                      width: header.width,
                      minWidth: header.width
                    }}
                  >
                    <div className="exitview-header-content">
                      <span className="exitview-header-text" title={header.label}>
                        {header.label}
                      </span>
                      {sortConfig.key === header.key && (
                        <span className="exitview-sort-icon">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="exitview-table-body">
              {filteredExitDetails.length === 0 ? (
                <tr className="exitview-no-records-row">
                  <td colSpan={headers.length}>
                    <div className="exitview-no-records">
                      <div className="exitview-no-records-image">
                        <div className="exitview-image-placeholder">📊</div>
                      </div>
                      <div className="exitview-no-records-text">
                        {searchTerm ? 'No matching records found' : 'No exit details available'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExitDetails.map((detail) => (
                  <tr className="exitview-table-row" key={detail._id}>
                    {headers.map((header) => {
                      if (header.key === 'actions') {
                        return (
                          <td
                            className="exitview-table-cell exitview-actions-cell"
                            key={header.key}
                            style={{ width: header.width, minWidth: header.width }}
                          >
                            <div className="exitview-action-buttons">
                              <button
                                className="exitview-edit-btn"
                                onClick={() => handleEdit(detail._id)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="exitview-delete-btn"
                                onClick={() => handleDelete(detail._id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        );
                      }

                      const keyParts = header.key.split('.');
                      let value = detail;
                      for (const part of keyParts) {
                        value = value?.[part];
                      }

                      let displayValue = 'N/A';
                      if (value) {
                        if (header.key === 'separationDate') {
                          displayValue = new Date(value).toLocaleDateString();
                        } else if (typeof value === 'string' && value.length > 30) {
                          displayValue = `${value.substring(0, 30)}...`;
                        } else {
                          displayValue = value;
                        }
                      }

                      return (
                        <td
                          className="exitview-table-cell"
                          key={header.key}
                          style={{ width: header.width, minWidth: header.width }}
                          title={typeof value === 'string' ? value : ''}
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      );
};

      export default ExitDetailsView;