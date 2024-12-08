import './styles/TodayOutfit.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";


ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

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
  const [colorFrequencyData, setColorFrequencyData] = useState(null);
  const [intervalDays, setIntervalDays] = useState(30);
  const [showChart, setShowChart] = useState(false);
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



  // const fetchRecommendationAndFreq = async () => {
  //   try {
  //     const userId = localStorage.getItem("UserId"); // Retrieve UserId
  //     // const intervalDays = 30; // Example: Last 30 days, adjust as needed

  //     if (!userId) {
  //       console.error("UserId is not available in localStorage.");
  //       return;
  //     }
  //     const [recommendationResponse, colorFrequencyResponse] = await Promise.all([
  //       axios.get(`http://localhost:5050/api/recommendationInputs?UserId=${userId}`),
  //       axios.get(`http://localhost:5050/api/colorfrequency?UserId=${userId}&IntervalDays=${intervalDays}`),
  //     ]);

  //     // Handle Recommendation Inputs Response
  //     const recommendationData = recommendationResponse.data;
  //     const new_colors = recommendationData
  //       .map((item) => (item.Color !== "None" ? item.Color : null))
  //       .filter((item) => item !== null);
  //     const new_usages = recommendationData
  //       .map((item) => (item.Usages !== "None" ? item.Usages : null))
  //       .filter((item) => item !== null);
  //     const new_categories = recommendationData
  //       .map((item) => (item.Category !== "None" ? item.Category : null))
  //       .filter((item) => item !== null);

  //     setColors(new_colors);
  //     setUsages(new_usages);
  //     setCategories(new_categories);

  //     // Handle Color Frequency Response
  //     const colorFrequencyData = colorFrequencyResponse.data;
  //     const labels = colorFrequencyData.map((item) => item.Color);
  //     const data = colorFrequencyData.map((item) => item.ColorFrequency);

  //     setColorFrequencyData({
  //       labels: labels,
  //       datasets: [
  //         {
  //           data: data,
  //           backgroundColor: ["#ffb9b9", "#b9e8ff", "#ffe8b9", "#d0ffc2", "#edcefe","#ced5fe"], // Example colors
  //           hoverOffset: 4,
  //         },
  //       ],
  //     });

  //     console.log("APIs fetched successfully.");
  //   } catch (error) {
  //     console.error("Error fetching data from APIs:", error);
  //   }
  // };



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
      console.log("Recommendation Inputs Response:", response.data); // Log the response data to inspect its structure

      // Assuming response.data is an array of items:
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


  const fetchColorFrequency = async () => {
    try {
      // setLoading(true);
      // setError(null);
      const userId = localStorage.getItem("UserId");

      if (!userId) {
        console.error("UserId is not available in localStorage.");
        setError("UserId not found.");
        return;
      }


      const response = await axios.get(
        `http://localhost:5050/api/colorfrequency?UserId=${userId}&IntervalDays=${intervalDays}`
      );
      console.log('Response data:', response.data);
      if (response.data == undefined) {
        setShowChart(false);
        return;
      }

      // Process the response data for the pie chart
      const colorData = response.data;
      const labels = colorData.map(item => item.Color);
      const data = colorData.map(item => item.ColorFrequency);

      setColorFrequencyData({
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ["#ffb9b9",
              "#b9e8ff",
              "#ffe8b9",
              "#d0ffc2",
              "#edcefe",
              "#ced5fe",
              "#ffd9f9",
              "#c7ffe6"], // Example colors
            hoverOffset: 4
          }
        ]
      });
    } catch (error) {
      console.error("Error fetching color frequency:", error);
      setShowChart(false);
    }
    // finally {
    //   setLoading(false);
    // }
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
    // fetchRecommendationAndFreq();
  }, []);

  // useEffect(() => {
  //   fetchColorFrequency();
  // }, [intervalDays]);

  const handleIntervalChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setIntervalDays(value);
    }
  };

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

  const handleShowChart = () => {
    fetchColorFrequency();
    setShowChart(true);
  };

  const handleLogout = () => {
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    // <div className="closet-container">
    //   <h2>Today's Weather</h2>
    //   {weatherData && (
    //     <div>
    //       <p>
    //         <strong>Region:</strong>{" "}
    //         {weatherData.nearest_area[0].areaName[0].value}
    //       </p>
    //       <p>
    //         <strong>Temperature:</strong>{" "}
    //         {weatherData.current_condition[0].temp_C}°C
    //       </p>
    //       <p>
    //         <strong>Weather:</strong>{" "}
    //         {weatherData.current_condition[0].weatherDesc[0].value}
    //       </p>
    //     </div>
    //   )}

    //   <h2>Color Frequency Chart</h2>


    //   <div className="interval-input">
    //     <label htmlFor="intervalDays">Set Interval (Days): </label>
    //     <input
    //       type="number"
    //       id="intervalDays"
    //       min="0"
    //       value={intervalDays}
    //       onChange={(e) => setIntervalDays(parseInt(e.target.value, 10))}
    //     />
    //   </div>


    //   <button onClick={handleShowChart} className="show-chart-button">
    //     Show Chart
    //   </button>


    //   {showChart && (
    //     <div className="color-frequency-chart">
    //       {loading && <p>Loading chart...</p>}
    //       {error && <p className="error-message">{error}</p>}
    //       {colorFrequencyData && !loading ? (
    //         <>
    //           <h3>Color Frequency</h3>
    //           <Pie data={colorFrequencyData} />
    //         </>
    //       ) : null}
    //     </div>
    //   )}

    //   <h2>Today's Outfit recommendation</h2>


    //   <div className="dropdown">
    //     <label>Colors </label>
    //     <button onClick={toggleColorDropdown} className="dropdown-button">
    //       {selectedColors ? `Selected: ${selectedColors}` : "Select a Color"}
    //     </button>
    //     {isColorDropdownOpen && (
    //       <div className="dropdown-menu">
    //         {colors.map((color, index) => (
    //           <div key={index} className="dropdown-item">
    //             <input
    //               type="radio"
    //               name="color"
    //               checked={selectedColors === color}
    //               onChange={() => handleColorSelect(color)}
    //             />
    //             <label>{color}</label>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>



    //   <div className="dropdown">
    //     <label>Usages </label>
    //     <button onClick={toggleUsageDropdown} className="dropdown-button">
    //       {selectedUsages ? `Selected: ${selectedUsages}` : "Select a Usage"}
    //     </button>
    //     {isUsageDropdownOpen && (
    //       <div className="dropdown-menu">
    //         {usages.map((usage, index) => (
    //           <div key={index} className="dropdown-item">
    //             <input
    //               type="radio"
    //               name="usage"
    //               checked={selectedUsages.includes(usage)}
    //               onChange={() => handleUsageSelect(usage)}
    //             />
    //             <label>{usage}</label>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>

 
    //   <div className="dropdown">
    //     <label>Category </label>
    //     <button onClick={toggleCategoryDropdown} className="dropdown-button">
    //       {selectedCategory ? `Selected: ${selectedCategory}` : "Select a Category"}
    //     </button>
    //     {isCategoryDropdownOpen && (
    //       <div className="dropdown-menu">
    //         {categories.map((category, index) => (
    //           <div key={index} className="dropdown-item">
    //             <input
    //               type="radio"
    //               name="category"
    //               checked={selectedCategory.includes(category)}
    //               onChange={() => handleCategorySelect(category)}
    //             />
    //             <label>{category}</label>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>

    //   <button className="result-button" onClick={fetchClothes}>
    //     Show Results
    //   </button>

    //   <div className="clothes-gallery">
    //     {clothes.length > 0 ? (
    //       clothes.map((cloth, index) => (
    //         <div key={index} className="cloth-item">
    //           <img
    //             src={cloth[2]}
    //             alt={`Cloth ${cloth[1]}`}
    //             className="cloth-image"
    //           />
    //         </div>
    //       ))
    //     ) : (
    //       <p>No clothes found for the selected criteria.</p>
    //     )}
    //   </div>
    //   {showDescription && (
    //     <p className="recommendation-description">
    //       Our recommendation system ranks clothes using a scoring system based
    //       on user data and preferences, sorted from highest to lowest match for
    //       current conditions.
    //     </p>
    //   )}

    //   <button className="logout-button" onClick={handleLogout}>
    //     Log Out
    //   </button>
    // </div>


    <div className="closet-container">
  <div className="top-section">
    <div className="weather-section">
      <h2>Today's Weather</h2>
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
    </div>

    <div className="chart-section">
      <h2>Color Frequency Chart</h2>
      <div className="interval-input">
        <label htmlFor="intervalDays">Set Interval (Days): </label>
        <input
          type="number"
          id="intervalDays"
          min="1"
          value={intervalDays}
          onChange={(e) => setIntervalDays(parseInt(e.target.value, 10))}
        />
      </div>
      <button onClick={handleShowChart} className="show-chart-button">
        Show Chart
      </button>
      {showChart && (
        <div className="color-frequency-chart">
          {loading && <p>Loading chart...</p>}
          {error && <p className="error-message">{error}</p>}
          {colorFrequencyData && !loading ? (
            <>
              <h3>Color Frequency</h3>
              <Pie data={colorFrequencyData} />
            </>
          ) : null}
        </div>
      )}
    </div>
  </div>

  <div className="recommendation-section">
    <h2>Today's Outfit Recommendation</h2>
    <div className="dropdown">
         <label>Colors </label>
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



      <div className="dropdown">
        <label>Usages </label>
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

 
      <div className="dropdown">
        <label>Category </label>
        <button onClick={toggleCategoryDropdown} className="dropdown-button">
          {selectedCategory ? `Selected: ${selectedCategory}` : "Select a Category"}
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

      
  </div>
  <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
</div>

  );
};

export default TodayOutfit;
