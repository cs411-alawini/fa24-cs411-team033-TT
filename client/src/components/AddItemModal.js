// src/AddItemModal.js
import React from 'react';
import './styles/AddItemModal.css';

const AddItemModal = ({ isOpen, closeModal, onSave }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const newItem = {
      name: event.target.name.value,
      category: event.target.category.value,
      subCategory: event.target.subCategory.value,
      color: event.target.color.value,
      season: event.target.season.value,
      usage: event.target.usage.value,
    };
    onSave(newItem);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>×</button>
        <form onSubmit={handleSubmit} className="add-item-form">
          <label>
            Name:
            <input type="text" name="ClothName" required />
          </label>
          <label>
            Category:
            <input type="text" name="Category" />
          </label>
          <label>
            Sub Category:
            <input type="text" name="Subcategory" />
          </label>
          <label>
            Color:
            <input type="text" name="Color" />
          </label>
          <label>
            Usages:
            <input type="text" name="Usages" />
          </label>
          <div className="image-upload">
            <div className="image-placeholder">Add Image</div>
          </div>
          <div className="tags-section">
            <button type="button" className="tag-button">tag 1</button>
            <button type="button" className="tag-button">tag 2</button>
            <button type="button" className="tag-button">tag 3</button>
            <button type="button" className="create-tag-button">Create Tag</button>
          </div>
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="delete-button">Delete</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;