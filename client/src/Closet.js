// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import './styles/Closet.css';
// import ItemModal from './components/ItemModal';
// import AddItemModal from './components/AddItemModal';
// import AddTagModal from './components/AddTagModal'; // Import AddTagModal
// import { useNavigate } from 'react-router-dom';

// const Closet = () => {
//   const [isAddModalOpen, setAddModalOpen] = useState(false);
//   const [isTagModalOpen, setTagModalOpen] = useState(false); // State for AddTagModal
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [filter, setFilter] = useState('All');
//   const gridSize = 35;

//   const [groups, setGroups] = useState([]); 
//   const [clothes, setClothes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchClothes = async () => {
//       try {
//         const userId = localStorage.getItem('UserId');
//         if (!userId) {
//           console.error("UserId is not available in localStorage.");
//           return;
//         }

//         const [clothesResponse, favGroupsResponse] = await Promise.all([
//           axios.get(`http://localhost:5050/api/clothes?UserId=${userId}`),
//           axios.get(`http://localhost:5050/api/favoriteGroups?UserId=${userId}`),
//         ]);

//         setClothes(clothesResponse.data);
//         setGroups(favGroupsResponse.data);
//       } catch (error) {
//         console.error("Error fetching clothes or favorite groups:", error);
//       }
//     };
//     fetchClothes();
//   }, []); 

//   // const filteredClothes = filter === 'All' ? clothes : clothes.filter(item => item.Category === filter);
//   const filteredClothes = filter === 'All'
//   ? clothes
//   : groups.some(group => group.GroupName === filter)
//   ? clothes.filter(item => item.FavoriteGroup === filter)
//   : clothes.filter(item => item.Category === filter);

//   const itemsToDisplay = filteredClothes.length >= gridSize
//     ? filteredClothes
//     : [...filteredClothes, ...Array.from({ length: gridSize - filteredClothes.length }, (_, index) => ({
//         ClothId: `placeholder-${index + 1}`,
//         ClothName: "",
//         Category: "",
//         Image: "",
//       }))];

//   const handleCellClick = (item) => {
//     setSelectedItem(item);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedItem(null);
//   };

//   const handleAddClick = () => {
//     setAddModalOpen(true);
//   };

//   const closeAddModal = () => {
//     setAddModalOpen(false);
//   };

//   const handleTagClick = () => {
//     setTagModalOpen(true); // Open the AddTagModal
//   };

//   const closeTagModal = () => {
//     setTagModalOpen(false);
//   };

//   const handleFilterClick = (category) => {
//     setFilter(category);
//   };
  
//   const handleLogout = () => {
//     navigate('/');
//   };

//   return (
//     <div className="closet-container">
//       {/* Search Section */}
//       <div className="search-bar">
//         <input type="text" placeholder="Search" />
//         <button className="search-button">🔍</button>
//         <button className="add-button" onClick={handleAddClick}>Add</button>
//         <button className="add-tag-button" onClick={handleTagClick}>Add Tags</button> {/* New Add Tags Button */}
//       </div>

//       {/* Filter Buttons */}
//       <div className="filter-buttons">
//         <button className={`filter-button ${filter === 'All' ? 'active' : ''}`} onClick={() => handleFilterClick('All')}>All</button>
//         <button className={`filter-button ${filter === 'Topwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Topwear')}>Top</button>
//         <button className={`filter-button ${filter === 'Bottomwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Bottomwear')}>Bottom</button>
//         <button className={`filter-button ${filter === 'Shoes' ? 'active' : ''}`} onClick={() => handleFilterClick('Shoes')}>Shoes</button>
//         <button className={`filter-button ${filter === 'Headwear' ? 'active' : ''}`} onClick={() => handleFilterClick('Headwear')}>Hats</button>
//         {/* Favorite Group Filters */}
//         {groups.map(group => (
//           <button
//             key={group.FavoriteId}
//             className={`filter-button ${filter === group.GroupName ? 'active' : ''}`}
//             onClick={() => handleFilterClick(group.GroupName)}
//           >
//             {group.GroupName}
//           </button>
//         ))}
      
