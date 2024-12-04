import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendResult = ({ inputColor, inputUsage, closeModal }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          const userId = localStorage.getItem('UserId'); // Retrieve UserId
          if (!userId) {
            console.error('UserId is not available in localStorage.');
            setError('User not logged in.');
            return;
          }
  
          const response = await axios.get(`http://localhost:5050/api/recommendations`, {
            params: {
              UserId: userId,
              Color: inputColor,
              Usage: inputUsage,
            },
          });
  
          setRecommendations(response.data);
        } catch (err) {
          console.error('Error fetching recommendations:', err);
          setError('Failed to fetch recommendations.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRecommendations();
    }, [inputColor, inputUsage]);



    if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recommendation-container">
      <h2>Recommended Outfits</h2>
      {recommendations.length > 0 ? (
        <div className="recommendation-grid">
          {recommendations.map((item) => (
            <div key={item.ClothId} className="recommendation-item">
              <img src={item.Image} alt={item.ClothName} className="item-image" />
              <div className="item-details">
                <p><strong>Name:</strong> {item.ClothName}</p>
                <p><strong>Category:</strong> {item.Category}</p>
                <p><strong>Color:</strong> {item.Color}</p>
                <p><strong>Usage:</strong> {item.Usages}</p>
                <p><strong>Temperature Level:</strong> {item.TemperatureLevel}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No recommendations available for the selected criteria.</p>
      )}
      <button onClick={closeModal} className="close-button">Close</button>
    </div>
  );
};

export default RecommendResult;

// function RecommendResult() {
//     return (
//         <div className="recommendation">
            
//         </div>
//     );
// }

// export default RecommendResult;