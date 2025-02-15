import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Login from './components/Login'; 
import Signup from './components/Signup';
import Home from './components/Home';
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