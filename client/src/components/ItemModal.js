// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './styles/ItemModal.css';

// const ItemModal = ({ item, closeModal }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     ClothId: item.ClothId,
//     UserId: item.UserId,
//     ClothName: item.ClothName || '',
//     Category: item.Category || '',
//     Subcategory: item.Subcategory || '',
//     Color: item.Color || '',
//     Usages: item.Usages || '',
//     Image: item.Image || '',
//     TemperatureLevel: item.TemperatureLevel || '',
//   });
//   const [groups, setGroups] = useState([]); 
//   const [selectedGroups, setSelectedGroups] = useState([]); 
//   const [includeData, setIncludeData] = useState([]);


//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const groupResponse = await axios.get(`http://localhost:5050/api/favoriteGroups`, {
//           params: { UserId: item.UserId },
//         });
//         setGroups(groupResponse.data);
//         // const favoriteIds = groupResponse.data.map((group) => group.FavoriteId);
//         // console.log('Fetched FavoriteIds:', favoriteIds);

       
//         const includeResponse = await axios.get(`http://localhost:5050/api/include`, {
//           params: { FavoriteId: 1}, 
//         });
//         console.log('Fetched Include Data:', includeResponse.data);
//         setIncludeData(Array.isArray(includeResponse.data) ? includeResponse.data : []);


//       } catch (error) {
//         console.error('Error fetching groups:', error);
//       }
//     };
//     fetchGroups();
//   }, [item.UserId]);

//   const handleGroupClick = (groupName) => {
//     setSelectedGroups((prev) =>
//       prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]
//     );
//   };

//   const handleEditToggle = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.put('http://localhost:5050/api/clothes', null, {
//         params: formData,
//       });

//       console.log(response.data.message);
//       alert(response.data.message); // Show success message
//       setIsEditing(false); // Exit edit mode
//       window.location.reload(); // Refresh the page to show updated data
//     } catch (error) {
//       console.error('Error updating item:', error);
//       alert('An error occurred while updating the item.');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       // Send a DELETE request to the backend
//       const response = await axios.delete('http://localhost:5050/api/clothes', {
//         params: { ClothId: item.ClothId }
//       });

//       console.log(response.data.message);
//       alert(response.data.message); // Optional: Show a success message
//       closeModal(); // Close the modal after deletion
//       window.location.reload(); // Refresh the page to update the list
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       alert('An error occurred while deleting the item.');
//     }
//   };


//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="close-button" onClick={closeModal}>×</button>
//         <div className="modal-body">
//           <div className="details-section">
//             {isEditing ? (
//               <>
//                 <div className="display-field">
//                   <label>Name:</label>
//                   <input type="text" name="ClothName" value={formData.ClothName} onChange={handleChange} />
//                 </div>
//                 <div className="display-field">
//                   <label>Category:</label>
//                   <input type="text" name="Category" value={formData.Category} onChange={handleChange} />
//                 </div>
//                 <div className="display-field">
//                   <label>Subcategory:</label>
//                   <input type="text" name="Subcategory" value={formData.Subcategory} onChange={handleChange} />
//                 </div>
//                 <div className="display-field">
//                   <label>Color:</label>
//                   <input type="text" name="Color" value={formData.Color} onChange={handleChange} />
//                 </div>
//                 <div className="display-field">
//                   <label>Usages:</label>
//                   <input type="text" name="Usages" value={formData.Usages} onChange={handleChange} />
//                 </div>
//                 <div className="display-field">
//                   <label>Temperature Level:</label>
//                   <input type="text" name="TemperatureLevel" value={formData.TemperatureLevel} onChange={handleChange} />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="display-field">
//                   <label>Name:</label>
//                   <span>{item.ClothName || 'N/A'}</span>
//                 </div>
//                 <div className="display-field">
//                   <label>Category:</label>
//                   <span>{item.Category || 'N/A'}</span>
//                 </div>
//                 <div className="display-field">
//                   <label>Subcategory:</label>
//                   <span>{item.Subcategory || 'N/A'}</span>
//                 </div>
//                 <div className="display-field">
//                   <label>Color:</label>
//                   <span>{item.Color || 'N/A'}</span>
//                 </div>
//                 <div className="display-field">
//                   <label>Usages:</label>
//                   <span>{item.Usages || 'N/A'}</span>
//                 </div>
//                 <div className="display-field">
//                   <label>Temperature Level:</label>
//                   <span>{item.TemperatureLevel}</span>
//                 </div>
//                 <div className="display-field">
//                   <label>In Favorite Group:</label>
//                   <span>
//                     {Array.isArray(includeData) && includeData.some((include) => include.ClothId === item.ClothId)
//                       ? 'Yes'
//                       : 'No'}
//                   </span>
//                 </div>
//               </>
//             )}
//           </div>
//           <div className="image-section">
//             {item.Image ? (
//               <img src={item.Image} alt={item.ClothName} className="display-image" />
//             ) : (
//               <div className="image-placeholder">{item.ClothName}</div>
//             )}
//           </div>
//         </div>
//         {/* <div className="tags-section">
//           <button className="tag-button">tag 1</button>
//           <button className="tag-button">tag 2</button>
//           <button className="tag-button">tag 3</button>
//           <button className="create-tag-button">Create Tag</button>
//         </div> */}
        
