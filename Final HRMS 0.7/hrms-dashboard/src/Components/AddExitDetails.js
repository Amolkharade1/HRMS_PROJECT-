import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddExitDetails.css';



const AddExitDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    separationDate: '',
    interviewer: '',
    reasonForLeaving: '',
    rejoinOrganization: '',
    likedMost: '',
    improveStaffWelfare: '',
    additionalComments: '',
    checklist: {
      companyVehicle: '',
      equipments: '',
      libraryBooks: '',
      security: '',
      exitInterview: '',
      noticePeriod: '',
      resignationLetter: '',
      managerClearance: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchExitDetail = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:8000/api/exitdetails/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch exit detail');
          }
          const data = await response.json();
          setFormData(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching exit detail:', error);
          setError('Failed to load exit detail');
          setLoading(false);
        }
      };
      fetchExitDetail();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.checklist) {
      setFormData((prev) => ({
        ...prev,
        checklist: {
          ...prev.checklist,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditMode
        ? `http://localhost:8000/api/exitdetails/${id}`
        : 'http://localhost:8000/api/exitdetails';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} exit detail`);
      }

      navigate('/exitdetails');
    } catch (error) {
      console.error('Error saving exit detail:', error);
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} exit detail. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/exitdetails');
  };

  if (loading && isEditMode) {
    return <div className="aed-loading">Loading exit details...</div>;
  }

  return (
    
     

      <div className="aed-container">
        <div className="aed-header">
          <h2>{isEditMode ? 'Edit Exit Details' : 'Add New Exit Details'}</h2>
        </div>

        {error && <div className="aed-error-message">{error}</div>}

        <div className="aed-form-box">
          <h3 className="aed-section-title">Separation</h3>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Employee ID <span className="aed-required">*</span></label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="aed-input-field"
                required
                disabled={loading}
              >
                <option value="">Select</option>
                <option value="EMP001">Varad (EMP001)</option>
                <option value="EMP002">Tejas(EMP002)</option>
                <option value="EMP003">Robert Johnson (EMP003)</option>
              </select>
            </div>
            <div className="aed-form-group">
              <label>Separation date <span className="aed-required">*</span></label>
              <input
                type="date"
                name="separationDate"
                value={formData.separationDate}
                onChange={handleChange}
                className="aed-input-field"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Interviewer <span className="aed-required">*</span></label>
              <select
                name="interviewer"
                value={formData.interviewer}
                onChange={handleChange}
                className="aed-input-field"
                required
                disabled={loading}
              >
                <option value="">Select</option>
                <option value="Manager A">Manager A</option>
                <option value="Manager B">Manager B</option>
                <option value="HR Representative">HR Representative</option>
              </select>
            </div>
            <div className="aed-form-group">
              <label>Reason for leaving</label>
              <select
                name="reasonForLeaving"
                value={formData.reasonForLeaving}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              >
                <option value="">Select</option>
                <option value="Personal">Personal</option>
                <option value="Better Opportunity">Better Opportunity</option>
                <option value="Career Change">Career Change</option>
                <option value="Relocation">Relocation</option>
                <option value="Health Reasons">Health Reasons</option>
              </select>
            </div>
          </div>

          <h3 className="aed-section-title">Questionnaire</h3>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Working for this organization again</label>
              <select
                name="rejoinOrganization"
                value={formData.rejoinOrganization}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>

            <div className="aed-form-group">
              <label>What did you like the most of the organization</label>
              <textarea
                // type="text" 
                name="likedMost"
                value={formData.likedMost}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
                placeholder="Enter what you liked most"
              ></textarea>
            </div>
          </div>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Think the organization do to improve staff welfare</label>
              <textarea
                name="improveStaffWelfare"
                value={formData.improveStaffWelfare}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
                placeholder="Your suggestions for improvement"
                rows="3"
              ></textarea>
            </div>
            <div className="aed-form-group">
              <label>Anything you wish to share with us</label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
                placeholder="Additional comments or feedback"
                rows="3"
              ></textarea>
            </div>
          </div>

          <h3 className="aed-section-title">Checklist for Exit Interview</h3>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Company Vehicle handed in</label>
              <input
                type="text"
                name="companyVehicle"
                value={formData.checklist.companyVehicle}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
            <div className="aed-form-group">
              <label>All equipments handed in</label>
              <input
                type="text"
                name="equipments"
                value={formData.checklist.equipments}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
          </div>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>All library books submitted</label>
              <input
                type="text"
                name="libraryBooks"
                value={formData.checklist.libraryBooks}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
            <div className="aed-form-group">
              <label>Security</label>
              <input
                type="text"
                name="security"
                value={formData.checklist.security}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
          </div>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Exit interview conducted</label>
              <input
                type="text"
                name="exitInterview"
                value={formData.checklist.exitInterview}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
            <div className="aed-form-group">
              <label>Notice period followed</label>
              <input
                type="text"
                name="noticePeriod"
                value={formData.checklist.noticePeriod}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
          </div>

          <div className="aed-form-row">
            <div className="aed-form-group">
              <label>Resignation letter submitted</label>
              <input
                type="text"
                name="resignationLetter"
                value={formData.checklist.resignationLetter}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
            <div className="aed-form-group">
              <label>Manager/Supervisor clearance</label>
              <input
                type="text"
                name="managerClearance"
                value={formData.checklist.managerClearance}
                onChange={handleChange}
                className="aed-input-field"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="aed-form-actions aed-sticky-footer">
          <button
            type="button"
            className="aed-btn aed-blue"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : isEditMode ? 'Update' : 'Submit'}
          </button>
          <button
            type="button"
            className="aed-btn aed-gray"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    
  );
};

export default AddExitDetails;