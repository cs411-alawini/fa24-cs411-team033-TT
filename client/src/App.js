import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Closet from './Closet'; // Import your Closet component
import Calendar from './Calendar'; // Import your Calendar component
import NavBar from './components/NavBar';

const App = () => {
  return (
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Closet />} /> {/* Default route */}
          <Route path="/closet" element={<Closet />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Router>
  );
};

export default App;