// src/AddItemModal.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/AddItemModal.css';

const AddItemModal = ({ isOpen, closeModal, onSave }) => {

  const [imageFile, setImageFile] = React.useState(null);

  useEffect(() => {
    // This will log the updated imageFile value whenever it changes
    if (imageFile) {
      console.log("Updated imageFile:", imageFile);
    }
  }, [imageFile]);

  if (!isOpen) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Create a FormData object to send text fields and the image file
    const formData = new FormData();
    formData.append("ClothName", event.target.ClothName.value);
    formData.append("Category", event.target.Category.value);
    formData.append("SubCategory", event.target.Subcategory.value);
    formData.append("Color", event.target.Color.value);
    formData.append("Usages", event.target.Usages.value);
    formData.append("TemperatureLevel", event.target.TemperatureLevel.value);
    formData.append("image", imageFile);

  
    try {
      // Make a POST request to your backend API endpoint
      const response = await axios.post('http://localhost:5050/api/clothes', {
        method: "POST",
        body: formData, // Pass the FormData directly
      });
  
      // Check if the response is successful
      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);
        onSave(result); // Pass the result (e.g., the uploaded item data) back to the parent component
        closeModal();
      } else {
        console.error("Upload failed:", response.statusText);
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred during the upload.");
    }
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
          <label>
            Temperature Level:
            <input type="text" name="TemperatureLevel" />
          </label>
          <div className="image-upload">
            <div className="image-placeholder">Add Image</div>
            <input type="file" name="image" accept="image/*" onChange={handleImageUpload}/>
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