// src/Closet.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/Closet.css';
import ItemModal from './components/ItemModal';
import AddItemModal from './components/AddItemModal';
import api from './api'
import logo from "./logo.png";

const Closet = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('All');
  const gridSize = 35;

  const userId = 0;

  const [clothes, setClothes] = useState([]);
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/clothes?UserId=1');
        console.log(response.data);
        setClothes(response.data); // Assuming response.data contains the array of clothes
      } catch (error) {
        console.error("Error fetching clothes:", error);
      }
    };
    fetchClothes();
  }, []); 

  const filteredClothes = filter === 'All' ? clothes : clothes.filter(item => item.Category === filter);

  // let itemsToDisplay;
  const itemsToDisplay = filteredClothes.length >= gridSize
  ? filteredClothes
  : [...filteredClothes, ...Array.from({ length: gridSize - filteredClothes.length }, (_, index) => ({
      ClothId: `placeholder-${index + 1}`,
      ClothName: "",
      Category: "",
      Image: "",
    }))];

  // if (filteredClothes.length >= gridSize) {
  //   itemsToDisplay = filteredClothes;
  // } else {
  //   const emptyGridItems = Array.from({ length: gridSize - filteredClothes.length }, (_, index) => ({
  //     ClothId: filteredClothes.length + index + 1,
  //     ClothName: "",
  //     Category: "",
  //     Image: "",
  //   }));
  //   itemsToDisplay = [...filteredClothes, ...emptyGridItems];
  // }


  // if (clothes.length >= gridSize) {
  //   // If there are 35 or more items, just display clothes
  //   itemsToDisplay = clothes;
  // } else {
  //   // If there are fewer than 35 items, add placeholders
  //   const emptyGridItems = Array.from({ length: gridSize - clothes.length }, (_, index) => ({
  //     id: clothes.length + index + 1,
  //     name: "",
  //     image: "",
  //     tag: ""
  //   }));
  //   itemsToDisplay = [...clothes, ...emptyGridItems];
  // }

  const handleCellClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleFilterClick = (category) => {
    setFilter(category);
  };


  return (
    <div className="closet-container">

      {/* Search Section */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button className="search-button">🔍</button>
        <button className="add-button" onClick={handleAddClick}>Add</button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button className={`filter-button ${filter === 'All' ? 'active' : ''}`} onClick={() => handleFilterClick('All')}>All</button>
        <button className={`filter-button ${filter === 'Topwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Topwear')}>Top</button>
        <button className={`filter-button ${filter === 'Bottomwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Bottomwear')}>Bottom</button>
        <button className={`filter-button ${filter === 'Shoes' ? 'active' : ''}`} onClick={() => handleFilterClick('Shoes')}>Shoes</button>

        <button className={`filter-button ${filter === 'Headwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Headwear')}>Hats</button>
      </div>

      {/* Closet Grid */}
      <div className="closet-grid">
        {itemsToDisplay.map((item) => (
          <div key={item.ClothId} className="closet-item" onClick={() => handleCellClick(item)}>
            <img src={item.Image} alt={item.ClothName} className="item-image" />
            <span className="item-name">{item.ClothName}</span>
          </div>
        ))}
        {isModalOpen && <ItemModal item={selectedItem} closeModal={closeModal} />}
        {isAddModalOpen && <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal}/>}
      </div>
    </div>
  );
};

export default Closet;
