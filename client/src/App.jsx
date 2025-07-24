import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import MedicalFiles from "./components/medicalfiles";
import { LandingPage } from "./components/LandingPage";
import Profile from "./components/Profile";
import { UserProvider } from "./context/UserContext.jsx";
import Footer from './components/Footer'; 


function App() {
  const [count, setCount] = useState(0); // Optional - can remove if unused

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* <Route path="/navbar" element={<Navbar />} />  */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/medicalfiles" element={<MedicalFiles />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      <Footer /> 
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
