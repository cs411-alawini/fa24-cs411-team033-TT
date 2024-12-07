// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';


// const TodayOutfit = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [colors, setColors] = useState([]);
//   const [usages, setUsages] = useState([]);
//   const [inputColor, setInputColor] = useState('');
//   const [inputUsage, setInputUsage] = useState('');
//   const navigate = useNavigate();

//   const fetchWeatherData = async () => {
//     const apiUrl = `https://wttr.in/?format=j1`;

//     try {
//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setWeatherData(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
// const fetchRecommendationInputs = async () => {
//     try {
//         const userId = localStorage.getItem('UserId'); // Retrieve UserId
//           if (!userId) {
//               console.error("UserId is not available in localStorage.");
//               return;
//           }
//         const response = await axios.get(`http://localhost:5050/api/recommendationInputs?UserId=${userId}`);
//         const new_colors = response.data.map((item) => {
//             if (item.Color != 'None') return item.Color;
//         }).filter( item=> item !== undefined)
        
//         setColors(new_colors);
//         setInputColor(new_colors[0])
//         console.log(new_colors)

//         const new_usages = response.data.map((item) => {
//             if (item.Usages != 'None') return item.Usages;
//         }).filter( item=> item !== undefined)
//         setUsages(new_usages);
//         setInputUsage(new_usages[0])
//         console.log(new_usages)
//       } catch (error) {
//         console.error('Error fetching clothes colors:', error);
//       }
// }
//   useEffect(() => {
//     fetchWeatherData();
//   }, []);

//   useEffect( () => {
//     fetchRecommendationInputs();
//   }, []);

//   const handleOnColorChange = (value) => {
//     setInputColor(value)
//   }
//   const handleOnUsageChange = (value) => {
//     setInputUsage(value)
//   }

//   const handleLogout = () => {
//     navigate('/');
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="closet-container">
//       <h1>Today's Weather</h1>
//       {weatherData && (
//         <div>
//           <p><strong>Region:</strong> {weatherData.nearest_area[0].areaName[0].value}</p>
//           <p><strong>Temperature:</strong> {weatherData.current_condition[0].temp_C}°C</p>
//           <p><strong>Weather:</strong> {weatherData.current_condition[0].weatherDesc[0].value}</p>
//         </div>
//       )}
//       <span>
//       <label htmlFor="InputColor">Color</label>
//       <button className='dropdown-menu'>{inputColor}</button>
//       {
//         colors.map((item, i)=> 
//             <button key={i} className='dropdown-item'>{item}</button>
//         )
//       }
//       <label htmlFor="InputUsages">Usages</label>
//       <button className='dropdown-menu'>{inputUsage}</button>
//       {
//         usages.map((item, i)=> 
//             <button key={i} className='dropdown-item'>{item}</button>
//         )
//       }
//       </span>
      
//       <button className="logout-button" onClick={handleLogout}>Log Out</button>
//     </div>
//   );
// };

// export default TodayOutfit;




// import './styles/TodayOutfit.css';
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const TodayOutfit = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [colors, setColors] = useState([]);
//   const [usages, setUsages] = useState([]);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedUsages, setSelectedUsages] = useState([]);
//   const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
//   const [isUsageDropdownOpen, setIsUsageDropdownOpen] = useState(false);

//   const navigate = useNavigate();

//   const fetchWeatherData = async () => {
//     const apiUrl = `https://wttr.in/?format=j1`;
//     try {
//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setWeatherData(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecommendationInputs = async () => {
//     try {
//       const userId = localStorage.getItem("UserId"); // Retrieve UserId
//       if (!userId) {
//         console.error("UserId is not available in localStorage.");
//         return;
//       }
//       const response = await axios.get(
//         `http://localhost:5050/api/recommendationInputs?UserId=${userId}`
//       );
//       const new_colors = response.data
//         .map((item) => (item.Color !== "None" ? item.Color : null))
//         .filter((item) => item !== null);
//       const new_usages = response.data
//         .map((item) => (item.Usages !== "None" ? item.Usages : null))
//         .filter((item) => item !== null);

//       setColors(new_colors);
//       setUsages(new_usages);
//     } catch (error) {
//       console.error("Error fetching clothes colors:", error);
//     }
//   };

//   useEffect(() => {
//     fetchWeatherData();
//     fetchRecommendationInputs();
//   }, []);

//   const toggleColorDropdown = () => {
//     setIsColorDropdownOpen((prev) => !prev);
//   };

