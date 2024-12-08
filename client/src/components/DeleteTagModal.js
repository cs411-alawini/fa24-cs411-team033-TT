import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/DeleteTagModal.css';

const DeleteTagModal = ({ isOpen, closeModal }) => {
  const [tags, setTags] = useState([]); // Store fetched tags
  const [selectedTag, setSelectedTag] = useState(''); // Store selected tag

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const userId = localStorage.getItem('UserId');
        if (!userId) {
          alert("UserId not found. Please log in.");
          return;
        }

        const response = await axios.get(`http://localhost:5050/api/favoriteGroups?UserId=${userId}`);
        setTags(response.data); // Save fetched tags to state
      } catch (error) {
        console.error('Error fetching tags:', error);
        alert('Failed to fetch tags.');
      }
    };

    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]); // Fetch tags only when the modal is opened

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('FavoriteId', selectedTag);

      const response = await axios.delete('http://localhost:5050/api/favoriteGroups', {
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);

      alert('Tag deleted successfully!');
      setSelectedTag('');
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Failed to delete tag.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delete Tag</h2>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">Select a Tag</option>
          {tags.map((tag) => (
            <option key={tag.FavoriteId} value={tag.FavoriteId}>
              {tag.GroupName} (ID: {tag.FavoriteId})
            </option>
          ))}
        </select>
        <button onClick={handleSubmit} disabled={!selectedTag} className="edit-button">
          Delete
        </button>
        <button onClick={closeModal} className="edit-button">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteTagModal;