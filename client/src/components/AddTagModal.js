import React, { useState } from 'react';
import axios from 'axios';
import './styles/AddTagModal.css';

const AddTagModal = ({ isOpen, closeModal }) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('UserId');
      if (!userId) {
        alert("UserId not found. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append('GroupName', groupName);

      const response = await axios.post(`http://localhost:5050/api/favoriteGroups?UserId=${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);

      alert("Tag added successfully!");
      setGroupName('');
      closeModal();

      // Refresh the page after successful API call
      window.location.reload();
    } catch (error) {
      console.error("Error adding tag:", error);
      alert("Failed to add tag.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Tag</h2>
        <input
          type="text"
          placeholder="Enter Tag Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={handleSubmit} className="edit-button">Submit</button>
        <button onClick={closeModal} className="edit-button">Cancel</button>
      </div>
    </div>
  );
};

export default AddTagModal;