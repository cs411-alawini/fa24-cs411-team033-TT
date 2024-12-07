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
    const userId = localStorage.getItem('UserId');
    if (!userId) {
      alert("UserId not found. Please log in.");
      return;
    }

    const clothName = event.target.ClothName.value;
    const category = event.target.Category.value;
    const subCategory = event.target.Subcategory.value;
    const color = event.target.Color.value;
    const usages = event.target.Usages.value;
    const temperatureLevel = event.target.TemperatureLevel.value;

    // Validate form inputs
    if (!clothName || !category || !subCategory || !color || !usages || !temperatureLevel || !imageFile) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("ClothName", clothName);
    formData.append("Category", category);
    formData.append("SubCategory", subCategory);
    formData.append("Color", color);
    formData.append("Usages", usages);
    formData.append("TemperatureLevel", temperatureLevel);
    formData.append("Image", imageFile);

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Make a POST request to your backend API endpoint
      const response = await axios.post('http://localhost:5050/api/clothes', formData, {
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      });

      console.log("Upload successful:", response.data);

      // Pass the result (e.g., the uploaded item data) back to the parent component
      // onSave(response.data);
      window.location.reload();
      closeModal();
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
          <button type="submit" className="save-button">Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;