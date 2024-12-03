// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Closet from './Closet'; // Import your Closet component
// import Calendar from './Calendar'; // Import your Calendar component
// import NavBar from './components/NavBar';
// import Login from './Login';

// const App = () => {
//   return (
//       <Router>
//         <NavBar/>
//         <Routes>
//           <Route path="/" element={<Login />} /> {/* Default route */}
//           <Route path="/closet" element={<Closet />} />
//           <Route path="/calendar" element={<Calendar />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </Router>
//   );
// };

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Closet from './Closet'; // Import your Closet component
import Calendar from './Calendar'; // Import your Calendar component
import NavBar from './components/NavBar';
import Login from './Login';

const App = () => {
  const location = useLocation(); // Get the current location
  const pathsWithoutNavBar = ['/', '/login']; // Define routes without NavBar

  return (
    <>
      {/* Render NavBar only if the current path is not in pathsWithoutNavBar */}
      {!pathsWithoutNavBar.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/closet" element={<Closet />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

// Wrap App with Router
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
