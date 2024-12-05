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
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedUsages, setSelectedUsages] = useState([]);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isUsageDropdownOpen, setIsUsageDropdownOpen] = useState(false);

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

      setColors(new_colors);
      setUsages(new_usages);
    } catch (error) {
      console.error("Error fetching clothes colors:", error);
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

  const handleColorSelect = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleUsageSelect = (usage) => {
    setSelectedUsages((prev) =>
      prev.includes(usage) ? prev.filter((u) => u !== usage) : [...prev, usage]
    );
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

      {/* Multi-Select Dropdown for Colors */}
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
      </div>

      {/* Multi-Select Dropdown for Usages */}
      <div className="dropdown">
        <label>Usages</label>
        <button onClick={toggleUsageDropdown} className="dropdown-button">
          {selectedUsages.length > 0
            ? `Selected: ${selectedUsages.join(", ")}`
            : "Select Usages"}
        </button>
        {isUsageDropdownOpen && (
          <div className="dropdown-menu">
            {usages.map((usage, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedUsages.includes(usage)}
                  onChange={() => handleUsageSelect(usage)}
                />
                <label>{usage}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default TodayOutfit;
