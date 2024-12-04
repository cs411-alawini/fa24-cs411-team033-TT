import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TodayOutfit = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [colors, setColors] = useState([]);
  const [usages, setUsages] = useState([]);
  const [inputColor, setInputColor] = useState('');
  const [inputUsage, setInputUsage] = useState('');
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
        const userId = localStorage.getItem('UserId'); // Retrieve UserId
          if (!userId) {
              console.error("UserId is not available in localStorage.");
              return;
          }
        const response = await axios.get(`http://localhost:5050/api/recommendationInputs?UserId=${userId}`);
        const new_colors = response.data.map((item) => {
            if (item.Color != 'None') return item.Color;
        }).filter( item=> item !== undefined)
        
        setColors(new_colors);
        setInputColor(new_colors[0])
        console.log(new_colors)

        const new_usages = response.data.map((item) => {
            if (item.Usages != 'None') return item.Usages;
        }).filter( item=> item !== undefined)
        setUsages(new_usages);
        setInputUsage(new_usages[0])
        console.log(new_usages)
      } catch (error) {
        console.error('Error fetching clothes colors:', error);
      }
}
  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect( () => {
    fetchRecommendationInputs();
  }, []);

  const handleOnColorChange = (value) => {
    setInputColor(value)
  }
  const handleOnUsageChange = (value) => {
    setInputUsage(value)
  }

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="closet-container">
      <h1>Today's Weather</h1>
      {weatherData && (
        <div>
          <p><strong>Region:</strong> {weatherData.nearest_area[0].areaName[0].value}</p>
          <p><strong>Temperature:</strong> {weatherData.current_condition[0].temp_C}°C</p>
          <p><strong>Weather:</strong> {weatherData.current_condition[0].weatherDesc[0].value}</p>
        </div>
      )}
      <span>
      <label htmlFor="InputColor">Color</label>
      <button className='dropdown-menu'>{inputColor}</button>
      {
        colors.map((item, i)=> 
            <button key={i} className='dropdown-item'>{item}</button>
        )
      }
      <label htmlFor="InputUsages">Usages</label>
      <button className='dropdown-menu'>{inputUsage}</button>
      {
        usages.map((item, i)=> 
            <button key={i} className='dropdown-item'>{item}</button>
        )
      }
      </span>
      
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default TodayOutfit;