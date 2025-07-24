import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; 
import Login from './components/Login'; 
import Signup from './components/Signup';
import Home from './components/Home';
import Navbar from './components/Navbar';
import MedicalFiles from './components/medicalfiles';
import PageTransitionWrapper from './components/PageTransitionWrapper';
import Footer from './components/Footer';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/navbar" element={<PageTransitionWrapper><Navbar /></PageTransitionWrapper>} /> 
      <Route path="/login" element={<PageTransitionWrapper><Login /></PageTransitionWrapper>} /> 
      <Route path="/signup" element={<PageTransitionWrapper><Signup /></PageTransitionWrapper>} /> 
      <Route path="/home" element={<PageTransitionWrapper><Home /></PageTransitionWrapper>} /> 
      <Route path="/medicalfiles" element={<PageTransitionWrapper><MedicalFiles /></PageTransitionWrapper>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
