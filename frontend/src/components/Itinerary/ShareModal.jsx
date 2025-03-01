import React, { useState, useEffect } from 'react';
import './ShareModal.css';

function ShareModal({ show, onClose, itineraryTitle = "JAPAN 2025", onSave }) {
  // Original data (what's currently saved)
  const [originalCollaborators, setOriginalCollaborators] = useState([
    { id: 1, username: 'johndoe', permission: 'read' },
    { id: 2, username: 'janedoe', permission: 'write' }
  ]);
  const [description, setDescription] = useState(
    'Trip to Japan starting January 1st, 2025. Includes Tokyo, Kyoto, and Osaka.'
  );
  const [originalIsPublic, setOriginalIsPublic] = useState(false);
  
  // Working data (what's being edited)
  const [collaborators, setCollaborators] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPermission, setNewPermission] = useState('read');
  const [isPublic, setIsPublic] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  // Initialize working data from original data whenever modal is shown
  useEffect(() => {
    if (show) {
      // Deep clone the collaborators to avoid modifying the original
      setCollaborators(JSON.parse(JSON.stringify(originalCollaborators)));
      setIsPublic(originalIsPublic);
    }
  }, [show, originalCollaborators, originalIsPublic]);

  if (!show) {
    return null;
  }

  const handleAddCollaborator = () => {
    if (!newUsername.trim()) return;
    
    // Check if username already exists
    if (collaborators.some(c => c.username.toLowerCase() === newUsername.toLowerCase())) {
      alert('This user is already a collaborator');
      return;
    }

    setCollaborators([
      ...collaborators,
      {
        id: Date.now(), // Simple unique ID
        username: newUsername,
        permission: newPermission
      }
    ]);
    setNewUsername('');
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
  };

  const handleChangePermission = (id, newPermission) => {
    setCollaborators(
      collaborators.map(c => 
        c.id === id ? { ...c, permission: newPermission } : c
      )
    );
  };

  // Start editing description
  const startEditingDescription = () => {
    setEditedDescription(description);
    setIsEditingDescription(true);
  };

  // Save the edited description immediately
  const handleSaveDescription = () => {
    setDescription(editedDescription);
    setIsEditingDescription(false);
  };

  // Cancel editing description without saving
  const handleCancelEdit = () => {
    setIsEditingDescription(false);
    // Don't update description, just discard changes
  };

  // Save all changes permanently (except description which already saves)
  const handleSaveChanges = () => {
    // Update the original data with all working changes
    setOriginalCollaborators(collaborators);
    setOriginalIsPublic(isPublic);
    
    // If there's an external save handler, call it
    if (onSave) {
      onSave({
        collaborators,
        description,
        isPublic
      });
    }
    
    onClose();
  };

  // Cancel all changes and close
  const handleCancel = () => {
    // Just close without updating original data
    onClose();
  };

  const copyShareLink = () => {
    const shareLink = `https://itinerate.app/share/${itineraryTitle.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleCancel}>×</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Share "{itineraryTitle}"</h2>
        </div>
        
        <div className="modal-content">
          <div className="project-description-section">
            <div className="section-header">
              <h3>Project Description</h3>
              <button 
                className="edit-description-btn"
                onClick={isEditingDescription ? handleCancelEdit : startEditingDescription}
              >
                {isEditingDescription ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditingDescription ? (
              <div className="description-edit-container">
                <textarea
                  className="description-textarea"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Enter a description for your itinerary..."
                  rows={3}
                />
                <button 
                  className="save-description-btn"
                  onClick={handleSaveDescription}
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="project-description">{description}</p>
            )}
          </div>

          <div className="privacy-section">
            <h3>Privacy Settings</h3>
            <div className="privacy-toggle">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                <span className="slider round"></span>
              </label>
              <span className="privacy-label">
                {isPublic ? 'Public' : 'Private'} 
              </span>
            </div>
            <p className="privacy-description">
              {isPublic 
                ? 'Anyone with the link can view this itinerary.' 
                : 'Only you and your collaborators can access this itinerary.'}
            </p>
          </div>

          {isPublic && (
            <div className="share-link-section">
              <h3>Share Link</h3>
              <div className="share-link-container">
                <input 
                  type="text" 
                  className="share-link-input" 
                  value={`https://itinerate.app/share/${itineraryTitle.toLowerCase().replace(/\s+/g, '-')}`}
                  readOnly
                />
                <button className="copy-link-btn" onClick={copyShareLink}>
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="collaborators-section">
            <h3>Collaborators</h3>
            <div className="add-collaborator">
              <input
                type="text"
                className="username-input"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <select 
                className="permission-select"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
              >
                <option value="read">View only</option>
                <option value="write">Can edit</option>
                <option value="admin">Admin</option>
              </select>
              <button 
                className="add-button"
                onClick={handleAddCollaborator}
                disabled={!newUsername.trim()}
              >
                Add
              </button>
            </div>
            
            <div className="collaborators-list">
              {collaborators.length > 0 ? (
                collaborators.map(collaborator => (
                  <div key={collaborator.id} className="collaborator-item">
                    <div className="collaborator-info">
                      <div className="collaborator-avatar">
                        {collaborator.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="collaborator-username">{collaborator.username}</div>
                    </div>
                    <div className="collaborator-actions">
                      <select
                        className="permission-select-small"
                        value={collaborator.permission}
                        onChange={(e) => handleChangePermission(collaborator.id, e.target.value)}
                      >
                        <option value="read">View only</option>
                        <option value="write">Can edit</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-collaborators">No collaborators added yet.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;