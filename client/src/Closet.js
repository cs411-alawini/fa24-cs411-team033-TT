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

  // const clothes = [
  //   { ClothId: 1, ClothName: "T-Shirt", Category: "Topwear", Subcategory:"shirt", Color:"green", Usages:"sports",Image: "/mockup_img/shirt.jpg", TemperatureMin:"20", TemperatureMax:"30"},
  //   { ClothId: 2, ClothName: "Sport Pants", Category: "Bottom", Subcategory:"pants", Color:"gray", Usages:"sports",Image: "/mockup_img/pants.jpg", TemperatureMin:"10", TemperatureMax:"20"},
    // { id: 2, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 3, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 4, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 5, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 6, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 7, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 8, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 9, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 10, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 11, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 12, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 13, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 14, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 15, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 16, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 17, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 18, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 19, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 20, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 21, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 22, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 23, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 24, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 25, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 26, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 27, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 28, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 29, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 30, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 31, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 32, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 33, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 34, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 35, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 36, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 37, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
    // { id: 38, name: "Jeans", image: "/mockup_img/pants.jpg", tag: "Casual" },
    // { id: 39, name: "Jacket", image: "/mockup_img/shirt.jpg", tag: "Winter" },
    // { id: 40, name: "T-Shirt", image: "/mockup_img/shirt.jpg", tag: "Summer" },
  // ];

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
        <button className={`filter-button ${filter === 'Topwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Topwear')}>Topwear</button>
        <button className={`filter-button ${filter === 'Bottom' ? 'active' : ''}`} onClick={() => handleFilterClick('Bottom')}>Bottom</button>
        <button className={`filter-button ${filter === 'Accessory' ? 'active' : ''}`} onClick={() => handleFilterClick('Accessory')}>Accessory</button>
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
