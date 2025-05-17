import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StaffLogin from './pages/StaffLogin';

// Main app with routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        {/* Add other routes later */}
        <Route path="/" element={<div>Home Page Placeholder</div>} />
      </Routes>
    </Router>
  );
};

export default App;