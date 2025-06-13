import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddressProof.css';
import HRLetterPageNavbar from '../pages/HRLetterPageNavbar ';

const AddressProof = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  const handleTasksBtn = () => {
    navigate("/AddressProofForm");
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/address-proof');
        setRecords(res.data);
      } catch (err) {
        console.error('Failed to fetch address proof data', err);
      }
    };

    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
    try {
      await axios.delete(`http://localhost:8000/api/address-proof/${id}`);
      setRecords(prevRecords => prevRecords.filter(record => record._id !== id));
    } catch (err) {
      console.error('Failed to delete address proof record', err);
      alert('Failed to delete record. Please try again.');
    }
  }
};

  return (
    <div className="address-proof-page-container">
      <HRLetterPageNavbar />

      <div className="address-proof-main-container">
        <div className="address-proof-action-header">
          <div className="address-proof-search-container">
            <input
              type="text"
              className="address-proof-search-input"
              placeholder="Search records..."
            />
            <button className="address-proof-search-button">
              <i className="address-proof-search-icon">🔍</i>
            </button>
          </div>
          <button className="address-proof-add-record-btn" onClick={handleTasksBtn}>Add Record</button>
        </div>

        <div className="address-proof-table-scroll-container">
          <div className="address-proof-table-wrapper">
            <div className="address-proof-table-header">
              <div className="address-proof-table-cell address-proof-checkbox-cell">
                {/* <input type="checkbox" /> */}
              </div>
              <div className="address-proof-table-cell">EmployeeID</div>
              <div className="address-proof-table-cell">Date of Request</div>
              <div className="address-proof-table-cell">Is Address Changed?</div>
              <div className="address-proof-table-cell">Reason</div>
              <div className="address-proof-table-cell">Other Reason</div>
              <div className="address-proof-table-cell">New Present Address</div>
              <div className="address-proof-table-cell address-proof-actions-cell">Actions</div>
            </div>

            <div className="address-proof-table-body">
              {records.length > 0 ? (
                records.map((item) => (
                  <div className="address-proof-table-row" key={item._id}>
                    <div className="address-proof-table-cell address-proof-checkbox-cell">
                      {/* <input type="checkbox" /> */}
                    </div>
                    <div className="address-proof-table-cell">{item.employeeId}</div>
                    <div className="address-proof-table-cell">{new Date(item.requestDate).toLocaleDateString()}</div>
                    <div className="address-proof-table-cell">{item.hasAddressChange}</div>
                    <div className="address-proof-table-cell">{item.reasonForRequest}</div>
                    <div className="address-proof-table-cell">{item.otherReason}</div>
                    <div className="address-proof-table-cell">
                      {item.hasAddressChange === 'yes' && item.address ? (
                        <>
                          {item.address.addressLine1}, {item.address.addressLine2}, {item.address.city}, {item.address.state}, {item.address.country}, {item.address.postalCode}
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                    <div className="address-proof-table-cell address-proof-actions-cell">
                      <button 
                        className="address-proof-delete-btn" 
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                      >
                        🗑️ 
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="address-proof-no-records-message">No records found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressProof;