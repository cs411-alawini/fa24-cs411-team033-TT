// import React from 'react';
// import './styles/ItemModal.css';

// const ItemModal = ({ item, closeModal }) => {
//   if (!item) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="close-button" onClick={closeModal}>×</button>
//         <div className="modal-display">
//           <div className="display-field">
//             <strong>Name:</strong> {item.ClothName || 'N/A'}
//           </div>
//           <div className="display-field">
//             <strong>Category:</strong> {item.Category || 'N/A'}
//           </div>
//           <div className="display-field">
//             <strong>Sub Category:</strong> {item.subCategory || 'N/A'}
//           </div>
//           <div className="display-field">
//             <strong>Color:</strong> {item.Color || 'N/A'}
//           </div>
//           <div className="display-field">
//             <strong>Temperature Min:</strong> {item.TemperatureMin || 'N/A'}
//           </div>
//           <div className="display-field">
//             <strong>Temperature Max:</strong> {item.TemperatureMax || 'N/A'}
//           </div>
//           <div className="display-field">
//             <strong>Usage:</strong> {item.Usage || 'N/A'}
//           </div>
//           <div className="image-upload">
//             <div className="image-placeholder">Add Image</div>
//           </div>
//           <button type="button" className="delete-button">Delete</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemModal;

import React from 'react';
import './styles/ItemModal.css';

const ItemModal = ({ item, closeModal }) => {
  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <div className="modal-body">
          <div className="details-section">
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
              <label>TemperatureMin:</label>
              <span>{item.TemperatureMin || 'N/A'}</span>
            </div>
            <div className="display-field">
              <label>TemperatureMax:</label>
              <span>{item.TemperatureMax || 'N/A'}</span>
            </div>
            <div className="display-field">
              <label>Usages:</label>
              <span>{item.Usages || 'N/A'}</span>
            </div>
          </div>
          <div className="image-section">
            {item.Image ? (
              <img src={item.Image} alt={item.ClothName} className="display-image" />
              // <div className="image-placeholder">{item.Image}</div>
            ) : (
              <div className="image-placeholder">{item.ClothName}</div>
            )}
          </div>
        </div>
        <div className="tags-section">
          <button className="tag-button">tag 1</button>
          <button className="tag-button">tag 2</button>
          <button className="tag-button">tag 3</button>
          <button className="create-tag-button">Create Tag</button>
        </div>
        <button type="button" className="delete-button">Delete</button>
      </div>
    </div>
  );
};

export default ItemModal;