//   const toggleUsageDropdown = () => {
//     setIsUsageDropdownOpen((prev) => !prev);
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//     );
//   };

//   const handleUsageSelect = (usage) => {
//     setSelectedUsages((prev) =>
//       prev.includes(usage) ? prev.filter((u) => u !== usage) : [...prev, usage]
//     );
//   };

//   const handleLogout = () => {
//     navigate("/");
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="closet-container">
//       <h1>Today's Weather</h1>
//       {weatherData && (
//         <div>
//           <p>
//             <strong>Region:</strong>{" "}
//             {weatherData.nearest_area[0].areaName[0].value}
//           </p>
//           <p>
//             <strong>Temperature:</strong>{" "}
//             {weatherData.current_condition[0].temp_C}°C
//           </p>
//           <p>
//             <strong>Weather:</strong>{" "}
//             {weatherData.current_condition[0].weatherDesc[0].value}
//           </p>
//         </div>
//       )}

//       {/* Multi-Select Dropdown for Colors */}
//       <div className="dropdown">
//         <label>Colors</label>
//         <button onClick={toggleColorDropdown} className="dropdown-button">
//           {selectedColors.length > 0
//             ? `Selected: ${selectedColors.join(", ")}`
//             : "Select Colors"}
//         </button>
//         {isColorDropdownOpen && (
//           <div className="dropdown-menu">
//             {colors.map((color, index) => (
//               <div key={index} className="dropdown-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedColors.includes(color)}
//                   onChange={() => handleColorSelect(color)}
//                 />
//                 <label>{color}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Multi-Select Dropdown for Usages */}
//       <div className="dropdown">
//         <label>Usages</label>
//         <button onClick={toggleUsageDropdown} className="dropdown-button">
//           {selectedUsages.length > 0
//             ? `Selected: ${selectedUsages.join(", ")}`
//             : "Select Usages"}
//         </button>
//         {isUsageDropdownOpen && (
//           <div className="dropdown-menu">
//             {usages.map((usage, index) => (
//               <div key={index} className="dropdown-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedUsages.includes(usage)}
//                   onChange={() => handleUsageSelect(usage)}
//                 />
//                 <label>{usage}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <button className="logout-button" onClick={handleLogout}>
//         Log Out
//       </button>
//     </div>
//   );
// };

// export default TodayOutfit;




// import './styles/TodayOutfit.css';
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const TodayOutfit = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [colors, setColors] = useState([]);
//   const [usages, setUsages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedUsages, setSelectedUsages] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState([]);
//   const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
//   const [isUsageDropdownOpen, setIsUsageDropdownOpen] = useState(false);
//   const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

//   const navigate = useNavigate();

//   const fetchWeatherData = async () => {
//     const apiUrl = `https://wttr.in/?format=j1`;
//     try {
//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setWeatherData(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecommendationInputs = async () => {
//     try {
//       const userId = localStorage.getItem("UserId"); // Retrieve UserId
//       if (!userId) {
//         console.error("UserId is not available in localStorage.");
//         return;
//       }
//       const response = await axios.get(
//         `http://localhost:5050/api/recommendationInputs?UserId=${userId}`
//       );
//       const new_colors = response.data
//         .map((item) => (item.Color !== "None" ? item.Color : null))
//         .filter((item) => item !== null);
//       const new_usages = response.data
//         .map((item) => (item.Usages !== "None" ? item.Usages : null))
//         .filter((item) => item !== null);
//       const new_categories = response.data
//         .map((item) => (item.Category !== "None" ? item.Category : null))
//         .filter((item) => item !== null);

//       setColors(new_colors);
//       setUsages(new_usages);
//       setCategories(new_categories);
//     } catch (error) {
//       console.error("Error fetching clothes colors:", error);
//     }
//   };
  
//   useEffect(() => {
//     fetchWeatherData();
//     fetchRecommendationInputs();
//   }, []);


//   const toggleColorDropdown = () => {
//     setIsColorDropdownOpen((prev) => !prev);
//   };

//   const toggleUsageDropdown = () => {
//     setIsUsageDropdownOpen((prev) => !prev);
//   };

//   const toggleCategoryDropdown = () => {
//     setIsCategoryDropdownOpen((prev) => !prev);
//   };


//   const handleColorSelect = (color) => {
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//     );
//   };

