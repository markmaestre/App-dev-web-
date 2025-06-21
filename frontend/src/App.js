import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Dashboard/Home';
import Register from './Components/Dashboard/Register';
import Login from './Components/Dashboard/Login';
import AdminDashboard from './Components/Admin/adminDashboard';
import UserDashboard from './Components/Client/userDashboard';
import CropGuide from './Components/Client/CropGuide'; 
import Learning from './Components/Client/learning'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/crop-guide" element={<CropGuide />} />
         <Route path="/elearning" element={<Learning />} />
      </Routes>
    </Router>
  );
}

export default App;
