import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ItemModal.css';

const ItemModal = ({ item, closeModal }) => {
  // Guard clause for invalid item
  

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ClothId: item.ClothId,
    UserId: item.UserId,
    ClothName: item.ClothName || '',
    Category: item.Category || '',
    Subcategory: item.Subcategory || '',
    Color: item.Color || '',
    Usages: item.Usages || '',
    Image: item.Image || '',
    TemperatureLevel: item.TemperatureLevel,
  });
  const [groups, setGroups] = useState([]); 
  const [itemGroups, setItemGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]); 
  const [includeData, setIncludeData] = useState([]);
  const [tags, setTags] = useState([]); 
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');


  useEffect(() => {
  
    const fetchTags = async () => {
      try {
        // const TagsResponse = await axios.get(`http://localhost:5050/api/tags`, {
        //   params: { ClothId: item.ClothId },
        // });

        const [TagsResponse, FavGroupsResponse] = await Promise.all([
          axios.get(`http://localhost:5050/api/tags?ClothId=${item.ClothId}`),
          axios.get(`http://localhost:5050/api/favoriteGroups?UserId=${item.UserId}`)
        ]);

        setTags(TagsResponse.data);  
        console.log(TagsResponse.data);

        setGroups(FavGroupsResponse.data);
        console.log('Favorite Groups:', FavGroupsResponse.data);
        const itemGroupIds = TagsResponse.data.map((tag) => tag.FavoriteId);
        setItemGroups(itemGroupIds);

      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchTags();
  }, []);

  const toggleGroupMembership = async (groupId) => {
    try {
      console.log('In toggleGroupMembership, groupId:', groupId);
  
      if (itemGroups.includes(groupId)) {
        // Use FormData for DELETE
        const formData = new FormData();
        formData.append('FavoriteId', groupId);
        formData.append('ClothId', item.ClothId);
  
        const response = await axios.delete('http://localhost:5050/api/include', {
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Delete Response:', response.data);
        setItemGroups((prev) => prev.filter((id) => id !== groupId));
      } else {
        // Use FormData for POST
        const formData = new FormData();
        formData.append('FavoriteId', groupId);
        formData.append('ClothId', item.ClothId);
  
        const response = await axios.post('http://localhost:5050/api/include', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Post Response:', response.data);
      
        setItemGroups((prev) => [...prev, groupId]);
      }
    } catch (error) {
      console.error('Error updating group membership:', error);
    }
  };
  const handleCreateGroup = async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const formData = new FormData();
    formData.append("UserId", item.UserId); // Add the UserId
    formData.append("GroupName", newGroupName.trim()); // Add the new group name
  
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      // Make a POST request to the backend API
      const response = await axios.post("http://localhost:5050/api/favoriteGroups", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("New group created:", response.data);
  
      // Update the local group list with the new group
      setGroups((prevGroups) => [
        ...prevGroups,
        { FavoriteId: response.data.FavoriteId, GroupName: newGroupName },
      ]);
  
      // Clear input and close modal
      setShowCreateGroup(false);
      setNewGroupName(""); // Clear the input
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create a new group. Please try again.");
    }
  };
  const handleGroupClick = (groupName) => {
    setSelectedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]
    );
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put('http://localhost:5050/api/clothes', null, {
        params: formData,
      });

      console.log(response.data.message);
      alert(response.data.message); // Show success message
      setIsEditing(false); // Exit edit mode
      window.location.reload(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error updating item:', error);
      alert('An error occurred while updating the item.');
    }
  };

  const handleDelete = async () => {
    try {
      // Send a DELETE request to the backend
      const response = await axios.delete('http://localhost:5050/api/clothes', {
        params: { ClothId: item.ClothId }
      });

      console.log(response.data.message);
      alert(response.data.message); // Optional: Show a success message
      closeModal(); // Close the modal after deletion
      window.location.reload(); // Refresh the page to update the list
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('An error occurred while deleting the item.');
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <div className="modal-body">
          <div className="details-section">
            {isEditing ? (
              <>
                <div className="display-field">
                  <label>Name:</label>
                  <input type="text" name="ClothName" value={formData.ClothName} onChange={handleChange} />
                </div>
                <div className="display-field">
                  <label>Category:</label>
                  <input type="text" name="Category" value={formData.Category} onChange={handleChange} />
                </div>
                <div className="display-field">
                  <label>Subcategory:</label>
                  <input type="text" name="Subcategory" value={formData.Subcategory} onChange={handleChange} />
                </div>
                <div className="display-field">
                  <label>Color:</label>
                  <input type="text" name="Color" value={formData.Color} onChange={handleChange} />
                </div>
                <div className="display-field">
                  <label>Usages:</label>
                  <input type="text" name="Usages" value={formData.Usages} onChange={handleChange} />
                </div>
                <div className="display-field">
                  <label>
                    Temperature Level (Min-Max):
                    <select
                      name="TemperatureLevel"
                      value={formData.TemperatureLevel}
                      onChange={handleChange}
                    >
                      <option value="0">45 - 85 F (Spring)</option>
                      <option value="1">70 - 100 F (Summer)</option>
                      <option value="2">40 - 70 F (Fall)</option>
                      <option value="3">0 - 60 F (Winter)</option>
                    </select>
                  </label>
                  {/* <label>Temperature Level:</label>
                  <input type="text" name="TemperatureLevel" value={formData.TemperatureLevel} onChange={handleChange} /> */}
                </div>
              </>
            ) : (
              <>
                <div className="display-field">
                  <label>Name:</label>
                  <span>{item.ClothName || 'N/A'}</span>
                </div>
                <div className="display-field">
                  <label>Category:</label>
                  <span>{item.Category || 'N/A'}</span>
                </div>
                <div className="display-field">
                  <label>Subcategory:</label>
                  <span>{item.Subcategory || 'N/A'}</span>
                </div>
                <div className="display-field">
                  <label>Color:</label>
                  <span>{item.Color || 'N/A'}</span>
                </div>
                <div className="display-field">
                  <label>Usages:</label>
                  <span>{item.Usages || 'N/A'}</span>
                </div>
                <div className="display-field">
                  <label>Temperature Min:</label>
                  <span>{item.TemperatureMin}</span>
                </div>
                <div className="display-field">
                  <label>Temperature Max:</label>
                  <span>{item.TemperatureMax}</span>
                </div>
              
                <div className="display-field">
                  <label>Tags:</label>
                  <p>
                    {tags.length > 0
                      ? tags.map((tag) => tag.GroupName || 'Unnamed Group').join(', ')
                      : 'No tags associated'}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="image-section">
            {item.Image ? (
              <img src={item.Image} alt={item.ClothName} className="display-image" />
            ) : (
              <div className="image-placeholder">{item.ClothName}</div>
            )}
          </div>
        </div>
       
        <div className="tags-section">
          {isEditing && (
            <>
              {groups.length > 0 ? (
                groups.map((group) => {
                  const isInGroup = itemGroups.includes(group.FavoriteId);

                  return (
                    <button
                      key={group.FavoriteId}
                      className={`tag-button ${isInGroup ? 'in-group' : ''}`}
                      onClick={() => toggleGroupMembership(group.FavoriteId)}
                    >
                      {group.GroupName || 'Unnamed Group'}
                    </button>
                  );
                })
              ) : (
                <p className="no-groups">No groups found.</p>
              )}
            </>
          )}
        </div>
       
         
        
    


        <div className="modal-actions">
          {isEditing ? (
            <button type="button" className="save-button" onClick={handleSubmit}>Save</button>
          ) : (
            <button type="button" className="edit-button" onClick={handleEditToggle}>Edit</button>
          )}
          <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;


// ============================================================================


