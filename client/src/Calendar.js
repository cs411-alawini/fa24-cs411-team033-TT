import React, { useState, useEffect } from 'react';
import './styles/Calendar.css';
import logo from "./logo.png";
import axios from 'axios';

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [wearingHistory, setWearingHistory] = useState([]);
  const [popupData, setPopupData] = useState(null); // State for popup data
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  useEffect(() => {
    const fetchWearingHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/wearingHistory', {
          params: { UserId: 1 },
        });
        const data = response.data.map((item) => ({
          ...item,
          Date: new Date(item.Date),
        }));
        setWearingHistory(data);
      } catch (error) {
        console.error('Error fetching wearing history:', error);
      }
    };

    fetchWearingHistory();
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const history = wearingHistory.find(
      (entry) => entry.Date.toDateString() === date.toDateString()
    );
    calendarDays.push({
      date,
      history,
    });
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const currentMonthName = monthNames[currentMonth];

  // Open popup
  const openPopup = (history) => {
    setPopupData(history);
    setIsPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };

  return (
    <div className="closet-container">
      <header className="closet-header">
        <img className="logo" src={logo} alt="logo" />
        <nav className="navigation">
          <span className="nav-item">closet</span>
          <span className="nav-item">calendar</span>
          <span className="nav-item">today outfit</span>
        </nav>
      </header>

      <div className="calendar-header">
        <button className="nav-button" onClick={handlePrevMonth}>◀</button>
        <h2>{currentMonthName} {currentYear}</h2>
        <button className="nav-button" onClick={handleNextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day?.history ? '' : 'placeholder'}`}
            onClick={() => day?.history && openPopup(day.history)}
          >
            {day && (
              <>
                <span className="date">{day.date.getDate()}</span>
                {day.history && (
                  <div className="clothes-container">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const imageKey = `Cloth${num}Image`;
                      const nameKey = `Cloth${num}Name`;
                      return (
                        day.history[imageKey] && (
                          <img
                            key={num}
                            src={day.history[imageKey]}
                            alt={day.history[nameKey]}
                            title={day.history[nameKey]}
                            className="clothing-item"
                          />
                        )
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Worn Clothes</h3>
            {popupData ? (
              <ul>
                {[1, 2, 3, 4, 5].map((num, index) => {
                  const nameKey = `Cloth${num}Name`;
                  const idKey = `Cloth${num}Id`; // Assuming ClothId is available
                  return popupData[nameKey] ? (
                    <li key={index}>
                      <strong>#{index + 1}</strong>: {popupData[nameKey]} (ID: {popupData[idKey] || "N/A"})
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p>No data available</p>
            )}
            <button onClick={closePopup} className="close-popup">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;