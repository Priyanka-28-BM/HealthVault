import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Navbar from './components/Navbar';
import MedicalFiles from './components/medicalfiles';
import Footer from './components/Footer';
import UpdatePassword from './Pages/UpdatePassword';
import ForgotPassword from './Pages/ForgotPassword';
import AuthRedirect from './Pages/AuthRedirect';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/medicalfiles" element={<MedicalFiles />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/auth-redirect" element={<AuthRedirect />} />


    </Routes >

      <Footer />
    </>
  );
}



export default App;
