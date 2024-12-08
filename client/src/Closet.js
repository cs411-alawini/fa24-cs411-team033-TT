import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/Closet.css';
import ItemModal from './components/ItemModal';
import AddItemModal from './components/AddItemModal';
import AddTagModal from './components/AddTagModal';
import DeleteTagModal from './components/DeleteTagModal';
import { useNavigate } from 'react-router-dom';


const Closet = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isTagModalOpen, setTagModalOpen] = useState(false);
  const [isDeleteTagModalOpen, setDeleteTagModalOpen] = useState(false); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('All');
  const gridSize = 1;
  
  const [groups, setGroups] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchFilter, setSearchFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const userId = localStorage.getItem('UserId');
        if (!userId) {
          console.error("UserId is not available in localStorage.");
          return;
        }

        const [clothesResponse, favGroupsResponse] = await Promise.all([
          axios.get(`http://localhost:5050/api/clothes?UserId=${userId}`),
          axios.get(`http://localhost:5050/api/favoriteGroups?UserId=${userId}`),
        ]);

        console.log(clothesResponse);
        console.log(favGroupsResponse);
        
        setClothes(clothesResponse.data);
        setGroups(favGroupsResponse.data);

        const tagPromises = clothesResponse.data.map(item =>
          axios.get(`http://localhost:5050/api/tags?ClothId=${item.ClothId}`)
        );
        const tagResponses = await Promise.all(tagPromises);
        console.log("tagResponses", tagResponses);
        const allTags = tagResponses.flatMap(res => res.data);
        setTags(allTags);


      } catch (error) {
        console.error("Error fetching clothes or favorite groups:", error);
      }
    };
    fetchClothes();
  }, []);


  
  const filteredClothes = clothes.filter((item) => {
    const matchesCategoryOrGroup =
      filter === 'All' || 
      item.Category === filter || 
      tags.some(tag => tag.ClothId === item.ClothId && tag.GroupName === filter);
  
    const matchesSearch = searchFilter === '' || 
      item.ClothName.toLowerCase().includes(searchFilter.toLowerCase());
  
    return matchesCategoryOrGroup && matchesSearch;
  });
  


  const itemsToDisplay =
    filteredClothes.length >= gridSize
      ? filteredClothes
      : [
          ...filteredClothes,
          ...Array.from({ length: gridSize - filteredClothes.length }, (_, index) => ({
            ClothId: `placeholder-${index + 1}`,
            ClothName: '',
            Category: '',
            Image: '',
          })),
        ];

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

  const handleTagClick = () => {
    setTagModalOpen(true);
  };

  const closeTagModal = () => {
    setTagModalOpen(false);
  };

  const handleDeleteTagClick = () => {
    setDeleteTagModalOpen(true);
  };

  const closeDeleteTagModal = () => {
    setDeleteTagModalOpen(false);
  };

  const handleFilterClick = (category) => {
    setFilter(category);
  };

  const handleSearchInput = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="closet-container">
      {/* Search Section */}
      <div className="search-bar">
        <input type="text" onChange={handleSearchInput} value={searchFilter} placeholder="Search by name" />
        {/* <button className="search-button">🔍</button> */}
        
        <button className="add-button" onClick={handleAddClick}>
          Add
        </button>
        <button className="add-tag-button" onClick={handleTagClick}>Add Tags</button>
        <button className="delete-tag-button" onClick={handleDeleteTagClick}>Delete Tags</button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button className={`filter-button ${filter === 'All' ? 'active' : ''}`} onClick={() => handleFilterClick('All')}>
          All
        </button>
        <button
          className={`filter-button ${filter === 'Topwear' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Topwear')}
        >
          Top
        </button>
        <button
          className={`filter-button ${filter === 'Bottomwear' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Bottomwear')}
        >
          Bottom
        </button>
        <button
          className={`filter-button ${filter === 'Shoes' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Shoes')}
        >
          Shoes
        </button>
        <button
          className={`filter-button ${filter === 'Headwear' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Headwear')}
        >
          Hats
        </button>

        {groups.map(group => (
          <button
            key={group.FavoriteId}
            className={`filter-button ${filter === group.GroupName ? 'active' : ''}`}
            onClick={() => handleFilterClick(group.GroupName)}
          >
            {group.GroupName}
          </button>
        ))}
      </div>


      <div className="closet-grid">
      {itemsToDisplay.map((item) => (
        <div key={item.ClothId} className="closet-item" onClick={() => handleCellClick(item)}>
          <img src={item.Image} alt={item.ClothName} className="item-image" />
          <span className="item-name">{item.ClothName}</span>
        </div>
      ))}
      {isModalOpen && <ItemModal item={selectedItem} closeModal={closeModal} />}
      {isAddModalOpen && <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} />}
      {isTagModalOpen && <AddTagModal isOpen={isTagModalOpen} closeModal={closeTagModal} />}
      {isDeleteTagModalOpen && <DeleteTagModal isOpen={isDeleteTagModalOpen} closeModal={closeDeleteTagModal} />}
      </div>


      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>


  );
};

export default Closet;