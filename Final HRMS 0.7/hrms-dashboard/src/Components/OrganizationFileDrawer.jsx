import React, { useRef, useState, useEffect } from 'react';
import './OrganizationFileDrawer.css';
import axios from 'axios';

const OrganizationFileDrawer = ({ isOpen, onClose, onFileUpload }) => {
  const fileInputRef = useRef(null);

  const [selectedFileName, setSelectedFileName] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [shareWith, setShareWith] = useState('');
  const [folder, setFolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isPolicy, setIsPolicy] = useState(false);
  const [noDeadline, setNoDeadline] = useState(false);
  const [enforceDeadline, setEnforceDeadline] = useState(false);
  const [ackDeadline, setAckDeadline] = useState('');
  const [downloadAccess, setDownloadAccess] = useState(false);
  const [notifyFeed, setNotifyFeed] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);

  // Error states
  const [fileError, setFileError] = useState('');
  const [fileNameError, setFileNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [shareWithError, setShareWithError] = useState('');
  const [folderError, setFolderError] = useState('');
  const [ackDeadlineError, setAckDeadlineError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedFileName('');
    setFile(null);
    setFileName('');
    setDescription('');
    setShareWith('');
    setFolder('');
    setExpiryDate('');
    setIsPolicy(false);
    setNoDeadline(false);
    setEnforceDeadline(false);
    setAckDeadline('');
    setDownloadAccess(false);
    setNotifyFeed(false);
    setNotifyEmail(false);

    // Clear errors
    setFileError('');
    setFileNameError('');
    setDescriptionError('');
    setShareWithError('');
    setFolderError('');
    setAckDeadlineError('');
  };

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
      setFileError('');
    }
  };

  // Helper function to check only letters and spaces
  const isAlphaOnly = (str) => /^[A-Za-z\s]*$/.test(str);

  const handleSave = async () => {
    // Reset errors before validation
    setFileError('');
    setFileNameError('');
    setDescriptionError('');
    setShareWithError('');
    setFolderError('');
    setAckDeadlineError('');

    let valid = true;

    if (!file) {
      setFileError('Please upload a file.');
      valid = false;
    }
    if (!fileName.trim()) {
      setFileNameError('File name is required.');
      valid = false;
    } else if (!isAlphaOnly(fileName)) {
      setFileNameError('File name must contain only letters and spaces.');
      valid = false;
    }
    if (description && !isAlphaOnly(description)) {
      setDescriptionError('Description must contain only letters and spaces.');
      valid = false;
    }
    if (!shareWith.trim()) {
      setShareWithError('Please select a file access option.');
      valid = false;
    }
    if (!folder.trim()) {
      setFolderError('Please select a folder.');
      valid = false;
    }
    if (enforceDeadline && !noDeadline && !ackDeadline) {
      setAckDeadlineError('Acknowledgement deadline is required when "Enforce mandatory deadline" is selected.');
      valid = false;
    }

    if (!valid) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', fileName);
    formData.append('description', description);
    formData.append('sharedWith', shareWith);
    formData.append('folder', folder);
    formData.append('expiryDate', expiryDate);
    formData.append('isPolicy', isPolicy);
    formData.append('noDeadline', noDeadline);
    formData.append('enforceDeadline', enforceDeadline);
    formData.append('ackDeadline', ackDeadline);
    formData.append('downloadAccess', downloadAccess);
    formData.append('notifyFeed', notifyFeed);
    formData.append('notifyEmail', notifyEmail);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/files/uploads',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      onFileUpload(response.data);
      alert('File saved successfully!');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Something went wrong during file upload.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="OrganizationDrawer-drawer-overlay" onClick={onClose}>
      <div className="OrganizationDrawer-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="OrganizationDrawer-drawer-header">
          <h2>Add organization file</h2>
          <button className="OrganizationDrawer-close-button" onClick={onClose}>×</button>
        </div>

        <div className="OrganizationDrawer-drawer-scrollable">
          <div className="OrganizationDrawer-drawer-content">
            <label className="OrganizationDrawer-upload-label">Upload file</label>
            <div className="OrganizationDrawer-upload-box" onClick={handleUploadClick}>
              {selectedFileName ? `📄 ${selectedFileName}` : '📁 Desktop / Others'}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
            />
            {fileError && <span className="error-text">{fileError}</span>}

            <label>File name *</label>
            <input
              type="text"
              placeholder="Enter a name for the file"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            {fileNameError && <span className="error-text">{fileNameError}</span>}

            <label>Description</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && <span className="error-text">{descriptionError}</span>}

            <label>Share with *</label>
            <input
              type="text"
              placeholder="Departments or locations"
              value={shareWith}
              onChange={(e) => setShareWith(e.target.value)}
            />
            {shareWithError && <span className="error-text">{shareWithError}</span>}

            <label>Folder *</label>
            <select value={folder} onChange={(e) => setFolder(e.target.value)}>
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            {folderError && <span className="error-text">{folderError}</span>}

            <label>File expiry date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />

            <div className="OrganizationDrawer-checkbox-group">
              <div className="OrganizationDrawer-checkbox-row">
                <input
                  type="checkbox"
                  id="policy-checkbox"
                  checked={isPolicy}
                  onChange={() => setIsPolicy(!isPolicy)}
                />
                <label htmlFor="policy-checkbox">
                  Mark as organization policy document
                </label>
              </div>
              <small>
                Identify as an important organization-wide policy document. Example: Company guideline document, harassment policy.
              </small>
            </div>
          </div>

          <div className="OrganizationDrawer-acknowledgement-content">
            <div className="OrganizationDrawer-acknowledgement-card">
              <h4>Acknowledgement</h4>
              <p>
                When enabled, employees will be required to manually acknowledge reading the sent documents.
              </p>

              <div className="OrganizationDrawer-checkbox-row">
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

              <div className="OrganizationDrawer-checkbox-row">
                <input
                  type="checkbox"
                  checked={enforceDeadline}
                  disabled={noDeadline}
                  onChange={() => setEnforceDeadline(!enforceDeadline)}
                />
                <label>Enforce mandatory deadline</label>
              </div>

              {enforceDeadline && !noDeadline && (
                <div className="OrganizationDrawer-deadline-input">
                  <input
                    type="date"
                    value={ackDeadline}
                    onChange={(e) => setAckDeadline(e.target.value)}
                  />
                  {ackDeadlineError && <span className="error-text">{ackDeadlineError}</span>}
                  <p className="OrganizationDrawer-info-message">
                    Employees must acknowledge the document before the last date. On the deadline, system actions will be restricted until they do.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="OrganizationDrawer-file-section">
            <h4>File permissions</h4>
            <p className="OrganizationDrawer-subtitle">Allow employees to download files</p>
            <div className="OrganizationDrawer-checkbox-row">
              <input
                type="checkbox"
                checked={downloadAccess}
                onChange={() => setDownloadAccess(!downloadAccess)}
              />
              <label>Allow download</label>
            </div>
          </div>

          <div className="OrganizationDrawer-file-section">
            <h4>Notifications</h4>
            <p className="OrganizationDrawer-subtitle">Notify employees when files are uploaded</p>
            <div className="OrganizationDrawer-checkbox-row">
              <input
                type="checkbox"
                checked={notifyFeed}
                onChange={() => setNotifyFeed(!notifyFeed)}
              />
              <label>Send notification to employee feed</label>
            </div>

            <div className="OrganizationDrawer-checkbox-row">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={() => setNotifyEmail(!notifyEmail)}
              />
              <label>Send email to employees</label>
            </div>
          </div>
        </div>

        <div className="OrganizationDrawer-actions">
          <button className="OrganizationDrawer-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="OrganizationDrawer-save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationFileDrawer;