//       </div>

//       {/* Closet Grid */}
//       <div className="closet-grid">
//         {itemsToDisplay.map((item) => (
//           <div key={item.ClothId} className="closet-item" onClick={() => handleCellClick(item)}>
//             <img src={item.Image} alt={item.ClothName} className="item-image" />
//             <span className="item-name">{item.ClothName}</span>
//           </div>
//         ))}
//         {isModalOpen && <ItemModal item={selectedItem} closeModal={closeModal} />}
//         {isAddModalOpen && <AddItemModal isOpen={isAddModalOpen} closeModal={closeAddModal} />}
//         {isTagModalOpen && <AddTagModal isOpen={isTagModalOpen} closeModal={closeTagModal} />} {/* AddTagModal */}
//       </div>
      
//       <button className="logout-button" onClick={handleLogout}>Log Out</button>
//     </div>
//   );
// };

// export default Closet;





import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/Closet.css';
import ItemModal from './components/ItemModal';
import AddItemModal from './components/AddItemModal';
import AddTagModal from './components/AddTagModal';
import DeleteTagModal from './components/DeleteTagModal'; // Import DeleteTagModal
import { useNavigate } from 'react-router-dom';

const Closet = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isTagModalOpen, setTagModalOpen] = useState(false);
  const [isDeleteTagModalOpen, setDeleteTagModalOpen] = useState(false); // State for DeleteTagModal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('All');
  const gridSize = 35;

  const [groups, setGroups] = useState([]);
  const [clothes, setClothes] = useState([]);
  // const [tags, setTags] = useState([]);
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
      } catch (error) {
        console.error("Error fetching clothes or favorite groups:", error);
      }
    };
    fetchClothes();
  }, []);




  const filteredClothes = filter === 'All' ? clothes : clothes.filter(item => item.Category === filter);
  // const clothesWithTags = clothes.map((item) => {
  //   const clothTags = tags
  //     .filter((tag) => tag.ClothId === item.ClothId)
  //     .map((tag) => tag.GroupName); // Extract group names

  //   return {
  //     ...item,
  //     FavoriteGroups: clothTags, // Add associated group names
  //   };
  // });

  // // Filter logic
  // const filteredClothes = filter === 'All'
  //   ? clothesWithTags
  //   : groups.some((group) => group.GroupName === filter)
  //   ? clothesWithTags.filter((item) => item.FavoriteGroups.includes(filter))
  //   : clothesWithTags.filter((item) => item.Category === filter);

  // const filteredClothes = clothes.filter(item =>
  //   (filter === 'All' || item.Category === filter || item.FavoriteGroup === filter) 
  // );

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
    setDeleteTagModalOpen(true); // Open the DeleteTagModal
  };

  const closeDeleteTagModal = () => {
    setDeleteTagModalOpen(false);
  };

  const handleFilterClick = (category) => {
    setFilter(category);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="closet-container">
      {/* Search Section */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button className="search-button">🔍</button>
        <button className="add-button" onClick={handleAddClick}>
          Add
        </button>
        <button className="add-tag-button" onClick={handleTagClick}>
          Add Tags
        </button>
        <button className="delete-tag-button" onClick={handleDeleteTagClick}>
          Delete Tags
        </button>
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
        {/* {groups.map((group) => (
          <button key={group.FavoriteId} onClick={() => handleFilterClick(group.GroupName)}>
            {group.GroupName}
          </button>
        ))} */}
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

      {/* Closet Grid */}
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
        {isDeleteTagModalOpen && <DeleteTagModal isOpen={isDeleteTagModalOpen} closeModal={closeDeleteTagModal} />} {/* DeleteTagModal */}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Closet;