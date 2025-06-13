import './FileSavePage.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InnerFileSaveNavbar from '../pages/InnerFileSaveNavbar';
import OrganizationFileDrawer from './OrganizationFileDrawer';
import bot from '../assets/bot.png';

const InnerOrganizationFile = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const menuRef = useRef(null);

  // Fetch files from backend when component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/files/organization-files')
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.error('Error fetching files:', err);
      });
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
            <img src={bot} alt="No organization files" className="empty-icon" />
            <p className="empty-title">No organization file added</p>
            <p className="empty-subtitle">
              Upload important common files such as policies or company handbooks that can be
              shared across the entire organization or for selected business entities, locations,
              departments, etc.
            </p>
            <button
              className="InnerOrganizationFile-upload-button"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Organization Files
            </button>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="table-header">
            <button
              className="InnerOrganizationFile-upload-button"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Organization Files
            </button>
          </div>

          <div className="scrollable-table-container">
            {/* Fixed header */}
            <table className="InnerOrganizationFile-file-table">
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

            {/* Scrollable body */}
            <div className="scroll-body">
              <table className="InnerOrganizationFile-file-table">
                <tbody>
                  {files.map((file, index) => (
                    <tr key={file._id || index}>
                      <td>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                          alt="File"
                          style={{ width: '20px', marginRight: '8px' }}
                        />
                        {file.originalName || file.name}
                      </td>
                      <td>{file.sharedWith || 'All'}</td>
                      <td>{file.folder || '-'}</td>
                      <td>{new Date(file.updatedAt).toLocaleDateString()}</td>
                      <td className="InnerOrganizationFile-action-cell">
                        <div
                          className="InnerOrganizationFile-action-menu-wrapper"
                          ref={activeMenuIndex === index ? menuRef : null}
                        >
                          <button
                            className="InnerOrganizationFile-dots-button"
                            onClick={() =>
                              setActiveMenuIndex(activeMenuIndex === index ? null : index)
                            }
                          >
                            ⋮
                          </button>
                          {activeMenuIndex === index && (
                            <div className="InnerOrganizationFile-dropdown-menu">
                              <a
                                href={`http://localhost:8000/uploads/${file.fileName}`}
                                download={file.name}
                                className="InnerOrganizationFile-dropdown-item"
                              >
                                Download
                              </a>
                              <button
                                onClick={() => handleDeleteFile(index)}
                                className="InnerOrganizationFile-dropdown-item"
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

      <OrganizationFileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default InnerOrganizationFile;
