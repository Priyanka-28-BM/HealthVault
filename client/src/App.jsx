import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Corrected imports
import Login from './components/Login'; // Import Login component
import Signup from './components/Signup'; // Import Signup component
import Home from './components/Home'; // Import Home component
import Navbar from './components/Navbar';
import MedicalFiles from './components/medicalfiles';

function App() {
  const [count, setCount] = useState(0); // Remove if not used

  return (
    <BrowserRouter>

    <Navbar/>
      <Routes>
        <Route path="/navbar" element={<Navbar />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/medicalfiles" element={<MedicalFiles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;