//        <div className="tags-section">
//           {groups.map((group) => {
//             const isInGroup = Array.isArray(includeData)
//               ? includeData.some((include) => include.FavoriteId === group.FavoriteId)
//               : false;
//             return (
//               <button
//                 key={group.FavoriteId}
//                 className={`tag-button ${isInGroup ? 'in-group' : ''}`}
//                 onClick={() => handleGroupClick(group.GroupName)}
//               >
//                 {group.GroupName}
//               </button>
//             );
//           })}
//         </div>
    


//         <div className="modal-actions">
//           {isEditing ? (
//             <button type="button" className="save-button" onClick={handleSubmit}>Save</button>
//           ) : (
//             <button type="button" className="edit-button" onClick={handleEditToggle}>Edit</button>
//           )}
//           <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemModal;

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
    TemperatureLevel: item.TemperatureLevel || '',
  });
  const [groups, setGroups] = useState([]); // Favorite groups
  const [includeData, setIncludeData] = useState([]); // Include table data

  // Fetch groups and include data
  useEffect(() => {
    const fetchGroupsAndIncludes = async () => {
      try {
        // Fetch favorite groups
        const groupResponse = await axios.get(`http://localhost:5050/api/favoriteGroups`, {
          params: { UserId: item.UserId },
        });
        setGroups(Array.isArray(groupResponse.data) ? groupResponse.data : []);
        console.log('Fetched Groups:', groupResponse.data);

        // Fetch include data for the user's favorite groups
        const includeResponse = await axios.get(`http://localhost:5050/api/include`, {
          params: { FavoriteId: 1 },
        });
        setIncludeData(Array.isArray(includeResponse.data) ? includeResponse.data : []);
        console.log('Fetched Include Data:', includeResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setGroups([]); // Fallback to empty array
        setIncludeData([]); // Fallback to empty array
      }
    };

    fetchGroupsAndIncludes();
  }, [item.UserId]);

  if (!item) return null;

  // Event handlers
  const handleGroupClick = (groupName) => {
    console.log(`Group clicked: ${groupName}`);
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
                  <label>Temperature Level:</label>
                  <input type="text" name="TemperatureLevel" value={formData.TemperatureLevel} onChange={handleChange} />
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
                  <label>Temperature Level:</label>
                  <span>{item.TemperatureLevel}</span>
                </div>
                <div className="display-field">
                  <label>In Favorite Group:</label>
                  <span>
                    {Array.isArray(includeData) &&
                    includeData.some((include) => include.ClothId === item.ClothId)
                      ? 'Yes'
                      : 'No'}
                  </span>
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
          {Array.isArray(groups) &&
            groups.map((group) => {
              const isInGroup = Array.isArray(includeData)
                ? includeData.some((include) => include.FavoriteId === group.FavoriteId)
                : false;
              return (
                <button
                  key={group.FavoriteId}
                  className={`tag-button ${isInGroup ? 'in-group' : ''}`}
                  onClick={() => handleGroupClick(group.GroupName)}
                >
                  {group.GroupName}
                </button>
              );
            })}
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
