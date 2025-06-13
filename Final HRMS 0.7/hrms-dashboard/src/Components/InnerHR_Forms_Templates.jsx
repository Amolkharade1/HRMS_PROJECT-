import React from 'react';
import './InnerHR_Forms_Templates.css';
import InnerFileSaveNavbar from '../pages/InnerFileSaveNavbar';

const InnerHR_Forms_Templates = () => {
  const files = [
    {
      name: "Company Handbook Template",
      created: "02-May-2025",
      description: "A sample company handbook that can be edited and used to guide your employees and convey your company's vision, mission and operating policies.",
    },
  ];

  return (
    <div>
         <InnerFileSaveNavbar />
    
    <div className="HR-file-list-container">
         
      <table className="HR-file-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>
                <div className="HR-file-name">
                  📄 {file.name}
                  <div className="HR-file-date">Created on {file.created}</div>
                </div>
              </td>
              <td>{file.description}</td>
              <td>
                <button className="HR-action-btn">⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default InnerHR_Forms_Templates;