//   const handleUsageSelect = (usage) => {
//     setSelectedUsages((prev) =>
//       prev.includes(usage) ? prev.filter((u) => u !== usage) : [...prev, usage]
//     );
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory((prev) =>
//       prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
//     );
//   };
  


//   const handleLogout = () => {
//     navigate("/");
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="closet-container">
//       <h1>Today's Weather</h1>
//       {weatherData && (
//         <div>
//           <p>
//             <strong>Region:</strong>{" "}
//             {weatherData.nearest_area[0].areaName[0].value}
//           </p>
//           <p>
//             <strong>Temperature:</strong>{" "}
//             {weatherData.current_condition[0].temp_C}°C
//           </p>
//           <p>
//             <strong>Weather:</strong>{" "}
//             {weatherData.current_condition[0].weatherDesc[0].value}
//           </p>
//         </div>
//       )}

//       {/* Multi-Select Dropdown for Colors */}
//       <div className="dropdown">
//         <label>Colors</label>
//         <button onClick={toggleColorDropdown} className="dropdown-button">
//           {selectedColors.length > 0
//             ? `Selected: ${selectedColors.join(", ")}`
//             : "Select Colors"}
//         </button>
//         {isColorDropdownOpen && (
//           <div className="dropdown-menu">
//             {colors.map((color, index) => (
//               <div key={index} className="dropdown-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedColors.includes(color)}
//                   onChange={() => handleColorSelect(color)}
//                 />
//                 <label>{color}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Multi-Select Dropdown for Usages */}
//       <div className="dropdown">
//         <label>Usages</label>
//         <button onClick={toggleUsageDropdown} className="dropdown-button">
//           {selectedUsages.length > 0
//             ? `Selected: ${selectedUsages.join(", ")}`
//             : "Select Usages"}
//         </button>
//         {isUsageDropdownOpen && (
//           <div className="dropdown-menu">
//             {usages.map((usage, index) => (
//               <div key={index} className="dropdown-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedUsages.includes(usage)}
//                   onChange={() => handleUsageSelect(usage)}
//                 />
//                 <label>{usage}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>


//       <div className="dropdown">
//         <label>Category</label>
//         <button onClick={toggleCategoryDropdown} className="dropdown-button">
//           {selectedCategory.length > 0
//             ? `Selected: ${selectedCategory.join(", ")}`
//             : "Select Category"}
//         </button>
//         {isCategoryDropdownOpen && (
//           <div className="dropdown-menu">
//             {categories.map((category, index) => (
//               <div key={index} className="dropdown-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedCategory.includes(category)}
//                   onChange={() => handleCategorySelect(category)}
//                 />
//                 <label>{category}</label>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <button className="logout-button" onClick={handleLogout}>
//         Log Out
//       </button>
//     </div>
//   );
// };

// export default TodayOutfit;



import './styles/TodayOutfit.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TodayOutfit = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState([]);
  const [usages, setUsages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState("");
  const [selectedUsages, setSelectedUsages] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isUsageDropdownOpen, setIsUsageDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [clothes, setClothes] = useState([]);

  const navigate = useNavigate();

  const fetchWeatherData = async () => {
    const apiUrl = `https://wttr.in/?format=j1`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendationInputs = async () => {
    try {
      const userId = localStorage.getItem("UserId"); // Retrieve UserId
      if (!userId) {
        console.error("UserId is not available in localStorage.");
        return;
      }
      const response = await axios.get(
        `http://localhost:5050/api/recommendationInputs?UserId=${userId}`
      );
      const new_colors = response.data
        .map((item) => (item.Color !== "None" ? item.Color : null))
        .filter((item) => item !== null);
      const new_usages = response.data
        .map((item) => (item.Usages !== "None" ? item.Usages : null))
        .filter((item) => item !== null);
      const new_categories = response.data
        .map((item) => (item.Category !== "None" ? item.Category : null))
        .filter((item) => item !== null);

      setColors(new_colors);
      setUsages(new_usages);
      setCategories(new_categories);
    } catch (error) {
      console.error("Error fetching recommendation inputs:", error);
    }
  };

  const handleClothesData = (data) => {
    const uniqueClothesMap = new Map();
  
    data.forEach(({ ClothId, ClothName, Image }) => {
      // Check if the ClothId is already in the Map
      if (!uniqueClothesMap.has(ClothId)) {
        uniqueClothesMap.set(ClothId, [ClothId, ClothName, Image]);
      }
    });
  
    // Convert the Map values to an array
    return Array.from(uniqueClothesMap.values());
  };

  const fetchClothes = async () => {
    try {
      const userId = localStorage.getItem("UserId");
      const currentTemperature =
        weatherData?.current_condition[0].temp_C || null;

      if (!userId) {
        console.error("UserId is not available in localStorage.");
        return;
      }

      const params = {
        UserId: userId,
        // Category: selectedCategory.join(","),
        // Color: selectedColors.join(","),
        // Usages: selectedUsages.join(","),
        Category: selectedCategory,
        Color: selectedColors, // Single string
        Usages: selectedUsages, // Single string
        CurrentTemperature: currentTemperature,
      };

      const response = await axios.get(
        "http://localhost:5050/api/recommendationResult",
        { params }
      );

      // setClothes(response.data);
      setClothes(handleClothesData(response.data));
      // console.log(clothes[0][2]);
      setShowDescription(true);
    } catch (error) {
      console.error("Error fetching clothes:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    fetchRecommendationInputs();
  }, []);

  const toggleColorDropdown = () => {
    setIsColorDropdownOpen((prev) => !prev);
  };

  const toggleUsageDropdown = () => {
    setIsUsageDropdownOpen((prev) => !prev);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen((prev) => !prev);
  };

  const handleColorSelect = (color) => {
    setSelectedColors(color);
    setIsColorDropdownOpen(false);
  };

  const handleUsageSelect = (usage) => {
    setSelectedUsages(usage);
    setIsUsageDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="closet-container">
      <h1>Today's Weather</h1>
      {weatherData && (
        <div>
          <p>
            <strong>Region:</strong>{" "}
            {weatherData.nearest_area[0].areaName[0].value}
          </p>
          <p>
            <strong>Temperature:</strong>{" "}
            {weatherData.current_condition[0].temp_C}°C
          </p>
          <p>
            <strong>Weather:</strong>{" "}
            {weatherData.current_condition[0].weatherDesc[0].value}
          </p>
        </div>
      )}

      {/* Multi-Select Dropdown for Colors
      <div className="dropdown">
        <label>Colors</label>
        <button onClick={toggleColorDropdown} className="dropdown-button">
          {selectedColors.length > 0
            ? `Selected: ${selectedColors.join(", ")}`
            : "Select Colors"}
        </button>
        {isColorDropdownOpen && (
          <div className="dropdown-menu">
            {colors.map((color, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorSelect(color)}
                />
                <label>{color}</label>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Single-Select Dropdown for Colors */}
      <div className="dropdown">
        <label>Colors</label>
        <button onClick={toggleColorDropdown} className="dropdown-button">
          {selectedColors ? `Selected: ${selectedColors}` : "Select a Color"}
        </button>
        {isColorDropdownOpen && (
          <div className="dropdown-menu">
            {colors.map((color, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="radio"
                  name="color"
                  checked={selectedColors === color}
                  onChange={() => handleColorSelect(color)}
                />
                <label>{color}</label>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Multi-Select Dropdown for Usages */}
      <div className="dropdown">
        <label>Usages</label>
        <button onClick={toggleUsageDropdown} className="dropdown-button">
          {selectedUsages ? `Selected: ${selectedUsages}` : "Select a Usage"}
        </button>
        {isUsageDropdownOpen && (
          <div className="dropdown-menu">
            {usages.map((usage, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="radio"
                  name="usage"
                  checked={selectedUsages.includes(usage)}
                  onChange={() => handleUsageSelect(usage)}
                />
                <label>{usage}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Multi-Select Dropdown for Categories */}
      <div className="dropdown">
        <label>Category</label>
        <button onClick={toggleCategoryDropdown} className="dropdown-button">
          {selectedCategory? `Selected: ${selectedCategory}` : "Select a Category"}
        </button>
        {isCategoryDropdownOpen && (
          <div className="dropdown-menu">
            {categories.map((category, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory.includes(category)}
                  onChange={() => handleCategorySelect(category)}
                />
                <label>{category}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="result-button" onClick={fetchClothes}>
        Show Results
      </button>
      
      <div className="clothes-gallery">
        {clothes.length > 0 ? (
          clothes.map((cloth, index) => (
            <div key={index} className="cloth-item">
              <img
                src={cloth[2]}
                alt={`Cloth ${cloth[1]}`}
                className="cloth-image"
              />
            </div>
          ))
        ) : (
          <p>No clothes found for the selected criteria.</p>
        )}
      </div>
      {showDescription && (
        <p className="recommendation-description">
          Our recommendation system ranks clothes using a scoring system based
          on user data and preferences, sorted from highest to lowest match for
          current conditions.
        </p>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default TodayOutfit;
