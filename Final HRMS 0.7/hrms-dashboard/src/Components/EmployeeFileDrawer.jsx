import React, { useRef, useState, useEffect } from 'react';
import './EmployeeFileDrawer.css';
import axios from 'axios';

const EmployeeFileDrawer = ({ isOpen, onClose, onFileUpload }) => {
  const fileInputRef = useRef(null);

  const [selectedFileName, setSelectedFileName] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [shareWith, setShareWith] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [folder, setFolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isPolicy, setIsPolicy] = useState(false);
  const [noDeadline, setNoDeadline] = useState(false);
  const [enforceDeadline, setEnforceDeadline] = useState(false);
  const [ackDeadline, setAckDeadline] = useState('');
  const [downloadAccess, setDownloadAccess] = useState(false);
  const [notifyFeed, setNotifyFeed] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [viewAccessEmployee, setViewAccessEmployee] = useState(true);
  const [viewAccessManager, setViewAccessManager] = useState(false);
  const [downloadAccessEmployee, setDownloadAccessEmployee] = useState(true);
  const [downloadAccessManager, setDownloadAccessManager] = useState(false);

  const [fileNameError, setFileNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setSelectedFileName('');
    setFile(null);
    setFileName('');
    setDescription('');
    setShareWith('');
    setEmployeeId('');
    setFolder('');
    setExpiryDate('');
    setIsPolicy(false);
    setNoDeadline(false);
    setEnforceDeadline(false);
    setAckDeadline('');
    setDownloadAccess(false);
    setNotifyFeed(false);
    setNotifyEmail(false);
    setViewAccessEmployee(true);
    setViewAccessManager(false);
    setDownloadAccessEmployee(true);
    setDownloadAccessManager(false);
    setFileNameError('');
    setDescriptionError('');
  };

  const isAlphaOnly = (value) => /^[a-zA-Z\s]*$/.test(value);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        alert('File too large. Maximum size is 5MB.');
        return;
      }
      setSelectedFileName(selected.name);
      setFile(selected);
    }
  };

  const handleSave = async () => {
    const errors = [];

    if (!file) errors.push('Please upload a file.');
    if (!fileName.trim()) errors.push('File name is required.');
    if (!isAlphaOnly(fileName)) errors.push('File name must contain only letters and spaces.');
    if (!isAlphaOnly(description)) errors.push('Description must contain only letters and spaces.');
    if (!shareWith) errors.push('Please select a file access option.');
    if (!employeeId.trim()) errors.push('Please select an employee.');
    if (!folder.trim()) errors.push('Please select a folder.');
    if (enforceDeadline && !noDeadline && !ackDeadline) {
      errors.push('Acknowledgement deadline is required when "Enforce mandatory deadline" is selected.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const formData = new FormData();
    formData.append('employeeFile', file);
    formData.append('name', fileName);
    formData.append('description', description);
    formData.append('sharedWithType', shareWith); 
    formData.append('sharedWith', employeeId);
    formData.append('employeeId', employeeId);
    formData.append('folder', folder);
    formData.append('expiryDate', expiryDate);
    formData.append('isPolicy', isPolicy);
    formData.append('noDeadline', noDeadline);
    formData.append('enforceDeadline', enforceDeadline);
    formData.append('ackDeadline', ackDeadline);
    formData.append('downloadAccess', downloadAccess);
    formData.append('notifyFeed', notifyFeed);
    formData.append('notifyEmail', notifyEmail);
    formData.append('permissions', JSON.stringify({
      view: {
        employee: viewAccessEmployee,
        manager: viewAccessManager
      },
      download: {
        employee: downloadAccessEmployee,
        manager: downloadAccessManager
      }
    }));

    try {
      const response = await axios.post(
        'http://localhost:8000/api/employeeFile/Empuploads',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      onFileUpload?.(response.data);
      alert('File saved successfully!');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Something went wrong during file upload.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="EmployeeDrawer-drawer-overlay" onClick={onClose}>
      <div className="EmployeeDrawer-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="EmployeeDrawer-drawer-header">
          <h2>Add Employee file</h2>
          <button className="EmployeeDrawer-close-button" onClick={onClose}>×</button>
        </div>

        <div className="EmployeeDrawer-drawer-scrollable">
          <div className="EmployeeDrawer-drawer-content">
            <label className="EmployeeDrawer-upload-label">Upload file</label>
            <div className="EmployeeDrawer-upload-box" onClick={handleUploadClick}>
              {selectedFileName ? `📄 ${selectedFileName}` : '📁 Desktop / Others'}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
            />

            <label>File name *</label>
            <input
              type="text"
              placeholder="Enter a name for the file"
              value={fileName}
              onChange={(e) => {
                const value = e.target.value;
                if (isAlphaOnly(value)) {
                  setFileName(value);
                  setFileNameError('');
                } else {
                  setFileNameError('Only letters and spaces are allowed.');
                }
              }}
            />
            {fileNameError && <span className="error-text">{fileNameError}</span>}

            <div className="EmployeeDrawer-access-section">
              <label className="EmployeeDrawer-label">File access *</label>
              <div className="EmployeeDrawer-radio-group">
                <div className="EmployeeDrawer-radio-option">
                  <input
                    type="radio"
                    name="fileAccess"
                    value="employee"
                    checked={shareWith === 'employee'}
                    onChange={() => setShareWith('employee')}
                  />
                  <span>Active employee</span>
                </div>
                <div className="EmployeeDrawer-radio-option">
                  <input
                    type="radio"
                    name="fileAccess"
                    value="role"
                    checked={shareWith === 'role'}
                    onChange={() => setShareWith('role')}
                  />
                  <span>Role</span>
                </div>
              </div>
            </div>

            <label>Employee *</label>
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">Select</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>

            <label>Description</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                if (isAlphaOnly(value)) {
                  setDescription(value);
                  setDescriptionError('');
                } else {
                  setDescriptionError('Only letters and spaces are allowed.');
                }
              }}
            />
            {descriptionError && <span className="error-text">{descriptionError}</span>}

            <label>Folder *</label>
            <select value={folder} onChange={(e) => setFolder(e.target.value)}>
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="EmployeeDrawer-acknowledgement-content">
            <div className="EmployeeDrawer-acknowledgement-card">
              <h4>Acknowledgement</h4>
              <p>
                When enabled, employees will be required to manually acknowledge reading the sent documents.
              </p>

              <div className="EmployeeDrawer-checkbox-row">
                <input
                  type="checkbox"
                  checked={noDeadline}
                  onChange={() => {
                    setNoDeadline(!noDeadline);
                    if (!noDeadline) setEnforceDeadline(false);
                  }}
                />
                <label>No deadline</label>
              </div>

              <div className="EmployeeDrawer-checkbox-row">
                <input
                  type="checkbox"
                  checked={enforceDeadline}
                  disabled={noDeadline}
                  onChange={() => setEnforceDeadline(!enforceDeadline)}
                />
                <label>Enforce mandatory deadline</label>
              </div>

              {enforceDeadline && !noDeadline && (
                <div className="EmployeeDrawer-deadline-input">
                  <input
                    type="date"
                    value={ackDeadline}
                    onChange={(e) => setAckDeadline(e.target.value)}
                  />
                  <p className="EmployeeDrawer-info-message">
                    Employees must acknowledge the document before the last date.
                    On the deadline, system actions will be restricted until they do.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="EmployeeDrawer-file-section">
            <h4>File permissions</h4>
            <p className="EmployeeDrawer-subtitle">View access</p>
            <div className="EmployeeDrawer-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={viewAccessEmployee}
                  onChange={() => setViewAccessEmployee(!viewAccessEmployee)}
                />
                Employee
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={viewAccessManager}
                  onChange={() => setViewAccessManager(!viewAccessManager)}
                />
                Reporting manager
              </label>
            </div>

            <p className="EmployeeDrawer-subtitle">Download access</p>
            <div className="EmployeeDrawer-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={downloadAccessEmployee}
                  onChange={() => setDownloadAccessEmployee(!downloadAccessEmployee)}
                />
                Employee
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={downloadAccessManager}
                  onChange={() => setDownloadAccessManager(!downloadAccessManager)}
                />
                Reporting manager
              </label>
            </div>
          </div>

          <div className="EmployeeDrawer-file-section">
            <h4>Notifications</h4>
            <p className="EmployeeDrawer-subtitle">Notify employees when files are uploaded</p>
            <div className="EmployeeDrawer-checkbox-row">
              <input
                type="checkbox"
                checked={notifyFeed}
                onChange={() => setNotifyFeed(!notifyFeed)}
              />
              <label>Send notification to employee feed</label>
            </div>
            <div className="EmployeeDrawer-checkbox-row">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={() => setNotifyEmail(!notifyEmail)}
              />
              <label>Send email to employees</label>
            </div>
          </div>
        </div>

        <div className="EmployeeDrawer-actions">
          <button className="EmployeeDrawer-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="EmployeeDrawer-save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFileDrawer;
