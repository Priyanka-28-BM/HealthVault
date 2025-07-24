import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Login from './components/Login'; 
import Signup from './components/Signup';
import Home from './components/Home';
import Navbar from './components/Navbar';
import MedicalFiles from './components/medicalfiles';
import Footer from './components/Footer'; 

function App() {
  const [count, setCount] = useState(0); // Optional - can remove if unused

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/navbar" element={<Navbar />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/medicalfiles" element={<MedicalFiles />} />
      </Routes>

      <Footer /> 
    </BrowserRouter>
  );
}

export default App;
