// src/App.js
import React from 'react';
import Closet from './Closet';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      {/* <Closet /> */}
      <Calendar />
    </div>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Closet from './Closet'; // Import your Closet component
// import Calendar from './Calendar'; // Import your Calendar component

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Closet />} /> {/* Default route */}
//         <Route path="/closet" element={<Closet />} />
//         <Route path="/calendar" element={<Calendar />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;