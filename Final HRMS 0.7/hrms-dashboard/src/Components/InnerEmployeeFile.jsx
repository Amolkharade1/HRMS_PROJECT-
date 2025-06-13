import './FileSavePage.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerFileSaveNavbar from '../pages/InnerFileSaveNavbar';
import EmployeeFileDrawer from './EmployeeFileDrawer';
import bot from '../assets/bot.png';
import axios from 'axios';

const InnerEmployeeFile = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/employeeFile/employee-files')
      .then((res) => setFiles(res.data))
      .catch((err) => console.error('Error fetching files:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuIndex(null);
      }
    };

    if (activeMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuIndex]);

  const handleFileUpload = (newFile) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setIsDrawerOpen(false);
  };

  const handleDeleteFile = (indexToDelete) => {
    const updatedFiles = files.filter((_, index) => index !== indexToDelete);
    setFiles(updatedFiles);
    setActiveMenuIndex(null);
  };

  return (
    <div className="page-wrapper">
      <InnerFileSaveNavbar />

      <div className="file-actions-bar">
        <button className="icon-button">
          <img src={require('../assets/listIcon.png')} alt="List View" />
        </button>
        <button className="icon-button">
          <img src={require('../assets/folderIcon.png')} alt="Folder View" />
        </button>
        <button className="icon-button">
          <img src={require('../assets/filterIcon.png')} alt="Filter" />
        </button>
      </div>

      {files.length === 0 ? (
        <div className="shared-box">
          <div className="shared-content">
            <img src={bot} alt="No files" className="empty-icon" />
            <p className="empty-title">No Employee File Added</p>
            <p className="empty-subtitle">
              Upload confidential documents pertaining to specific employees or important documents to share across employees of a specific role.
            </p>
            <button
              className="InnerEmployeeFile-upload-button"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Employee Files
            </button>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="table-header">
            <button
              className="InnerEmployeeFile-upload-button"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Employee Files
            </button>
          </div>

          <div className="scrollable-table-container">
            <table className="InnerEmployeeFile-file-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Shared With</th>
                  <th>Folder</th>
                  <th>Updated On</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>

            <div className="scroll-body">
              <table className="InnerEmployeeFile-file-table">
                <tbody>
                  {files.map((file, index) => (
                    <tr key={file._id || index}>
                      <td>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                          alt="File"
                          style={{ width: '20px', marginRight: '8px' }}
                        />
                        {file.name}
                      </td>
                      <td>{file.sharedWith || 'All'}</td>
                      <td>{file.folder || '—'}</td>
                      <td>{new Date(file.updatedAt).toLocaleDateString()}</td>
                      <td className="InnerEmployeeFile-action-cell">
                        <div
                          className="InnerEmployeeFile-action-menu-wrapper"
                          ref={index === activeMenuIndex ? menuRef : null}
                        >
                          <button
                            className="InnerEmployeeFile-dots-button"
                            onClick={() =>
                              setActiveMenuIndex(
                                index === activeMenuIndex ? null : index
                              )
                            }
                          >
                            ⋮
                          </button>

                          {index === activeMenuIndex && (
                            <div className="InnerEmployeeFile-dropdown-menu">
                              <a
                                href={`http://localhost:8000/uploads/${file.fileName}`}
                                download={file.name}
                                className="InnerEmployeeFile-dropdown-item"
                              >
                                Download
                              </a>
                              <button
                                onClick={() => handleDeleteFile(index)}
                                className="InnerEmployeeFile-dropdown-item"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <EmployeeFileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default InnerEmployeeFile;
